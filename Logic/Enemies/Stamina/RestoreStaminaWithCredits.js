import { click } from "../../Helpers/Click/Click";
import { extractConfirmVar } from "../../Helpers/confirmVar/extractConfirmVar";
import { extractCVar } from "../../Helpers/cVar/extractCVar";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

const continueButton = getElementByXPath(
  "//input[contains(@value, 'Continue')]"
);

export const RestoreStaminaWithCredits = async (amount) => {
  if (!amount) return null;

  let cVar = extractCVar(document.body.innerHTML);

  const staminaPage = await fetch(
    `https://blackdragon.mobi/credits/use/id=stamina/c=${cVar}`
  );
  const staminaPageRaw = await staminaPage.text();

  let confirmVar = extractConfirmVar(staminaPageRaw);
  cVar = extractCVar(staminaPageRaw);

  // Append the necessary payload data for restore page
  const formData = new FormData();
  formData.append("submit", "Confirm+%C2%BB");
  formData.append("count", amount);

  const confirmPage = await fetch(
    `https://blackdragon.mobi/credits/use/id=stamina/confirm=${confirmVar}/c=${cVar}`,
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
    `https://blackdragon.mobi/credits/use/id=stamina/confirm=${confirmVar}/reconfirm=1/c=${cVar}`,
    {
      method: "POST",
      cache: "no-cache",
      body: formData,
    }
  );
  const reConfirmPageRaw = await reConfirmPage.text();
  cVar = extractCVar(reConfirmPageRaw);

  if (continueButton) return click(continueButton);

  // Keep attacking the monster if its alive
  const formElement = getElementByXPath("//form");
  const lastIndex = formElement.action.lastIndexOf("/");
  const baseFormAction = formElement.action.slice(0, lastIndex);
  formElement.action = `${baseFormAction}/c=${cVar}`;
  click(getElementByXPath("//input[@value='ATTACK →']"));
};
