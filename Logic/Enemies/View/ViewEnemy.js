import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";
import { InitiateAutoBoost } from "../Boost/BoostHealth";
import { RestoreStaminaWithCredits } from "../Stamina/RestoreStaminaWithCredits";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");
  const Enemies = await getItemAsync("enemies.status");
  const AutoBoost = await getItemAsync("autoboost.status");

  const Inventory = await getItemAsync("inventory.status");

  if (!Master) return null;
  if (!Enemies) return null;

  const attackButton = getElementByXPath("//input[contains(@value, 'ATTACK')]");

  const refreshButton = getElementByXPath(
    "//input[contains(@value, 'Refresh')]"
  );
  const inventoryFull = getElementByXPath(
    "//*[contains(text(),'No space in your inventory')]"
  );

  const currentHealth = parseInt(
    getElementByXPath("//div[@class = 'small']/text()[2]").textContent.replace(
      /[^0-9]/g,
      ""
    )
  );
  const currentMana = parseInt(
    getElementByXPath("//div[@class = 'small']/text()[4]").textContent.replace(
      /[^0-9]/g,
      ""
    )
  );
  const currentStamina = parseInt(
    getElementByXPath("//div[@class = 'small']/text()[6]").textContent.replace(
      /[^0-9]/g,
      ""
    )
  );

  const enemiesMinHealth = parseInt(await getItemAsync("enemies.health"));
  const enemiesMinMana = parseInt(await getItemAsync("enemies.mana"));
  const enemiesMinStamina = parseInt(await getItemAsync("enemies.stamina"));

  const enemiesStaminaCredits = await getItemAsync("enemies.staminaCredits");
  const enemiesRestoreStaminaWithCredits = await getItemAsync(
    "enemies.restoreStaminaWithCredits"
  );

  const autoboostHealth = parseInt(await getItemAsync("autoboost.health"));
  const autoboostMana = parseInt(await getItemAsync("autoboost.mana"));
  const autoboostAmount = parseInt(await getItemAsync("autoboost.credits"));
  const autoboostBaseSet = parseInt(await getItemAsync("autoboost.baseSet"));
  const autoboostBoostSet = parseInt(await getItemAsync("autoboost.boostSet"));

  const healthPotion = await getItemAsync("enemies.health_potion");
  const manaPotion = await getItemAsync("enemies.mana_potion");

  const staminaPotion = getElementByXPath(
    "//a[contains(text(),'Stamina potion') and contains(text(), '»')]"
  );

  const Bosses = await getItemAsync("bosses.status");

  const hasOutleveledBoss = getElementByXPath(
    `//div[@class='center' and contains(text(), "Can't attack - this quest is not for your level.")]`
  );

  // Actual Logic
  // Starting With Autoboost
  if (
    AutoBoost &&
    (currentHealth <= autoboostHealth || currentMana <= autoboostMana) &&
    autoboostBaseSet &&
    autoboostBoostSet &&
    autoboostAmount
  ) {
    return InitiateAutoBoost(
      autoboostBaseSet,
      autoboostBoostSet,
      autoboostAmount
    );
  }

  // Check if stamina is below desired amount
  if (currentStamina <= enemiesMinStamina) {
    // Check if we have stamina potions first
    if (staminaPotion) return staminaPotion.click();

    // Else use credits to restore stamina if the user wants to
    if (enemiesRestoreStaminaWithCredits)
      return await RestoreStaminaWithCredits(enemiesStaminaCredits);
  }

  // Check if we need to use a health potion
  if (currentHealth <= enemiesMinHealth && healthPotion) {
    const healthPotionExists = getElementByXPath(
      `//a[contains(text(),'${healthPotion}')]`
    );

    if (healthPotionExists) {
      return healthPotionExists.click();
    }
  }

  // Check if we need to use a mana potion
  if (currentMana <= enemiesMinMana && manaPotion) {
    const manaPotionExists = getElementByXPath(
      `//a[contains(text(),'${manaPotion}')]`
    );

    if (manaPotionExists) {
      return manaPotionExists.click();
    }
  }

  // Check if inventory is full and we want to sell
  if (Inventory && inventoryFull) {
    return getElementByXPath("//a[contains(text(), 'Items')]").click();
  }

  // If monster isnt dead
  if (attackButton) return click(attackButton);

  // Check if boss mode is on and player has outleveled the boss
  if (Bosses && hasOutleveledBoss) {
    location.href = "https://blackdragon.mobi/quests/index/";
    return;
  }

  if (refreshButton) return click(refreshButton);

  return getElementByXPath("//a[contains(text(), 'Map')]").click();
};

mainFn();
