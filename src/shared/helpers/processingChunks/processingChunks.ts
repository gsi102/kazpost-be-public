import { PendingPromise } from "../PendingPromise";

/** Добавление задержки.
 * Для JSON API установлены следующие ограничения:
 * Не более 45 запросов за 3 секундный период от аккаунта
 * Не более 5 параллельных запросов от одного пользователя
 * Не более 20 параллельных запросов от аккаунта
 * Не более 8Кб (~ 8000символов) в заголовке запроса (url, User-Agent, Authorization и т.д.)
 * Не более 20 Мб данных в одном запросе, отправляемом на сервер
 * Не более 4 асинхронных задач в очереди на аккаунт
 */

export const processingChunks = async (requests: PendingPromise[]) => {
  const maxParallelUserRequsts = 4;
  let iteration = 0;
  const delayIncrement = 1000;

  const delayedRequest = (promise: PendingPromise) => {
    // DECORATOR
    // const quantificator = Math.floor(++iteration / maxParallelUserRequsts);
    // const delay = quantificator * delayIncrement;
    return promise.execute(0);
  };
  const dataSummary = (promisesResponses: any[]) => {
    return promisesResponses.reduce((summaryResult, response) => {
      const isEmptyObject = !Object.keys(summaryResult).length;
      if (isEmptyObject) return response;
      if (response.rows) {
        const isAlreadyRows = Array.isArray(summaryResult.rows);
        summaryResult.rows = isAlreadyRows
          ? summaryResult.rows.concat(response.rows)
          : response.rows;
      }
      return summaryResult;
    }, {});
  };

  return Promise.all(requests.map(delayedRequest))
    .then((promisesResponses) => dataSummary(promisesResponses))
    .catch((err) => {
      throw err;
    });
};
