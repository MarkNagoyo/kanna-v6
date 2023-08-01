import { orderBy, pickBy, some, includes, values, sample } from "lodash";

import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../Helpers/Storage/SetItem/SetItemAsync";
import { click } from "../../Helpers/Click/Click";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";
import { getElementsByXPath } from "../../Helpers/Xpath/getElementsByXPath";

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");
  const Bosses = await getItemAsync("bosses.status");
  const blackList = await getItemAsync("bosses.avoidFilter");
  const priorityList = await getItemAsync("bosses.prioritizeFilter");
  const highestFirst = await getItemAsync("bosses.highestFirst");
  const randomBosses = await getItemAsync("bosses.randomBosses");

  if (!Master || !Bosses) return null;

  const bossList = getElementsByXPath("//div[@class='list']");
  let completeBossList = {};

  bossList.map((boss, index) => {
    completeBossList[index] = {};

    completeBossList[index].teleportLink = getElementByXPath(
      `//div[@class='list'][${index + 1}]/a`
    );

    completeBossList[index].imgSrc = getElementByXPath(
      `//div[@class='list'][${index + 1}]/img[@class='round']`
    ).src;
    completeBossList[index].name = getElementByXPath(
      `//div[@class='list'][${index + 1}]/strong`
    ).textContent;
    completeBossList[index].rank = parseInt(
      getElementByXPath(
        `//div[@class='list'][${index + 1}]/small`
      ).textContent.match(/\((.*?)\)/)[1]
    );
  });

  if (blackList && blackList.length > 0) {
    completeBossList = pickBy(completeBossList, (boss) => {
      return !some(blackList, (name) => includes(boss.name, name)); // check if the name property contains any blacklisted value
    });
  }

  if (priorityList && priorityList.length > 0) {
    const afterWhiteList = pickBy(completeBossList, (boss) => {
      return some(priorityList, (name) => includes(boss.name, name)); // check if the name property contains any prioritized value
    });

    if (Object.keys(afterWhiteList).length > 0) {
      completeBossList = afterWhiteList;
    }
  }

  completeBossList = orderBy(
    completeBossList,
    ["rank"],
    highestFirst ? ["desc"] : ["asc"]
  );

  let selectedBoss;

  if (randomBosses) {
    selectedBoss = sample(values(completeBossList));
  } else {
    selectedBoss = completeBossList[0];
    // completeBossList[0].teleportLink.click();
  }

  await setItemAsync("bosses.selectedBoss", selectedBoss);
  selectedBoss.teleportLink.click();
  // console.log({ completeBossList });
};

mainFn();
