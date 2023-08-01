import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../Helpers/Storage/SetItem/SetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

const Select = (xpath, select) => {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  for (let i = 0; i < result.snapshotLength; i++) {
    const item = result.snapshotItem(i).parentElement;
    const checkbox = item.getElementsByTagName("input")[0];
    checkbox.checked = select;
  }
};

export const SelectItems = async () => {
  const selectFilter = await getItemAsync("inventory.select");
  const unselectFilter = await getItemAsync("inventory.unselect");

  if (unselectFilter) {
    for (let i = 0; i < unselectFilter.length; i++) {
      Select(
        `//div[@class='list']/label/*[contains(text(), "${unselectFilter[i]}")]`,
        false
      );
    }
  }

  if (selectFilter) {
    for (let i = 0; i < selectFilter.length; i++) {
      Select(
        `//div[@class='list']/label/*[contains(text(), "${selectFilter[i]}")]`,
        true
      );
    }
  }

  click(getElementByXPath("//input[contains(@value,'Continue')]"));
};
