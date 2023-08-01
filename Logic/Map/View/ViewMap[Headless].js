import { headlessAttack } from "../../Headless/Attack/headlessAttack";
import { extractCVar } from "../../Helpers/cVar/extractCVar";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";
import { getElementsByXPath } from "../../Helpers/Xpath/getElementsByXpath";

const config = {
  masterKey: true,
  collectIcons: false,
  highestFirst: false,
  randomEnemies: false,
  attackMarked: true,
  prioritizeRankOverName: true,
  headlessMode: true,

  avoidList: ["pixie"],
  priorityList: ["sprite"],
};

const headlessMode = async () => {
  const monsters = getElementsByXPath("//img[@alt='*']/parent::a");
  let cVar, reponse;

  for (let i = monsters.length - 1; i >= 0; i--) {
    const urlSplit = monsters.shift().href.split("/");
    id = urlSplit[5].split("=")[1];
    if (!cVar) {
      cVar = urlSplit[7].split("=")[1];
    }

    ({ cVar, reponse } = await headlessAttack({ id, cVar }));
  }

  location.reload();
};

(async () => {
  //   if (config.headlessMode) return await headlessMode();

  const cVar = extractCVar(document.body.innerHTML);
  const url = `https://blackdragon.mobi/items/changeStatus/id=350120098/c=${cVar}`;
  const response = await fetch(url);
  const raw = await response.text();

  const newCVar = extractCVar(raw);
  const url2 = `https://blackdragon.mobi/inbox/trade/confirm=1/id=30013133/nick=loli-1/c=${newCVar}`;
  const response2 = await fetch(url2);
  const raw2 = await response2.text();

  const newCVar2 = extractCVar(raw2);
  const url3 = `https://blackdragon.mobi/items/changeStatus/id=350120098/c=${newCVar2}`;
  const response3 = await fetch(url3);
  const raw3 = await response3.text();

  console.log(raw);
  console.log(raw2);
  console.log(raw3);

  //   const allData = Promise.all([response2, response]);

  // attach then() handler to the allData Promise
  //   allData.then((res) => {
  //     res.map((r) => {
  //       console.log(r);
  //     });
  //   });
})();
