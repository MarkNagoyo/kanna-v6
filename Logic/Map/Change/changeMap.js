import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync.js";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath.js";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");

  const Storage = await getItemAsync("storage.status");
  const storageReady = await getItemAsync("storage.ready");
  const storageLocation = await getItemAsync("storage.location");

  if (Master && Storage && storageLocation && storageReady) {
    getElementByXPath(`//a[contains(text(), '${storageLocation}')]`).click();
  }
};

mainFn();
