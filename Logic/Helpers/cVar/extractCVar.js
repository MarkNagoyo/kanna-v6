export const extractCVar = (body) => {
  const firstInstance = body.indexOf("/c=");

  return body.substring(firstInstance + 3, firstInstance + 8);
};
