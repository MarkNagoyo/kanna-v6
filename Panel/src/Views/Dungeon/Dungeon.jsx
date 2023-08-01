import { Category } from "../../Components/Category/Category";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

export const Dungeon = () => {
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="dungeon.status"
          displayName="Dungeon"
          className="my2 px2 py1"
        />

        <Toggle
          slug="dungeon.autoPortal"
          displayName="Use Portals"
          className="stretch py1"
        />
        <Toggle
          slug="dungeon.ignoreShops"
          displayName="Ignore Shops"
          className="stretch py1 mt1"
        />
      </div>
    </div>
  );
};
