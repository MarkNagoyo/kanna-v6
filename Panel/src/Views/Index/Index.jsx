import { useState } from "react";
import { redirect } from "react-router-dom";
import { isAuthenticated } from "../../../../Helpers/Auth/Authentication";
import { Category } from "../../Components/Category/Category";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

export const indexLoader = async () => {
  await isAuthenticated({ redirectOnUnauth: true, redirect });

  return null;
};

export default function Index() {
  // const [count, setCount] = useState(0);

  // return <>Index</>;

  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1">
        <Toggle slug="masterkey" displayName="Status" className="my2 stretch" />

        <div className="flex stretch justify-center">
          <Category displayName="Notifier" slug="notifier" />
          <Category displayName="Plugins" slug="plugins" />
        </div>

        <div className="flex flex-wrap stretch justify-center">
          <Category displayName="Map" slug="map" />
          <Category displayName="Enemies" slug="enemies" />
          <Category displayName="Inventory" slug="inventory" />
        </div>

        <div className="flex flex-wrap stretch justify-center">
          <Category displayName="Storage" slug="storage" />
          <Category displayName="Dungeon" slug="dungeon" />
          <Category displayName="Auto|Boost" slug="autoboost" />
        </div>

        <div className="flex flex-wrap stretch justify-center">
          <Category displayName="Boss|Mode" slug="bosses" />
          <Category displayName="Import|Export" slug="importexport" />
        </div>
      </div>
    </div>
  );
}
