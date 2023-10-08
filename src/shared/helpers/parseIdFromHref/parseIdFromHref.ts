export const parseIdFromHref = (href: string) => {
  const id = /.*\/([^\/\?]+)/.exec(href)?.[1];
  if (!id) return "";
  return id;
};
