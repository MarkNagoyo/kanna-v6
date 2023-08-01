import { useEffect, useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import Select from "react-select";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { removeItemAsync } from "../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";
import { isAuthenticated } from "../../../../Helpers/Auth/Authentication";
export const autoBoostLoader = async () => {
  await isAuthenticated({ redirectOnUnauth: true, redirect });

  const health = (await getItemAsync("autoboost.health")) ?? 0;
  const mana = (await getItemAsync("autoboost.mana")) ?? 0;
  const credits = (await getItemAsync("autoboost.credits")) ?? 0;

  const baseSet = await getItemAsync("autoboost.baseSet");
  const boostSet = await getItemAsync("autoboost.boostSet");

  return {
    health,
    mana,
    credits,
    baseSet,
    boostSet,
  };
};

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
};

const classNames = {
  // control: () => "rounded border border-primary",
  container: () => "rounded border border-primary flex flex-auto stretch",
  control: () => "flex flex-auto px1",
  option: () => "hoverable cursor-pointer",
};

const setInputs = [
  { value: "null", label: "Dont Change" },
  { value: "1", label: "Set #1" },
  { value: "2", label: "Set #2" },
  { value: "3", label: "Set #3" },
];

export const AutoBoost = () => {
  const { health, mana, credits, baseSet, boostSet } = useLoaderData();

  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex flex-column justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="autoboost.status"
          displayName="Auto|Boost"
          className="my2 px2 py1"
        />

        <span className="mb1">Boost Health & Mana when:</span>

        <div className="flex flex-row items-center justify-between stretch">
          <span className="ml1">Health is below</span>
          <input
            type="number"
            defaultValue={health}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("autoboost.health");
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              setItemAsync("autoboost.health", e.target.value).catch();
            }}
          />
        </div>

        <div className="flex flex-row items-center justify-between stretch">
          <span className="ml1">Mana is below</span>
          <input
            type="number"
            defaultValue={mana}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("autoboost.mana");
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              setItemAsync("autoboost.mana", e.target.value).catch();
            }}
          />
        </div>

        <div className="flex flex-row items-center justify-between stretch mt1">
          <span className="ml1">Credits to use</span>
          <input
            type="number"
            defaultValue={credits}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("autoboost.credits");
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              setItemAsync("autoboost.credits", e.target.value).catch();
            }}
          />
        </div>

        <div className="flex flex-row justify-around stretch mt1">
          <div
            className="flex flex-column px1 items-center"
            style={{ width: "50%" }}
          >
            <span className="mb1">Base Set</span>

            <Select
              isSearchable={false}
              defaultValue={{
                value: baseSet,
                label: baseSet === "null" ? "Dont Change" : baseSet,
              }}
              onChange={(e) => {
                setItemAsync("autoboost.baseSet", e.value).catch();
              }}
              options={setInputs}
              unstyled={true}
              closeMenuOnScroll={true}
              openMenuOnFocus={true}
              classNames={classNames}
              styles={styles}
            />
          </div>

          <div
            className="flex flex-column px1 items-center"
            style={{ width: "50%" }}
          >
            <span className="mb1">Boost Set</span>

            <Select
              isSearchable={false}
              defaultValue={{
                value: boostSet,
                label: boostSet === "null" ? "Dont Change" : boostSet,
              }}
              onChange={(e) => {
                setItemAsync("autoboost.boostSet", e.value).catch();
              }}
              options={setInputs}
              unstyled={true}
              closeMenuOnScroll={true}
              openMenuOnFocus={true}
              classNames={classNames}
              styles={styles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
