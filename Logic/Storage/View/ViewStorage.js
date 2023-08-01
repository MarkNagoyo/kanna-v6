import { setItemAsync } from "../../../Helpers/Storage/SetItem/SetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

export const StoreItems = () => {
  const storeAllButton = getElementByXPath(
    "//input[contains(@value, 'Keep all')]"
  );
  const confirmButton = getElementByXPath(
    "//input[contains(@value, 'Confirm')]"
  );

  click(storeAllButton);

  if (window.location.href.indexOf("confirm=0") > 0) {
    click(confirmButton);
  } else if (window.location.href.indexOf("confirm=1") > 0) {
    setItemAsync("storage.ready", false);
    getElementByXPath("//a[contains(text(), 'Map')]").click();
  }
};
