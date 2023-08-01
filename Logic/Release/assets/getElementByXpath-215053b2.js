(() => {
const getItemAsync = async (key, isArray) => {
  return (await chrome.storage.local.get(key))[key];
};
const getElementByXPath = (xpath, doc) => {
  return document.evaluate(
    xpath,
    doc ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
};
export {
  getElementByXPath as a,
  getItemAsync as g
};
})()