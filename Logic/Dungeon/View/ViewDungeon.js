import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");
  const Dungeon = await getItemAsync("dungeon.status");
  const Teleport = await getItemAsync("dungeon.autoPortal");
  const ignoreShops = await getItemAsync("dungeon.ignoreShops");

  const Enemy = getElementByXPath(`//img[contains(@src, 'units')]`);
  const portalImage = getElementByXPath("//img[contains(@src, 'portal')]");
  const portalText = getElementByXPath("//a[contains(text(), 'Level')]");
  const Shop = getElementByXPath("//img[contains(@src, 'shop.jpg')]");

  const nextButton = getElementByXpath("//input[contains(@value, 'Continue')]");

  if (!Master || !Dungeon) return;

  if (Enemy) return click(Enemy);
  if (nextButton) return click(nextButton);

  if (Teleport && (ignoreShops || !Shop)) {
    click(portalImage) ?? portalText.click();
  }
};

mainFn;
