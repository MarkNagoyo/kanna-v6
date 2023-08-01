import { useEffect, useRef, useState } from "react";
import { getItemAsync } from "../../../../../Helpers/Storage/GetItem/GetItemAsync";
import { removeItemAsync } from "../../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import { setItemAsync } from "../../../../../Helpers/Storage/SetItem/SetItemAsync";
import Select from "react-select";

export const DropDownFilter = ({ slug, displayName, baseData }) => {
  const [data, setData] = useState(false);
  const [formattedFilterInput, setFormattedFilterInput] = useState();

  const refDropdownField = useRef();

  const [activeDropdown, setActiveDropdown] = useState();

  useEffect(() => {
    getItemAsync(slug, true).then((d) => {
      setData(d);
    });
  }, []);

  useEffect(() => {
    if (data === false) return () => {};

    const final = [];

    Object.keys(baseData).map((slug) => {
      const formatted = {};

      if (data?.includes(slug)) return () => {};

      formatted.value = slug;
      formatted.label = baseData[slug];

      final.push(formatted);
    });

    setFormattedFilterInput(final);
  }, [data]);

  if (data === false || !formattedFilterInput) return null;

  return (
    <div className="flex flex-column justify-center items-center py1 stretch max-width-1 unselectable border-box">
      <span className="center my1">{displayName}</span>

      <div className="flex flex-row stretch">
        <Select
          ref={refDropdownField}
          options={formattedFilterInput}
          unstyled={true}
          closeMenuOnScroll={true}
          openMenuOnFocus={true}
          className="flex flex-auto"
          classNames={{
            control: () => "flex flex-auto dropdown-filter rounded",
            option: () => "hoverable cursor-pointer",
          }}
          styles={{
            control: (baseStyles, state) => ({
              border: "1px solid #333",
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#1f1f1f",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              paddingLeft: "0.5rem",
              border: "1px solid #333",
              cursor: state.isFocused ? "pointer" : "default",
            }),
            noOptionsMessage: () => ({
              border: "1px solid #333",
              padding: "0.5rem",
            }),
          }}
        />

        <div
          className="p1 border hoverable cursor-pointer rounded border-primary"
          onClick={() => {
            const selectedValue =
              refDropdownField.current?.getValue()[0]?.value;
            if (!selectedValue) return null;

            const dataToWrite = data ? [...data] : [];
            if (dataToWrite.includes(selectedValue)) return null;

            dataToWrite.push(selectedValue);

            setItemAsync(slug, dataToWrite).then((r) => {
              setData(dataToWrite);
            });
          }}
        >
          INSERT
        </div>
      </div>

      <div
        className="p1 border hoverable cursor-pointer rounded my1 border-primary"
        onClick={() => {
          removeItemAsync(slug).then((e) => {
            setData(null);
          });
        }}
      >
        CLEAR
      </div>

      {!data && (
        <div className="flex flex-row justify-center items-center py1 stretch max-width-1 border-box">
          <span>Empty</span>
        </div>
      )}

      {data &&
        data.map((item, i) => {
          return (
            <div
              className="flex flex-row rounded border-bottom stretch filter-element border-box items-center"
              key={`filter-element-${i}`}
            >
              {activeDropdown !== i && (
                <span
                  className="flex flex-auto p1 hoverable cursor-pointer"
                  onClick={() => {
                    setActiveDropdown(i);
                  }}
                >
                  {baseData[item]}
                </span>
              )}

              {activeDropdown === i && (
                <Select
                  key={i}
                  defaultValue={{ value: item, label: baseData[item] }}
                  options={formattedFilterInput}
                  unstyled={true}
                  autoFocus={true}
                  defaultMenuIsOpen={true}
                  className="flex flex-auto"
                  classNames={{
                    control: () => "flex flex-auto dropdown-filter",
                    option: () => "hoverable cursor-pointer",
                  }}
                  styles={{
                    control: (baseStyles, state) => ({
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                    }),
                    menu: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: "#1f1f1f",
                    }),
                    option: (baseStyles, state) => ({
                      ...baseStyles,
                      paddingTop: "0.5rem",
                      paddingBottom: "0.5rem",
                      paddingLeft: "0.5rem",
                      border: "1px solid #333",
                      cursor: state.isFocused ? "pointer" : "default",
                    }),
                    noOptionsMessage: () => ({
                      border: "1px solid #333",
                      padding: "0.5rem",
                    }),
                  }}
                  hideSelectedOptions={true}
                  closeMenuOnScroll={true}
                  onMenuClose={() => {
                    setActiveDropdown(null);
                  }}
                  onBlur={() => {
                    setActiveDropdown(null);
                  }}
                  onChange={(e) => {
                    const dataToUpdate = [...data];
                    dataToUpdate[i] = e.value;

                    setItemAsync(slug, dataToUpdate).then(() => {
                      setData(dataToUpdate);
                    });
                  }}
                />
              )}

              <div
                className="flex self-end justify-center items-center"
                style={{ height: "100%" }}
              >
                <div className="border-div">{"\u00A0"}</div>

                <span
                  className="px1 hoverable py1 cursor-pointer rounded"
                  k={i}
                  onClick={(e) => {
                    setActiveDropdown(null);

                    getItemAsync(slug, true).then((d) => {
                      document.activeElement.blur();

                      let arrayToFilter = [...d];
                      let filteredArray = arrayToFilter.filter(
                        (item, index) => {
                          return index !== i;
                        }
                      );

                      if (filteredArray.length === 0) {
                        removeItemAsync(slug).then((e) => {
                          setData(null);
                        });

                        return null;
                      }

                      setItemAsync(slug, filteredArray).then((r) => {
                        setData([...filteredArray]);
                      });
                    });
                  }}
                  key={`filter-btn-${i}`}
                >
                  DELETE
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};
