import { click } from "../../Helpers/ClickHandler";

function getElementByXpath(path, doc) {
  return document.evaluate(
    path,
    doc ?? document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

const enemy_id = document.URL.match(/id=([0-9]+)/);

export const RevivePet = async () => {
  const button_continue = getElementByXpath(
    "//input[contains(@value, 'Continue')]"
  );

  const form_data = new FormData();
  form_data.append("submit", "Confirm+%C2%BB");

  let credits_page = await fetch("https://blackdragon.mobi/credits/index/", {
    cache: "no-cache",
  });
  credits_page = await credits_page.text();
  credits_page = new DOMParser().parseFromString(credits_page, "text/html");

  const credits_link = getElementByXpath(
    "//a[contains(text(), 'Revive Pets')]",
    credits_page
  );

  let revive_pets_page = await fetch(credits_link.href, {
    cache: "no-cache",
  });
  revive_pets_page = await revive_pets_page.text();
  revive_pets_page = new DOMParser().parseFromString(
    revive_pets_page,
    "text/html"
  );

  let revive_link = getElementByXpath(
    "//a[contains(text(), 'Use')]",
    revive_pets_page
  );

  fetch(revive_link.href, {
    method: "GET",
    cache: "no-cache",
  });

  if (!click(button_continue))
    window.location.href = `https://blackdragon.mobi/units/view/id=${enemy_id[1]}/`;
};
