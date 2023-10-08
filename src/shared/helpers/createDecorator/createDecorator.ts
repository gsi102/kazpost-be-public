// funcName<TCls, TMethod>(target: TCls, key: string, descriptor: TypedPropertyDescriptor<TMethod>): TypedPropertyDescriptor<TMethod> | void

type DecoratedFunction<T> = (
  self: T,
  originalMethod: Function,
  ...args: any[]
) => Promise<void> | void;

// Фабрика, возвращаемая функция которой вызывается компилятором
export function createDecorator<T = any>(action: DecoratedFunction<T>) {
  return (target: T, key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const _this = this as T;
      return action(_this, originalMethod, ...args);
    };
  };
}
