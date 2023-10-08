type PromiseAsArgs = {
  (resolve: (value: unknown) => void, reject: (reason?: any) => void): void;
};

export class PendingPromise {
  promiseItem;

  constructor(args: PromiseAsArgs) {
    this.promiseItem = args;
  }

  async execute(delay: number): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return new Promise(this.promiseItem);
  }
}
