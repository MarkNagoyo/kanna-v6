import { useEffect, useState } from "react";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";

export const Toggle = ({ slug, displayName, className, onStatusChange }) => {
  const [toggleStatus, setToggleStatus] = useState(null);

  useEffect(() => {
    getItemAsync(slug).then((status) => {
      setToggleStatus(status ?? false);
    });
  }, [toggleStatus]);

  if (toggleStatus === null) return null;

  const splitDisplayNames = displayName.split("|");

  return (
    <div
      className={`flex flex-column items-center toggle border rounded py1 justify-center cursor-pointer hoverable unselectable center ${
        toggleStatus === true ? "active" : ""
      } ${className}`}
      onClick={() => {
        setToggleStatus(!toggleStatus);
        setItemAsync(slug, !toggleStatus);
        if (onStatusChange) onStatusChange(!toggleStatus);
      }}
    >
      {splitDisplayNames.map((text, i) => (
        <span key={i}>{text}</span>
      ))}
    </div>
  );
};
