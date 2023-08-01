export const extractConfirmVar = (body) => {
  const firstInstance = body.indexOf("confirm=");

  return body.substring(firstInstance + 2, firstInstance + 7);
};
