import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";
import { SellItems } from "../../Inventory/Sell/SellItems";
import { RetrieveItems } from "../../Storage/Retrieve/RetrieveItems";
import { StoreItems } from "../../Storage/View/ViewStorage";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");
  const Storage = await getItemAsync("storage.status");
  const storageReady = await getItemAsync("storage.ready");
  const multiRetrievePlugin = await getItemAsync("plugins.multiRetrievePlugin");
  const Inventory = await getItemAsync("inventory.status");

  const keepButton = getElementByXPath(
    "//input[contains(@value, 'Keep Items')]"
  );

  if (!Master) return;

  // Initiate the storing process
  if (window.location.href.indexOf("action=keep_items") > 0) {
    if (Storage && storageReady) {
      StoreItems();
    }
  }

  // Inject the multi-item patch for storage
  if (window.location.href.indexOf("action=get_items") > 0) {
    const isInventoryFull = getElementByXPath(
      "//div[@class='block' and contains(text(), 'Sorry, your inventory is full!')]"
    );

    if (multiRetrievePlugin && !isInventoryFull) {
      RetrieveItems();
    }
  }

  // Initiate the selling process
  if (window.location.href.indexOf("action=sell") > 0 && Inventory) {
    return SellItems();
  }

  if (Storage && storageReady) click(keepButton);
};

mainFn();
