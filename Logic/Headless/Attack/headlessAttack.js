import { extractCVar } from "../../Helpers/cVar/extractCVar";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";

export const headlessAttack = async ({ id, cVar, spellId, petId, petIdle }) => {
  const parser = new DOMParser();

  const formData = new FormData();
  formData.append("submit", "ATTACK+→");
  formData.append("spell", spellId ?? 0);
  formData.append("pet", petId ?? 0);
  formData.append("pet_idle", petIdle ?? 0);

  const enemyBattleResultResponse = await fetch(
    `https://blackdragon.mobi/battles/attackUnit/id=${id}/c=${cVar}`,
    {
      method: "POST",
      body: formData,
      cache: "force-cache",
    }
  );

  const enemyBattleResultRaw = await enemyBattleResultResponse.text();

  const enemyBattleResultParsed = parser.parseFromString(
    enemyBattleResultRaw,
    "text/html"
  );

  cVar = extractCVar(enemyBattleResultRaw);

  // Battle is not over, follow through
  if (
    getElementByXPath("//input[@value='ATTACK →']", enemyBattleResultParsed)
  ) {
    return await headlessAttack({ id, cVar, spellId, petId, petIdle });
  }

  return { cVar, response: enemyBattleResultParsed };
};
