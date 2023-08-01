import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";
import { useEffect, useRef, useState } from "react";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import Select from "react-select";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";
import { removeItemAsync } from "../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import filterInputs from "../../Assets/JSON/itemList.json";
import runeList from "../../Assets/JSON/runeList.json";
import gemList from "../../Assets/JSON/gemList.json";
import boostList from "../../Assets/JSON/boostList.json";

const styles = {
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

// const filterInputs = {
//   "Rune ": "All Runes",
//   "Rune 2": "All Runes 2",
// };

export const Inventory = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formattedFilterInput, setFormattedFilterInput] = useState();
  const [formattedFilterOutput, setFormattedFilterOutput] = useState(null);

  const refDropdownField = useRef();
  const refDropdownTypeField = useRef();

  const [isInputCustom, setIsInputCustom] = useState(false);
  const [inputText, setInputText] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const refInputField = useRef();
  const selectedInputRef = useRef();

  const [activeDropdown, setActiveDropdown] = useState();
  const [activeTypeDropdown, setActiveTypeDropdown] = useState();
  const [activeInputField, setActiveInputField] = useState();

  const [inputType, setInputType] = useState("General");
  const [formattedInputTypes, setFormattedInputTypes] = useState();

  useEffect(() => {
    if (isInputCustom) refInputField.current?.focus();
    if (selectedInputRef) selectedInputRef.current?.focus();
  }, [isInputCustom, activeInputField]);

  useEffect(() => {
    const selectData = getItemAsync("inventory.select", true);
    const unselectData = getItemAsync("inventory.unselect", true);

    const formattedInput = [];
    const formattedInputTypes = [];

    const inputTypes = {
      General: filterInputs,
      Runes: runeList,
      Gems: gemList,
      Boosts: boostList,
    };

    Object.keys(inputTypes).map((item) => {
      formattedInputTypes.push({ value: item, label: item });
    });

    setFormattedInputTypes(formattedInputTypes);

    // Object.keys(filterInputs).map((item) => {
    Object.keys(inputTypes[inputType]).map((item) => {
      formattedInput.push({ value: item, label: inputTypes[inputType][item] });
    });

    setFormattedFilterInput(formattedInput);

    Promise.all([selectData, unselectData]).then((data) => {
      const filterData = [];

      if (data[0]) {
        data[0].map((item) => {
          const isCustom = !filterInputs[item];

          filterData.push({
            value: item,
            label: filterInputs[item],
            type: "select",
            isCustom,
          });
        });
      }

      if (data[1]) {
        data[1].map((item) => {
          const isCustom = !filterInputs[item];

          filterData.push({
            value: item,
            label: filterInputs[item],
            type: "unselect",
            isCustom,
          });
        });
      }

      setFormattedFilterOutput(filterData.length > 0 ? filterData : null);
      setDataLoaded(true);
    });
  }, [inputType]);

  if (!dataLoaded || !formattedFilterInput) return null;

  // console.log(formattedFilterOutput);

  return (
    <div className="flex flex-column items-center justify-center main-bg border-box">
      <Header />

      <div className="flex flex-column justify-center items-center py1 stretch max-width-1 unselectable border-box">
        <span className="center mt1">Inventory</span>
        <Toggle
          slug={"inventory.status"}
          displayName="Sell Items"
          className="px1 mb2 mt1"
        />
        <Select
          options={formattedInputTypes}
          unstyled={true}
          closeMenuOnScroll={true}
          openMenuOnFocus={true}
          className="flex flex-auto max-width-1 stretch"
          classNames={{
            control: () =>
              "flex flex-auto dropdown-filter rounded mb1 border-primary border p1",
            option: () =>
              "hoverable cursor-pointer border border-primary cursor-pointer p1",
          }}
          styles={{
            menu: (baseStyles) => ({
              ...baseStyles,
              backgroundColor: "#1f1f1f",
            }),
            option: (baseStyles, state) => ({
              cursor: state.isFocused ? "pointer" : "default",
            }),
            noOptionsMessage: () => ({
              border: "1px solid #333",
              padding: "0.5rem",
            }),
          }}
          onChange={(e) => {
            setInputType(e.value);
            refDropdownField.current?.focus();
          }}
          isSearchable={false}
          placeholder="Type..."
        />
        <div className="flex flex-row stretch">
          {isInputCustom && (
            <input
              type="text"
              className="flex flex-auto pl1 border-left border-top border-bottom rounded p1 border-primary"
              ref={refInputField}
              onChange={(e) => {
                setInputText(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value.length < 2) {
                  setIsInputCustom(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  const selectedType =
                    refDropdownTypeField.current?.getValue()[0]?.value;

                  if (!inputText || inputText.length <= 1) return null;

                  const selectData = getItemAsync("inventory.select", true);
                  const unselectData = getItemAsync("inventory.unselect", true);

                  Promise.all([selectData, unselectData]).then((data) => {
                    if (
                      data[0]?.includes(inputText) ||
                      data[1]?.includes(inputText)
                    ) {
                      return null;
                    }
                    const dataToWrite =
                      (selectedType === "select" ? data[0] : data[1]) ?? [];

                    dataToWrite.push(inputText);

                    setItemAsync(`inventory.${selectedType}`, dataToWrite).then(
                      (d) => {
                        const dataToUpdate = formattedFilterOutput
                          ? [...formattedFilterOutput]
                          : [];
                        dataToUpdate.push({
                          value: inputText,
                          label: inputText,
                          type: selectedType,
                          isCustom: true,
                        });
                        setFormattedFilterOutput(dataToUpdate);
                      }
                    );

                    e.target.value = null;
                    setInputText();
                  });
                }
              }}
            />
          )}

          {!isInputCustom && (
            <Select
              ref={refDropdownField}
              options={[
                { value: "custom", label: "Custom Item Name" },
                ...formattedFilterInput,
              ]}
              unstyled={true}
              closeMenuOnScroll={true}
              openMenuOnFocus={true}
              className="flex flex-auto"
              classNames={{
                control: () => "flex flex-auto dropdown-filter rounded",
                option: () => "hoverable cursor-pointer",
              }}
              styles={{
                control: () => ({
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
              onChange={(e) => {
                if (e.value === "custom") {
                  setIsInputCustom(true);
                  // refInputField.current.focus();
                }
              }}
            />
          )}

          <Select
            ref={refDropdownTypeField}
            options={[
              { value: "unselect", label: "Keep" },
              { value: "select", label: "Sell" },
            ]}
            isSearchable={false}
            defaultValue={{ value: "unselect", label: "Keep" }}
            unstyled={true}
            closeMenuOnScroll={true}
            openMenuOnFocus={true}
            className="flex flex-auto"
            classNames={{
              control: () => "flex flex-auto dropdown-filter rounded",
              option: () => "hoverable cursor-pointer",
            }}
            styles={{
              control: () => ({
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
                refDropdownField.current?.getValue()[0]?.value ?? inputText;

              const isCustom = !filterInputs[selectedValue];

              const selectedType =
                refDropdownTypeField.current?.getValue()[0]?.value;

              if (!selectedValue) return null;

              const selectData = getItemAsync("inventory.select", true);
              const unselectData = getItemAsync("inventory.unselect", true);

              Promise.all([selectData, unselectData]).then((data) => {
                if (
                  data[0]?.includes(selectedValue) ||
                  data[1]?.includes(selectedValue)
                ) {
                  return null;
                }
                const dataToWrite =
                  (selectedType === "select" ? data[0] : data[1]) ?? [];

                dataToWrite.push(selectedValue);

                setItemAsync(`inventory.${selectedType}`, dataToWrite).then(
                  (d) => {
                    const dataToUpdate = formattedFilterOutput
                      ? [...formattedFilterOutput]
                      : [];
                    dataToUpdate.push({
                      value: selectedValue,
                      label: filterInputs[selectedValue],
                      type: selectedType,
                      isCustom,
                    });
                    setFormattedFilterOutput(dataToUpdate);
                  }
                );

                setIsInputCustom(null);
                // console.log(dataToWrite);
              });
            }}
          >
            INSERT
          </div>
        </div>

        <div
          className="p1 border hoverable cursor-pointer rounded my1 border-primary"
          onClick={() => {
            const clearSelect = removeItemAsync("inventory.select");
            const clearUnselect = removeItemAsync("inventory.unselect");

            Promise.all([clearSelect, clearUnselect]).then((data) => {
              // setSellFilter(null);
              // setKeepFilter(null);
              setFormattedFilterOutput(null);
            });
          }}
        >
          CLEAR
        </div>

        {/* <span>test</span> */}

        {!formattedFilterOutput && (
          <div className="flex flex-row justify-center items-center py1 stretch max-width-1 border-box">
            <span>Empty</span>
          </div>
        )}

        {formattedFilterOutput &&
          formattedFilterOutput.map((item, i) => {
            // console.log(item);
            return (
              <div
                className="flex flex-row rounded border-bottom stretch filter-element border-box items-center"
                key={`filter-element-${i}`}
              >
                {activeInputField !== i && activeDropdown !== i && (
                  <span
                    className="flex flex-auto p1 hoverable cursor-pointer"
                    onClick={() => {
                      if (item.isCustom) {
                        setActiveInputField(i);
                        return null;
                      }
                      setActiveDropdown(i);
                    }}
                  >
                    {item.isCustom ? item.value : filterInputs[item.value]}
                  </span>
                )}

                {item.isCustom && activeInputField === i && (
                  <input
                    type="text"
                    defaultValue={item.value}
                    ref={selectedInputRef}
                    className="flex flex-auto p1 rounded"
                    onFocus={(e) => {
                      e.target.addEventListener("keypress", (event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          e.target.blur();
                        }
                      });
                      // setSelectedValue(e.target.value);
                    }}
                    onChange={(e) => {
                      setSelectedValue(e.target.value);
                    }}
                    onBlur={(e) => {
                      if (!selectedValue || selectedValue.length <= 1) {
                        setActiveInputField(null);
                        return null;
                      }

                      getItemAsync(`inventory.${item.type}`, true).then(
                        (data) => {
                          const dataToWrite = [...data];
                          const index = data.indexOf(item.value);
                          dataToWrite[index] = selectedValue;
                          setItemAsync(
                            `inventory.${item.type}`,
                            dataToWrite
                          ).then((d) => {
                            const dataToUpdate = [...formattedFilterOutput];

                            const index = formattedFilterOutput.findIndex(
                              (p) => p.value === item.value
                            );

                            dataToUpdate[index] = {
                              value: selectedValue,
                              label: selectedValue,
                              type: item.type,
                              isCustom: true,
                            };

                            setFormattedFilterOutput(dataToUpdate);
                          });
                        }
                      );

                      setActiveInputField(null);
                    }}
                  />
                )}

                {!item.isCustom && activeDropdown === i && (
                  <Select
                    key={i}
                    defaultValue={item}
                    options={formattedFilterInput}
                    unstyled={true}
                    autoFocus={true}
                    defaultMenuIsOpen={true}
                    className="flex flex-auto py1"
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
                      if (!e) return null;

                      const selectData = getItemAsync("inventory.select", true);
                      const unselectData = getItemAsync(
                        "inventory.unselect",
                        true
                      );

                      Promise.all([selectData, unselectData]).then((data) => {
                        // console.log(data);

                        if (
                          data[0]?.includes(e.value) ||
                          data[1]?.includes(e.value)
                        ) {
                          return null;
                        }
                        const dataToWrite =
                          item.type === "select" ? data[0] : data[1];
                        const index = dataToWrite.indexOf(item.value);
                        dataToWrite[index] = e.value;

                        // dataToWrite.push(e.value);
                        // console.log(dataToWrite);

                        setItemAsync(
                          `inventory.${item.type}`,
                          dataToWrite
                        ).then((d) => {
                          const dataToUpdate = formattedFilterOutput
                            ? [...formattedFilterOutput]
                            : [];

                          const index = formattedFilterOutput.findIndex(
                            (p) => p.value === item.value
                          );

                          dataToUpdate[index] = {
                            value: e.value,
                            label: item.label,
                            type: item.type,
                          };
                          setFormattedFilterOutput(dataToUpdate);
                        });
                      });
                    }}
                  />
                )}

                {/* Type */}
                <div
                  className="flex self-end justify-center items-center"
                  style={{ height: "100%" }}
                >
                  <div className="border-div">{"\u00A0"}</div>

                  {/* If DropDown is not active */}
                  {activeTypeDropdown !== i && (
                    <span
                      className="flex flex-auto p1 hoverable cursor-pointer"
                      style={{
                        color: item.type === "select" ? "red" : "green",
                      }}
                      onClick={() => {
                        setActiveTypeDropdown(i);
                      }}
                    >
                      {item.type === "select" ? "SELL" : "KEEP"}
                    </span>
                  )}

                  {/* If dropdown is active */}
                  {activeTypeDropdown === i && (
                    <Select
                      key={`type-dropdown-${i}`}
                      defaultValue={{
                        value: item.type,
                        label: item.type === "select" ? "SELL" : "KEEP",
                      }}
                      options={[
                        { value: "select", label: "SELL" },
                        { value: "unselect", label: "KEEP" },
                      ]}
                      unstyled={true}
                      autoFocus={true}
                      isSearchable={false}
                      defaultMenuIsOpen={true}
                      className="flex flex-auto py1"
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
                        setActiveTypeDropdown(null);
                      }}
                      onBlur={() => {
                        setActiveTypeDropdown(null);
                      }}
                      onChange={(e) => {
                        if (!e) return null;

                        const selectData = getItemAsync(
                          "inventory.select",
                          true
                        );
                        const unselectData = getItemAsync(
                          "inventory.unselect",
                          true
                        );

                        Promise.all([selectData, unselectData]).then((data) => {
                          // console.log(data);

                          // if (
                          //   data[0]?.includes(e.value) ||
                          //   data[1]?.includes(e.value)
                          // ) {
                          //   return null;
                          // }

                          // const dataToWrite =
                          //   (e.value === "select" ? data[0] : data[1]) ?? [];
                          // const dataToWrite =
                          //   (e.value === "select" ? data[0] : data[1]) ?? [];

                          let activeFilter =
                            (e.value === "select" ? data[0] : data[1]) ?? [];
                          let inactiveFilter =
                            (e.value === "select" ? data[1] : data[0]) ?? [];

                          // const index = dataToWrite.indexOf(item.value);
                          const isCustom = !filterInputs[item.value];

                          if (activeFilter.includes(item.value)) return null;
                          activeFilter.push(item.value);

                          let filteredInactiveFilter = inactiveFilter.filter(
                            (i, index) => {
                              return i !== item.value;
                            }
                          );

                          // console.log({ activeFilter, filteredInactiveFilter });

                          if (filteredInactiveFilter.length === 0) {
                            removeItemAsync(
                              `inventory.${
                                e.value === "select" ? "unselect" : "select"
                              }`
                            ).catch((e) => {});
                            // return null;
                          } else {
                            setItemAsync(
                              `inventory.${
                                e.value === "select" ? "unselect" : "select"
                              }`,
                              filteredInactiveFilter
                            ).catch((e) => {});
                          }

                          setItemAsync(
                            `inventory.${e.value}`,
                            activeFilter
                          ).then((d) => {
                            const dataToUpdate = formattedFilterOutput
                              ? [...formattedFilterOutput]
                              : [];

                            const index = formattedFilterOutput.findIndex(
                              (p) => p.value === item.value
                            );

                            dataToUpdate[index] = {
                              value: item.value,
                              label: item.label,
                              type: e.value,
                              isCustom,
                            };
                            setFormattedFilterOutput(dataToUpdate);
                            setActiveTypeDropdown(null);
                          });
                        });
                      }}
                    />
                  )}
                </div>

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
                      setActiveTypeDropdown(null);

                      const selectData = getItemAsync("inventory.select", true);
                      const unselectData = getItemAsync(
                        "inventory.unselect",
                        true
                      );

                      Promise.all([selectData, unselectData]).then((data) => {
                        document.activeElement.blur();

                        let arrayToFilter;

                        if (data[0]?.includes(item.value))
                          arrayToFilter = data[0];
                        else arrayToFilter = data[1];

                        // (item.type === "select" ? data[0] : data[1]) ?? [];
                        let filteredArray = arrayToFilter.filter(
                          (itemValue, index) => {
                            return itemValue !== item.value;
                          }
                        );

                        let arrayToWrite = [...formattedFilterOutput];

                        arrayToWrite = arrayToWrite.filter(
                          (itemInFilter, i) => {
                            return itemInFilter.value !== item.value;
                          }
                        );

                        if (filteredArray.length === 0) {
                          removeItemAsync(`inventory.${item.type}`).then(
                            (e) => {
                              setFormattedFilterOutput(
                                arrayToWrite.length > 0 ? arrayToWrite : null
                              );
                            }
                          );

                          return null;
                        }

                        setItemAsync(
                          `inventory.${item.type}`,
                          filteredArray
                        ).then((r) => {
                          setFormattedFilterOutput(
                            arrayToWrite.length > 0 ? arrayToWrite : null
                          );
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
    </div>
  );
};
