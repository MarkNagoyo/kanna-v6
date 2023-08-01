import { useEffect, useRef, useState } from "react";
import { getItemAsync } from "../../../../../Helpers/Storage/GetItem/GetItemAsync";
import { removeItemAsync } from "../../../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import { setItemAsync } from "../../../../../Helpers/Storage/SetItem/SetItemAsync";

export const CustomFilter = ({ slug, displayName, order }) => {
  const [data, setData] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [inputText, setInputText] = useState();
  const refInputField = useRef();

  useEffect(() => {
    getItemAsync(slug, true).then((d) => {
      setData(d);
    });

    document.addEventListener("keypress", function (e) {
      if (document.activeElement === document.body) {
        refInputField.current?.focus();
      }
    });
  }, []);

  if (data === false) return null;

  return (
    <div className="flex flex-column justify-center items-center py1 stretch max-width-1 unselectable border-box">
      <div className="flex flex-row stretch">
        <input
          type="text"
          className="flex flex-auto pl1 border-left border-top border-bottom rounded p1 border-primary"
          ref={refInputField}
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const dataToWrite = data ? [...data] : [];
              if (dataToWrite.includes(inputText)) return null;
              if (!inputText || inputText.length < 2) return e.target.blur();

              dataToWrite.push(inputText);
              setItemAsync(slug, dataToWrite).then((r) => {
                setData(dataToWrite);
              });

              e.target.value = null;
              setInputText();
            }
          }}
        />
        <div
          className="p1 border hoverable cursor-pointer rounded border-primary"
          onClick={() => {
            const dataToWrite = data ? [...data] : [];

            if (dataToWrite.includes(inputText)) return null;
            if (!inputText || inputText.length < 2) return null;

            dataToWrite.push(inputText);

            setItemAsync(slug, dataToWrite).then((r) => {
              setData(dataToWrite);
            });

            refInputField.current.value = null;
            setInputText();
            refInputField.current.focus();
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
        data.map((item, i) => (
          <div
            className="flex flex-row rounded border-bottom stretch filter-element border-box"
            key={`filter-element-${i}`}
          >
            <input
              type="text"
              placeholder={item}
              className="flex flex-auto pl1"
              onFocus={(e) => {
                e.target.value = e.target.placeholder;

                e.target.addEventListener("keypress", (event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    e.target.blur();
                  }
                });
                setSelectedValue(e.target.value);
              }}
              onBlur={(e) => {
                const dataToUpdate = [...data];
                const indexToUpdate = dataToUpdate.indexOf(selectedValue);
                dataToUpdate[indexToUpdate] = e.target.value;

                setItemAsync(slug, dataToUpdate).then(() => {
                  setData(dataToUpdate);
                  e.target.placeholder = e.target.value;
                  e.target.value = null;
                });
              }}
              k={i}
              key={`filter-input-${i}`}
            />

            <div
              className="flex self-end justify-center items-center"
              style={{ height: "100%" }}
            >
              <div className="border-div">{"\u00A0"}</div>

              <span
                className="px1 hoverable py1 cursor-pointer rounded"
                k={i}
                onClick={(e) => {
                  document.activeElement.blur();

                  let filteredArray = data.filter((item, index) => index !== i);
                  if (filteredArray.length === 0) {
                    removeItemAsync(slug).then((e) => {
                      setData(null);
                    });
                    return null;
                  }

                  setItemAsync(slug, filteredArray).then((r) => {
                    setData(filteredArray);
                  });
                }}
                key={`filter-btn-${i}`}
              >
                DELETE
              </span>
            </div>
          </div>
        ))}
    </div>
  );
};
