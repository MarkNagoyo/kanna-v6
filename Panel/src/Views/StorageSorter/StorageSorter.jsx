import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";
import Select from "react-select";
import makeAnimated from "react-select/animated";

export const storageSorterLoader = async () => {
  return null;
};

const data = [
  { type: "Scrolls", keeper: "Assassin's", status: "Finished" },
  { type: "Runes", keeper: "Kreegan", status: "Sorting" },
  { type: "Recipes", keeper: "Alamut", status: "Queued" },
];

const keeperList = [
  { value: "amazons_town", label: "Amazons" },
  { value: "assassin_town", label: "Assassins" },
  { value: "barbarians_fort", label: "Barbarians" },
  { value: "deyja", label: "Deyja" },
  { value: "druids_village", label: "Druids" },
  { value: "enroth_city", label: "Enroth" },
  { value: "erathia_city", label: "Erathia" },
  { value: "house", label: "House" },
  { value: "kreegan", label: "Kreegan" },
  { value: "krewlod_city", label: "Krewlod" },
  { value: "necros_town", label: "Necromancers" },
  { value: "paladins_city", label: "Paladins" },
  { value: "pontus_city", label: "Pontus" },
];

const statusColors = {
  Finished: "green",
  Sorting: "white",
  Queued: "red",
};

const animatedComponents = makeAnimated();

export default function StorageSorter() {
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="storageSorter.status"
          displayName="Sort|Keepers"
          className="mt1 p1"
        />

        <div className="flex flex-column items-center stretch max-width-1 mt2">
          <span className="h4 mb1">Keepers to sort</span>
          <Select
            components={animatedComponents}
            isMulti={true}
            options={keeperList}
            unstyled={true}
            closeMenuOnScroll={true}
            openMenuOnFocus={true}
            placeholder="Keepers..."
            className="flex flex-auto stretch max-width-1 px1 rounded border border-primary"
            classNames={{
              control: () => "flex flex-auto dropdown-filter rounded",
              option: () => "hoverable cursor-pointer",
              multiValue: () => "border border-primary rounded p1 my1 mr1",
              multiValueRemove: () => "ml1",
            }}
            styles={{
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: "#1f1f1f",
              }),
              option: (baseStyles, state) => ({
                width: "75%",
                padding: "0.5rem",
                border: "1px solid #333",
                cursor: state.isFocused ? "pointer" : "default",
              }),
              noOptionsMessage: () => ({
                border: "1px solid #333",
                padding: "0.5rem",
              }),
              multiValueRemove: (styles) => ({
                ...styles,
                ":hover": {
                  cursor: "pointer",
                  border: "1px solid #333",
                },
              }),
            }}
            onChange={(e) => {
              if (e.value === "custom") {
                setIsInputCustom(true);
                // refInputField.current.focus();
              }
            }}
          />
        </div>

        <div className="flex flex-column items-center stretch max-width-1 mt1">
          {data.map(({ type, keeper, status }) => (
            <div className="flex flex-row items-center stretch max-width-1 border-bottom border-primary rounded">
              <div
                className="rounded p1 flex flex-auto overflow-dots"
                style={{ flexBasis: "50%" }}
              >
                {type}
              </div>

              <div className="border-div">{"\u00A0"}</div>

              <div
                className="p1 justify-center flex overflow-dots center h6"
                style={{
                  flexBasis: "25%",
                }}
              >
                {keeper}
              </div>

              <div className="border-div">{"\u00A0"}</div>

              <div
                className="p1 justify-center flex"
                style={{ flexBasis: "25%", color: statusColors[status] }}
              >
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
