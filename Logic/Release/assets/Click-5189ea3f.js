(() => {
const click = (path) => {
  if (!path)
    return false;
  let computedStyle = getComputedStyle(path);
  let elementWidth = Math.floor(parseInt(computedStyle.width));
  let elementHeight = Math.floor(parseInt(computedStyle.height));
  var clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: Math.floor(Math.random() * Math.floor(elementWidth)),
    clientY: Math.floor(Math.random() * Math.floor(elementHeight))
  });
  path.dispatchEvent(clickEvent);
  return true;
};
export {
  click as c
};
})()