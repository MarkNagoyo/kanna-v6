import { useEffect, useRef, useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import Select from "react-select";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { removeItemAsync } from "../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

import bossInputs from "../../Assets/JSON/bossesList.json";
import { isAuthenticated } from "../../../../Helpers/Auth/Authentication";

export const bossesLoader = async () => {
  //   return null;

  await isAuthenticated({ redirectOnUnauth: true, redirect });

  const avoidFilter = await getItemAsync("bosses.avoidFilter", true);
  const prioritizeFilter = await getItemAsync("bosses.prioritizeFilter", true);

  const filterData = [];
  const formattedInput = [];

  Object.keys(bossInputs).map((item) => {
    formattedInput.push({ value: item, label: bossInputs[item] });
  });

  if (avoidFilter) {
    avoidFilter.map((item) => {
      const isCustom = !bossInputs[item];

      filterData.push({
        value: item,
        label: bossInputs[item] ? bossInputs[item] : item,
        type: "avoid",
        isCustom,
      });
    });
  }

  if (prioritizeFilter) {
    prioritizeFilter.map((item) => {
      const isCustom = !bossInputs[item];

      filterData.push({
        value: item,
        label: bossInputs[item] ? bossInputs[item] : item,
        type: "prioritize",
        isCustom,
      });
    });
  }

  return {
    filterData: filterData.length > 0 ? filterData : null,
    formattedInput,
  };
};

export const Bosses = () => {
  const { formattedInput, filterData } = useLoaderData();

  const [formattedFilterOutput, setFormattedFilterOutput] =
    useState(filterData);

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

  useEffect(() => {
    if (isInputCustom) refInputField.current?.focus();
    if (selectedInputRef) selectedInputRef.current?.focus();
  }, [isInputCustom, activeInputField]);

  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="bosses.status"
          displayName="Bosses"
          className="my2 px2 py1"
        />

        <Toggle
          slug="bosses.highestFirst"
          displayName="Highest Ranks First"
          className="stretch py1"
        />
        <Toggle
          slug="bosses.randomBosses"
          displayName="Random Bosses"
          className="stretch py1 mt1"
        />
      </div>

      <div className="flex flex-column mt2 items-center justify-center stretch max-width-1">
        <div className="flex flex-row items-center justify-center stretch">
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
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  const selectedType =
                    refDropdownTypeField.current?.getValue()[0]?.value;

                  if (!inputText || inputText.length <= 1) return null;

                  const avoidFilter =
                    (await getItemAsync("bosses.avoidFilter", true)) ?? [];
                  const prioritizeFilter =
                    (await getItemAsync("bosses.prioritizeFilter", true)) ?? [];

                  if (
                    avoidFilter.includes(inputText) ||
                    prioritizeFilter.includes(inputText)
                  )
                    return null;

                  const dataToWrite =
                    (selectedType === "avoid"
                      ? avoidFilter
                      : prioritizeFilter) ?? [];

                  dataToWrite.push(inputText);

                  await setItemAsync(
                    `bosses.${selectedType}Filter`,
                    dataToWrite
                  );

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

                  e.target.value = null;
                  setInputText();
                }
              }}
            />
          )}

          {!isInputCustom && (
            <Select
              ref={refDropdownField}
              placeholder="Boss..."
              options={[
                { value: "custom", label: "Custom Item Name" },
                ...formattedInput,
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
                  padding: "0.5rem",
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
              { value: "avoid", label: "Avoid" },
              { value: "prioritize", label: "Prioritize" },
            ]}
            isSearchable={false}
            defaultValue={{ value: "avoid", label: "Avoid" }}
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
                padding: "0.5rem",
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
            onClick={async (e) => {
              const selectedValue =
                refDropdownField.current?.getValue()[0]?.value ?? inputText;

              const isCustom = !bossInputs[selectedValue];

              const selectedType =
                refDropdownTypeField.current?.getValue()[0]?.value;

              if (!selectedValue) return null;

              const avoidFilter =
                (await getItemAsync("bosses.avoidFilter", true)) ?? [];
              const prioritizeFilter =
                (await getItemAsync("bosses.prioritizeFilter", true)) ?? [];

              if (
                avoidFilter.includes(selectedValue) ||
                prioritizeFilter.includes(selectedValue)
              )
                return null;

              const dataToWrite =
                (selectedType === "avoid" ? avoidFilter : prioritizeFilter) ??
                [];

              dataToWrite.push(selectedValue);

              await setItemAsync(`bosses.${selectedType}Filter`, dataToWrite);

              const dataToUpdate = formattedFilterOutput
                ? [...formattedFilterOutput]
                : [];
              dataToUpdate.push({
                value: selectedValue,
                label: isCustom ? selectedValue : bossInputs[selectedValue],
                type: selectedType,
                isCustom,
              });
              setFormattedFilterOutput(dataToUpdate);

              e.target.value = null;
              setInputText();
            }}
          >
            INSERT
          </div>
        </div>

        <div
          className="p1 border hoverable cursor-pointer rounded my1 border-primary"
          onClick={async () => {
            await removeItemAsync("bosses.avoidFilter");
            await removeItemAsync("booses.prioritizeFilter");

            setFormattedFilterOutput(null);
          }}
        >
          CLEAR
        </div>

        {!formattedFilterOutput && (
          <div className="flex flex-row justify-center items-center py1 stretch max-width-1 border-box">
            <span>Empty</span>
          </div>
        )}

        {formattedFilterOutput &&
          formattedFilterOutput.map((item, i) => {
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
                    {item.isCustom ? item.value : bossInputs[item.value]}
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
                    onBlur={async (e) => {
                      if (!selectedValue || selectedValue.length <= 1) {
                        setActiveInputField(null);
                        return null;
                      }

                      const dataToWrite =
                        (await getItemAsync(
                          `bosses.${item.type}Filter`,
                          true
                        )) ?? [];

                      //   const dataToWrite = [...data];
                      const index = dataToWrite.indexOf(item.value);
                      dataToWrite[index] = selectedValue;
                      await setItemAsync(
                        `bosses.${item.type}Filter`,
                        dataToWrite
                      );

                      const dataToUpdate = [...formattedFilterOutput];

                      const indexToUpdate = formattedFilterOutput.findIndex(
                        (p) => p.value === item.value
                      );

                      dataToUpdate[indexToUpdate] = {
                        value: selectedValue,
                        label: selectedValue,
                        type: item.type,
                        isCustom: true,
                      };

                      setFormattedFilterOutput(dataToUpdate);

                      setActiveInputField(null);
                    }}
                  />
                )}

                {!item.isCustom && activeDropdown === i && (
                  <Select
                    key={i}
                    defaultValue={item}
                    options={formattedInput}
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
                    onChange={async (e) => {
                      if (!e) return null;

                      const avoidFilter =
                        (await getItemAsync("bosses.avoidFilter", true)) ?? [];
                      const prioritizeFilter =
                        (await getItemAsync("bosses.prioritizeFilter", true)) ??
                        [];

                      if (
                        avoidFilter.includes(e.value) ||
                        prioritizeFilter.includes(e.value)
                      )
                        return null;

                      const dataToWrite =
                        item.type === "avoid" ? avoidFilter : prioritizeFilter;
                      const index = dataToWrite.indexOf(item.value);
                      dataToWrite[index] = e.value;

                      await setItemAsync(
                        `bosses.${item.type}Filter`,
                        dataToWrite
                      );

                      const dataToUpdate = formattedFilterOutput
                        ? [...formattedFilterOutput]
                        : [];

                      const indexToUpdate = formattedFilterOutput.findIndex(
                        (p) => p.value === item.value
                      );

                      dataToUpdate[indexToUpdate] = {
                        value: e.value,
                        label: item.label,
                        type: item.type,
                      };
                      setFormattedFilterOutput(dataToUpdate);
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
                        color: item.type === "avoid" ? "red" : "green",
                      }}
                      onClick={() => {
                        setActiveTypeDropdown(i);
                      }}
                    >
                      {item.type === "avoid" ? "Avoid" : "Prioritize"}
                    </span>
                  )}

                  {/* If dropdown is active */}
                  {activeTypeDropdown === i && (
                    <Select
                      key={`type-dropdown-${i}`}
                      defaultValue={{
                        value: item.type,
                        label: item.type === "avoid" ? "Avoid" : "Prioritize",
                      }}
                      options={[
                        { value: "avoid", label: "Avoid" },
                        { value: "prioritize", label: "Prioritize" },
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
                      onChange={async (e) => {
                        if (!e) return null;

                        const avoidFilter =
                          (await getItemAsync("bosses.avoidFilter", true)) ??
                          [];
                        const prioritizeFilter =
                          (await getItemAsync(
                            "bosses.prioritizeFilter",
                            true
                          )) ?? [];

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
                          (e.value === "avoid"
                            ? avoidFilter
                            : prioritizeFilter) ?? [];
                        let inactiveFilter =
                          (e.value === "avoid"
                            ? prioritizeFilter
                            : avoidFilter) ?? [];

                        // const index = dataToWrite.indexOf(item.value);
                        const isCustom = !bossInputs[item.value];

                        if (activeFilter.includes(item.value)) return null;

                        activeFilter.push(item.value);

                        let filteredInactiveFilter = inactiveFilter.filter(
                          (i, index) => {
                            return i !== item.value;
                          }
                        );

                        if (filteredInactiveFilter.length === 0) {
                          await removeItemAsync(
                            `bosses.${
                              e.value === "avoid" ? "prioritize" : "avoid"
                            }Filter`
                          );
                          // return null;
                        } else {
                          await setItemAsync(
                            `bosses.${
                              e.value === "avoid" ? "prioritize" : "avoid"
                            }Filter`,
                            filteredInactiveFilter
                          );
                        }

                        await setItemAsync(
                          `bosses.${e.value}Filter`,
                          activeFilter
                        );

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
                    onClick={async (e) => {
                      setActiveDropdown(null);
                      setActiveTypeDropdown(null);

                      const avoidFilter =
                        (await getItemAsync("bosses.avoidFilter", true)) ?? [];
                      const prioritizeFilter =
                        (await getItemAsync("bosses.prioritizeFilter", true)) ??
                        [];

                      document.activeElement.blur();

                      let arrayToFilter;

                      if (avoidFilter?.includes(item.value))
                        arrayToFilter = avoidFilter;
                      else arrayToFilter = prioritizeFilter;

                      // (item.type === "select" ? data[0] : data[1]) ?? [];
                      let filteredArray = arrayToFilter.filter(
                        (itemValue, index) => {
                          return itemValue !== item.value;
                        }
                      );

                      let arrayToWrite = [...formattedFilterOutput];

                      arrayToWrite = arrayToWrite.filter((itemInFilter, i) => {
                        return itemInFilter.value !== item.value;
                      });

                      if (filteredArray.length === 0) {
                        await removeItemAsync(`bosses.${item.type}Filter`).then(
                          (e) => {
                            setFormattedFilterOutput(
                              arrayToWrite.length > 0 ? arrayToWrite : null
                            );
                          }
                        );

                        return null;
                      }

                      setItemAsync(
                        `bosses.${item.type}Filter`,
                        filteredArray
                      ).then((r) => {
                        setFormattedFilterOutput(
                          arrayToWrite.length > 0 ? arrayToWrite : null
                        );
                      });

                      // getItemAsync(slug, true).then((d) => {

                      // });
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
