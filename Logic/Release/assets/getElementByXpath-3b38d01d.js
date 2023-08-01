const a=async(e,t)=>(await chrome.storage.local.get(e))[e],n=(e,t)=>document.evaluate(e,t??document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;export{n as a,a as g};
