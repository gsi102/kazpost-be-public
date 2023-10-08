import { Nullable } from "@/shared/types/helpers";
import { createDecorator } from "@/shared/helpers/createDecorator";

interface IDelayedRequest<T, S> {
  requestLimits: T;
  storage: S;
  setRequestLimits(key: keyof T, value: Nullable<number>): void;
  setStorage(key: keyof S, value: unknown): void;
  resetTimer(timerName: keyof S): void;
  getLimits(): T;
}
export abstract class DelayedRequest<T, S> implements IDelayedRequest<T, S> {
  requestLimits: T;
  storage: S;
  constructor() {
    this.requestLimits = {} as T;
    this.storage = {} as S;
  }

  setRequestLimits(key: keyof T, value: Nullable<number>) {
    (this.requestLimits as { [k: string]: Nullable<number> })[key as string] =
      value;
    return;
  }

  setStorage(key: keyof S, value: unknown) {
    (this.storage as { [p: string]: unknown })[key as string] = value;
    return;
  }

  resetTimer(timerName: keyof S) {
    clearTimeout(this.storage[timerName] as NodeJS.Timeout);
    return;
  }

  getLimits() {
    return this.requestLimits;
  }
}

/** Для JSON API установлены следующие ограничения:
 * @header X-Lognex-Retry-TimeInterval - Интервал в миллисекундах, в течение которого можно сделать эти запросы
 * @limit 3 секунды
 *
 * @header X-RateLimit-Limit - Количество запросов, которые равномерно можно сделать в течение интервала до появления 429 ошибки
 * @limit 45 запросов
 *
 * @header X-RateLimit-Remaining  - Число запросов, которые можно отправить до получения 429 ошибки
 * @limit < 45 запросов
 *
 * @header X-Lognex-Reset - Время до сброса ограничения в миллисекундах. Равно нулю, если ограничение не установлено
 * @header X-Lognex-Retry-After - Время до сброса ограничения в миллисекундах.
 *
 * Не более 5 параллельных запросов от одного пользователя
 * Не более 20 параллельных запросов от аккаунта
 * Не более 8Кб (~ 8000символов) в заголовке запроса (url, User-Agent, Authorization и т.д.)
 * Не более 20 Мб данных в одном запросе, отправляемом на сервер
 * Не более 4 асинхронных задач в очереди на аккаунт
 */
type RequestLimits = {
  reset: Nullable<number>;
  retryTimeInterval: Nullable<number>;
  retryAfter: Nullable<number>;
  rateLimit: Nullable<number>;
  rateLimitRemaining: Nullable<number>;
};

type Storage = {
  exponentDelayRatio: number;
  keepCleanUpTimer: Nullable<NodeJS.Timeout>;
};

export const delayedRequest = () =>
  createDecorator<IDelayedRequest<RequestLimits, Storage>>(
    async (self, method, ...args) => {
      const { retryTimeInterval, rateLimit, rateLimitRemaining } =
        self.requestLimits;
      // Если текущие значения X-Lognex-Retry-TimeInterval, X-RateLimit-Limit,
      // X-RateLimit-Remaining не получены, то, вероятно, запросы не отправлялись в последние 3 секунды.
      // В ожидании нет необходимости.
      if (
        retryTimeInterval === null ||
        rateLimit === null ||
        rateLimitRemaining === null
      ) {
        return method.call(self, ...args);
      }
      const { exponentDelayRatio } = self.storage;

      // Доля оставшегося лимита
      const waterline = rateLimitRemaining / rateLimit;
      // Стандартная задержка на 1 запрос
      const standartDelay = retryTimeInterval / rateLimit;
      // Если какое-то количество лимита уже израсходовано, то задержку необходимо увеличить.
      // Задержка увеличивается во столько раз, во сколько израсходованной доли больше оставшейся.
      // Т.е. предполагается, что предыдующие запросы были равномерно распределены. И все предыдущее время делится на оставшиеся запросы.
      // exponentDelayRatio - "агрессивность"
      const k = exponentDelayRatio * (1 / waterline - 1);

      let delay = k * standartDelay;
      if (delay > 3000) delay = 3000;

      await new Promise((res) => setTimeout(() => res(true), delay));

      return method.call(self, ...args);
    }
  );

export const editLimits = () =>
  createDecorator<IDelayedRequest<RequestLimits, Storage>>(
    async (self, method, ...args) => {
      let headers = null;
      try {
        const response = await method.call(self, ...args);
        headers = response.headers;
        return response.data;
      } catch (err) {
        throw err;
      } finally {
        if (headers) {
          for (const [key, val] of Object.entries(headers)) {
            let prop: Nullable<keyof RequestLimits> = null;
            switch (key) {
              case "x-lognex-reset":
                prop = "reset";
                break;
              case "x-lognex-retry-after":
                prop = "retryAfter";
                break;
              case "x-lognex-retry-timeinterval":
                prop = "retryTimeInterval";
                break;
              case "x-ratelimit-remaining":
                prop = "rateLimitRemaining";
                break;
              case "x-ratelimit-limit":
                prop = "rateLimit";
                break;
              default:
                break;
            }
            if (!prop) continue;
            const value = Number(val);
            self.setRequestLimits(prop, value);
          }

          self.resetTimer("keepCleanUpTimer");
          self.setStorage(
            "keepCleanUpTimer",
            setTimeout(() => {
              for (const [key, val] of Object.entries(self.requestLimits)) {
                self.setRequestLimits(key as keyof RequestLimits, null);
              }
              self.resetTimer("keepCleanUpTimer");
            }, 3000)
          );
        }
      }
    }
  );
