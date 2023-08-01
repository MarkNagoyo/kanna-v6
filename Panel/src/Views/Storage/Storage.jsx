import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";
import storageList from "../../Assets/JSON/storageList.json";
import { useEffect, useState } from "react";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import Select from "react-select";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";
import { removeItemAsync } from "../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import { Category } from "../../Components/Category/Category";
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
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    paddingLeft: "0.5rem",
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

export const Storage = () => {
  const [amount, setAmount] = useState();
  const [storageLocation, setStorageLocation] = useState();
  const [formattedStorageInput, setFormattedStorageInput] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const amountFromStorage = getItemAsync("storage.amount");
    const locationFromStorage = getItemAsync("storage.location");

    Promise.all([amountFromStorage, locationFromStorage]).then((values) => {
      setAmount(values[0]);
      setStorageLocation(values[1]);
      setDataLoaded(true);
    });

    const final = [];

    Object.keys(storageList).map((slug) => {
      const formatted = {};

      formatted.value = slug;
      formatted.label = storageList[slug];

      final.push(formatted);
    });

    setFormattedStorageInput(final);
  }, []);

  if (!formattedStorageInput || !dataLoaded) return null;

  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex flex-column justify-center items-center flex-wrap max-width-1 stretch">
        <div className="flex flex-row my2">
          <Toggle
            slug="storage.status"
            displayName="Store|Items"
            className="mr1 px2 py1"
          />
        </div>

        <div className="flex self-start stretch justify-between items-center border-box">
          {amount && amount > 0 && (
            <span className="pl1">
              When <b>Inventory</b> has <b>{amount}</b> items
            </span>
          )}
          {(isNaN(amount) || amount <= 0) && (
            <span className="pl1"> Dont store items</span>
          )}
          <input
            type="number"
            max={99}
            defaultValue={amount}
            className="border border-primary center rounded p1 ml1"
            onChange={(e) => {
              if (e.target.value === "") {
                removeItemAsync("storage.amount");
                setAmount(null);
                return null;
              }
              if (isNaN(parseInt(e.target.value))) return null;

              if (e.target.value.length > 2) {
                e.target.value = 99;
                // return null;
              }

              setItemAsync("storage.amount", e.target.value).then(() => {
                setAmount(e.target.value);
              });
            }}
          />
        </div>

        <div className="flex justify-between content-stretch stretch items-center mt1">
          <span className="pl1">Store at</span>

          <Select
            isSearchable={false}
            defaultValue={{
              value: storageLocation,
              label: storageList[storageLocation],
            }}
            onChange={(e) => {
              setItemAsync("storage.location", e.value).then(() => {
                setStorageLocation(e.value);
              });
            }}
            options={formattedStorageInput}
            unstyled={true}
            closeMenuOnScroll={true}
            openMenuOnFocus={true}
            classNames={classNames}
            styles={styles}
          />
        </div>

        {/* <Category slug="storagesorter" displayName="Storage|Sorter" /> */}
      </div>
    </div>
  );
};
