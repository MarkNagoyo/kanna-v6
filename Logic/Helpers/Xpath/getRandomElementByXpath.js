export const getRandomElementByXpath = (xpath, doc) => {
  // Get all elements that match the xpath
  const matchingElements = document.evaluate(
    xpath,
    doc ?? document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  // If no elements match the xpath, return null
  if (matchingElements.snapshotLength === 0) {
    return null;
  }

  // Get a random index between 0 and the number of matching elements
  const randomIndex = Math.floor(
    Math.random() * matchingElements.snapshotLength
  );

  // Return the element at the random index
  return matchingElements.snapshotItem(randomIndex);
};
