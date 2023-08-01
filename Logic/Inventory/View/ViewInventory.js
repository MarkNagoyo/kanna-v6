import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");
  const Inventory = await getItemAsync("inventory.status");

  if (Master && Inventory) {
    click(getElementByXPath("//input[contains(@value, 'SELL')]"));
  }
};

mainFn();
