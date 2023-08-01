import { click } from "../../Helpers/Click/Click.js";
import { extractConfirmVar } from "../../Helpers/confirmVar/extractConfirmVar.js";
import { extractCVar } from "../../Helpers/cVar/extractCVar.js";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath.js";

const continueButton = getElementByXPath(
  "//input[contains(@value, 'Continue')]"
);

const changeSets = async ({ desiredSet, otherSet, cVar }) => {
  // If sets are the same, dont change them
  if (desiredSet === otherSet) return null;

  const itemsPage = await fetch(
    `https://blackdragon.mobi/items/changeGear/set=${desiredSet}/c=${cVar}`,
    {
      cache: "no-cache",
    }
  );

  const raw = await itemsPage.text();

  return extractCVar(raw);
};

export const InitiateAutoBoost = async (baseSet, boostSet, boostAmount) => {
  if (!baseSet || !boostSet || !boostAmount) return null;
  let cVar = extractCVar(document.body.innerHTML);

  // Attempt to change to boost set and update cVar
  // Otherwise use old cVar
  cVar =
    (await changeSets({ desiredSet: boostSet, otherSet: baseSet, cVar })) ??
    cVar;

  // Go to the boosting page
  const boostingPage = await fetch(
    `https://blackdragon.mobi/credits/use/id=health/c=${cVar}`
  );
  const boostingPageRaw = await boostingPage.text();
  let confirmVar = extractConfirmVar(boostingPageRaw);

  // Append the necessary payload data for boosting page
  const formData = new FormData();
  formData.append("submit", "Confirm+%C2%BB");
  formData.append("count", boostAmount);

  const confirmPage = await fetch(
    `https://blackdragon.mobi/credits/use/id=health/confirm=${confirmVar}/c=${cVar}`,
    {
      method: "POST",
      cache: "no-cache",
      body: formData,
    }
  );
  const confirmPageRaw = await confirmPage.text();
  confirmVar = extractConfirmVar(confirmPageRaw);
  cVar = extractCVar(confirmPageRaw);

  // Funny enough, reconfirm also uses the exact same payload
  const reConfirmPage = await fetch(
    `https://blackdragon.mobi/credits/use/id=health/confirm=${confirmVar}/reconfirm=1/c=${cVar}`,
    {
      method: "POST",
      cache: "no-cache",
      body: formData,
    }
  );
  const reConfirmPageRaw = await reConfirmPage.text();
  cVar = extractCVar(reConfirmPageRaw);

  // Attempt to change to base set and update cVar
  cVar =
    (await changeSets({ desiredSet: baseSet, otherSet: boostSet, cVar })) ??
    cVar;

  // Monster is dead
  if (continueButton) return click(continueButton);

  // Keep attacking the monster if its alive
  const formElement = getElementByXPath("//form");
  const lastIndex = formElement.action.lastIndexOf("/");
  const baseFormAction = formElement.action.slice(0, lastIndex);
  formElement.action = `${baseFormAction}/c=${cVar}`;
  click(getElementByXPath("//input[@value='ATTACK →']"));
};
