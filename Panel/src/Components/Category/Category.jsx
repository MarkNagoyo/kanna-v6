import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";

export const Category = ({ slug, displayName, canBeActive } = {}) => {
  const [switchStatus, setSwitchStatus] = useState(null);

  useEffect(() => {
    if (!slug)
      return () => {
        setSwitchStatus(false);
      };

    getItemAsync(`${slug}.status`).then((status) => {
      setSwitchStatus(status ?? false);
    });
  }, [switchStatus]);

  if (switchStatus === null) return null;

  const splitDisplayNames = displayName.split("|");

  return (
    <Link
      className={`p1 text-decoration-none cursor-pointer unselectable border rounded m1 center flex flex-column items-center justify-center category hoverable ${
        switchStatus === true ? "active" : ""
      }`}
      to={`/category/${slug}/`}
    >
      {splitDisplayNames.map((text, i) => (
        <span key={i}>{text}</span>
      ))}
    </Link>
  );
};
