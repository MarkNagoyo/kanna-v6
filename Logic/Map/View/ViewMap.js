import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync.js";
import { removeItemAsync } from "../../../Helpers/Storage/RemoveItem/RemoveItemAsync.js";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath.js";
import { getRandomElementByXpath } from "../../Helpers/Xpath/getRandomElementByXpath.js";
import { click } from "../../Helpers/Click/Click.js";

const keeperList = [
  "loynis",
  "coronius",
  "succubus",
  "septienna",
  "zubin",
  "dioxippe",
  "octavia",
  "conflux_storage",
  "storage_",
];

const mainFn = async () => {
  const Master = await getItemAsync("masterkey");
  const Map = await getItemAsync("map.status");
  const Highest = await getItemAsync("map.highestFirst");
  const randomEnemies = await getItemAsync("map.randomEnemies");
  const attackMarked = await getItemAsync("map.attackMarked");
  const collectIcons = await getItemAsync("map.collectIcons");
  const avoidFilter = (await getItemAsync("avoid_enemies_filter")) ?? [];
  const prioritizeFilter =
    (await getItemAsync("prioritize_enemies_filter")) ?? [];

  const Storage = await getItemAsync("storage.status");
  const storageReady = await getItemAsync("storage.ready");
  const storageLocation = await getItemAsync("storage.location");
  const currentLand = getElementByXPath(
    "//div[@class = 'list small']/strong"
  ).textContent;
  const isKeeperTown =
    currentLand.toLowerCase() === storageLocation?.toLowerCase();

  const Bosses = await getItemAsync("bosses.status");
  const selectedBoss = await getItemAsync("bosses.selectedBoss");

  const normalizedAvoidFilter = avoidFilter
    .map((monster) => `not(contains(@src, "${monster}"))`)
    .join(` and `);

  const normalizedPrioritizeFilter = prioritizeFilter
    .map((monster) => `contains(@src, "${monster}")`)
    .join(` or `);

  if (!Master) return null;

  if (Storage) {
    if (isKeeperTown) {
      if (!storageReady) {
        if (!click(getElementByXPath("//img[contains(@src, 'portal')]"))) {
          getElementByXPath("//a[contains(text(), '»')]").click();
        }
      } else {
        for (let i = 0; i < keeperList.length; i++) {
          const keeper = getElementByXPath(
            `//img[contains(@src,'${keeperList[i]}')]`
          );
          if (click(keeper)) break;
        }
      }
    }
  }

  if (Bosses && selectedBoss) {
    const normalizedBossName = selectedBoss.name
      .replace(/\s+/g, "_")
      .toLowerCase();

    const boss = getElementByXPath(`
    //img[
      contains(@src, '${normalizedBossName}')
      and contains(@src, 'r=${selectedBoss.rank}')
    ]`);

    if (boss) return click(boss);

    // We cant find the boss
    // Could be on top of it
    const isBelow = getElementByXPath(`//img[
        @class='unit shadow-lg round'
        and(contains(@src, '${normalizedBossName}'))
      ]/parent::td/parent::tr/td[2]/span[contains(text(), '(${selectedBoss.rank})')]`);

    if (isBelow) return isBelow.click();

    // We cant find the boss below either
    // Must have died
    await removeItemAsync("selectedBoss");
    location.href = "https://blackdragon.mobi/quests/index/";
    return null;
  }

  if (collectIcons && click(getElementByXPath("//img[@alt = '+']")))
    return true;

  if (!Map) return null;

  if (randomEnemies) {
    const prioritizedEnemy = getRandomElementByXpath(
      `//img[
            @alt="*"
            ${!attackMarked ? "and (contains(@class, 'unit'))" : ""}
            ${
              normalizedPrioritizeFilter
                ? `and (${normalizedPrioritizeFilter})`
                : ""
            }
            ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
          ]`
    );

    if (prioritizedEnemy) return click(prioritizedEnemy);

    if (!prioritizedEnemy) {
      const enemy = getRandomElementByXpath(
        `//img[
                  @alt="*"
                  ${!attackMarked ? "and (contains(@class, 'unit'))" : ""}
                  ${
                    normalizedAvoidFilter
                      ? `and (${normalizedAvoidFilter})`
                      : ""
                  }
                ]`
      );

      if (enemy) return click(enemy);

      return click(
        getElementByXPath(`//img[
        @class='unit shadow-lg round'
        ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
      ]`)
      );
    }
  }

  if (Highest) {
    for (let rank = 10; rank >= 0; rank--) {
      const enemy = getElementByXPath(
        `//img[
            @alt="*"
            ${!attackMarked ? "and (contains(@class, 'unit'))" : ""}
            ${
              normalizedPrioritizeFilter
                ? `and (${normalizedPrioritizeFilter})`
                : ""
            }
            ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
            and contains(@src, 'r=${rank}')
        ]`
      );

      if (enemy) {
        return click(enemy);
      }
    }

    // Another loop in case no priority enemies were found
    for (let rank = 10; rank >= 0; rank--) {
      const enemy = getElementByXPath(
        `//img[
            @alt="*"
            ${!attackMarked ? "and (contains(@class, 'unit'))" : ""}
            ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
            and contains(@src, 'r=${rank}')
        ]`
      );

      if (enemy) {
        return click(enemy);
      }
    }

    return click(
      getElementByXPath(`//img[
      @class='unit shadow-lg round'
      ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
    ]`)
    );
  }

  for (let rank = 0; rank <= 10; rank++) {
    const enemy = getElementByXPath(
      `//img[
            @alt="*"
            ${!attackMarked ? "and (contains(@class, 'unit'))" : ""}
            ${
              normalizedPrioritizeFilter
                ? `and (${normalizedPrioritizeFilter})`
                : ""
            }
            ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
            and contains(@src, 'r=${rank}')
        ]`
    );

    if (enemy) {
      return click(enemy);
    }
  }

  // Another loop in case no priority enemies were found
  for (let rank = 0; rank <= 10; rank++) {
    const enemy = getElementByXPath(
      `//img[
            @alt="*"
            ${!attackMarked ? "and (contains(@class, 'unit'))" : ""}
            ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
            and contains(@src, 'r=${rank}')
        ]`
    );

    if (enemy) {
      return click(enemy);
    }
  }

  return click(
    getElementByXPath(`//img[
    @class='unit shadow-lg round'
    ${normalizedAvoidFilter ? `and (${normalizedAvoidFilter})` : ""}
  ]`)
  );
};

mainFn();
