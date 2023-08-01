export const getElementsByXPath = (xpath, doc) => {
  const results = [];
  const xpathResult = document.evaluate(
    xpath,
    doc ?? document,
    null,
    XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
    null
  );

  let node;
  while ((node = xpathResult.iterateNext())) {
    results.push(node);
  }

  return results;
};
