import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");

  const Bosses = await getItemAsync("bosses.status");
  const selectedBoss = await getItemAsync("bosses.selectedBoss");

  if (!Master) return null;

  if (Bosses && selectedBoss)
    getElementByXPath("//input[@value='Continue »']").click();
};

mainFn();
