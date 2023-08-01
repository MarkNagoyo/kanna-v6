// import { click } from "../../Helpers/ClickHandler";
// import {
//   getItemAsync,
//   setItemAsync,
// } from "../../panel/src/Helpers/DataHandler";
// import { SelectItems } from "../Selection/SelectItems";
import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../Helpers/Storage/SetItem/SetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";
import { SelectItems } from "../Select/SelectItems";

export const SellItems = async () => {
  const inventoryEmpty =
    getElementByXPath("//div[@class = 'list']").textContent === "Empty.";

  const storageReady = await getItemAsync("storage.ready");
  const Storage = await getItemAsync("storage.status");
  const selectFilter = await getItemAsync("inventory.select");
  // If we have selected all of the items
  if (window.location.href.indexOf("all=1") > 0) {
    return SelectItems();
  }

  // If we are in the confirmation page
  if (window.location.href.indexOf("confirm=0") > 0) {
    const itemsLeft =
      100 -
      parseInt(getElementByXPath("//div[@class = 'list']/strong").textContent);
    const storageAmount = parseInt(await getItemAsync("storage.amount"));

    if (!isNaN(storageAmount) && storageAmount <= itemsLeft) {
      setItemAsync("storage.ready", true);
    }

    return click(getElementByXPath("//input[contains(@value, 'Confirm')]"));
  }

  // If we are in the post-sale page
  if (window.location.href.indexOf("confirm=1") > 0) {
    if (Storage && storageReady) {
      window.location.href = "https://blackdragon.mobi/maps/change/";
      return;
    }

    return getElementByXPath("//a[contains(text(), 'Map')]").click();
  }

  // We select everything if we have it in the filter
  if (selectFilter && selectFilter.includes("everything")) {
    return getElementByXPath("//a[contains(text(), 'Select all')]").click();
  }

  // We just select the items in the filters afterwards
  return SelectItems();
};
