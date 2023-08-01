import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";
import potionList from "../../Assets/JSON/potionList.json";
import { useEffect, useState } from "react";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import Select from "react-select";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";
import { removeItemAsync } from "../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";

const styles = {
  // control: (baseStyles, state) => ({
  //   border: "1px solid #333",
  //   paddingLeft: "0.5rem",
  //   paddingRight: "0.5rem",
  // }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "#1f1f1f",
    display: "flex",
    justifySelf: "stretch",
  }),
  option: (baseStyles, state) => ({
    padding: "0.5rem",
    border: "1px solid #333",
    cursor: state.isFocused ? "pointer" : "default",
    wordWrap: "break-word",
  }),
  noOptionsMessage: () => ({
    border: "1px solid #333",
    padding: "0.5rem",
  }),

  // input: () => ({}),
  clearIndicator: () => ({ backgroundColor: "red" }),
};

const classNames = {
  // control: () => "rounded border border-primary",
  container: () =>
    "rounded border border-primary flex flex-auto stretch pl1 ml1",
  control: () => "flex flex-auto",
  option: () => "hoverable cursor-pointer",
};

export const Enemies = () => {
  const [health, setHealth] = useState();
  const [mana, setMana] = useState();
  const [stamina, setStamina] = useState();
  const [healthPotion, setHealthPotion] = useState();
  const [manaPotion, setManaPotion] = useState();
  const [restoreStaminaWithCredits, setRestoreStaminaWithCredits] = useState();
  const [staminaCredits, setStaminaCredits] = useState();
  const [formattedPotionInput, setFormattedPotionInput] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const healthFromStorage = getItemAsync("enemies.health");
    const manaFromStorage = getItemAsync("enemies.mana");
    const staminaFromStorage = getItemAsync("enemies.stamina");
    const selectedHealthPotion = getItemAsync("enemies.health_potion");
    const selectedManaPotion = getItemAsync("enemies.mana_potion");
    const restoreStaminaWithCredits = getItemAsync(
      "enemies.restoreStaminaWithCredits"
    );
    const staminaCredits = getItemAsync("enemies.staminaCredits");

    Promise.all([
      healthFromStorage,
      manaFromStorage,
      staminaFromStorage,
      selectedHealthPotion,
      selectedManaPotion,
      restoreStaminaWithCredits,
      staminaCredits,
    ]).then((values) => {
      setHealth(values[0]);
      setMana(values[1]);
      setStamina(values[2]);
      setHealthPotion(values[3] ?? null);
      setManaPotion(values[4] ?? null);
      setRestoreStaminaWithCredits(values[5]);
      setStaminaCredits(values[6]);
      setDataLoaded(true);
    });

    const final = [];

    Object.keys(potionList).map((slug) => {
      const formatted = {};

      formatted.value = slug;
      formatted.label = potionList[slug];

      final.push(formatted);
    });

    setFormattedPotionInput(final);
  }, []);

  if (!formattedPotionInput || !dataLoaded) return null;

  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex flex-column justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="enemies.status"
          displayName="Attack|Enemies"
          className="my2 px2 py1"
        />
        <div className="flex self-start stretch justify-between items-center border-box">
          <span className="pl1">
            When <b>HEALTH</b> is below
          </span>
          <input
            type="number"
            defaultValue={health}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("enemies.health");
                setHealth(null);
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              setItemAsync("enemies.health", e.target.value).then(() => {
                setHealth(e.target.value);
              });
            }}
          />
        </div>
        <div className="flex justify-between content-stretch stretch items-center">
          <span className="pl1">Use</span>

          <Select
            isSearchable={false}
            defaultValue={{
              value: healthPotion,
              label: potionList[healthPotion],
            }}
            onChange={(e) => {
              setItemAsync("enemies.health_potion", e.value).then(() => {
                setHealthPotion(e.value);
              });
            }}
            options={formattedPotionInput}
            unstyled={true}
            closeMenuOnScroll={true}
            openMenuOnFocus={true}
            classNames={classNames}
            styles={styles}
          />
        </div>
        <div className="flex self-start stretch justify-between items-center border-box mt3">
          <span className="pl1">
            When <b>MANA</b> is below
          </span>
          <input
            type="number"
            defaultValue={mana}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("enemies.mana");
                setMana(null);
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              setItemAsync("enemies.mana", e.target.value).then(() => {
                setMana(e.target.value);
              });
            }}
          />
        </div>
        <div className="flex justify-between content-stretch stretch items-center">
          <span className="pl1">Use</span>

          <Select
            isSearchable={false}
            defaultValue={{
              value: manaPotion,
              label: potionList[manaPotion],
            }}
            options={formattedPotionInput}
            unstyled={true}
            closeMenuOnScroll={true}
            openMenuOnFocus={true}
            classNames={classNames}
            styles={styles}
            onChange={(e) => {
              setItemAsync("enemies.mana_potion", e.value).then(() => {
                setManaPotion(e.value);
              });
            }}
          />
        </div>
        <div className="flex self-start stretch justify-between items-center border-box mt3">
          <span className="pl1">
            Restore <b>STAMINA</b> below
          </span>
          <input
            type="number"
            defaultValue={stamina}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("enemies.stamina");
                setStamina(null);
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              setItemAsync("enemies.stamina", e.target.value).then(() => {
                setStamina(e.target.value);
              });
            }}
          />
        </div>
        <Toggle
          slug="enemies.restoreStaminaWithCredits"
          displayName="Use credits for stamina"
          className="my2 px2 py1"
          onStatusChange={setRestoreStaminaWithCredits}
        />

        {restoreStaminaWithCredits && (
          <div className="flex flex-row items-center stretch max-width-1">
            <span>Credits to use:</span>
            <input
              type="number"
              defaultValue={staminaCredits}
              className="border border-primary center rounded p1 ml1 flex flex-auto"
              onChange={(e) => {
                if (e.target.value === "") {
                  removeItemAsync("enemies.staminaCredits");
                  setStaminaCredits(null);
                  return null;
                }
                if (isNaN(parseInt(e.target.value))) return null;

                setItemAsync("enemies.staminaCredits", e.target.value).then(
                  () => {
                    setStaminaCredits(e.target.value);
                  }
                );
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
