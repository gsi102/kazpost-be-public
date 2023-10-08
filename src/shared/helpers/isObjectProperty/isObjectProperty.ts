export const isObjectProperty = (
  obj: { [k: string]: any },
  prop: string
): boolean =>
  Boolean(obj && Object.prototype.hasOwnProperty.call(obj, prop) && obj[prop]);
