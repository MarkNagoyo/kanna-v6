export const getElementByXPath = (xpath, doc) => {
  return document.evaluate(
    xpath,
    doc ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
};
