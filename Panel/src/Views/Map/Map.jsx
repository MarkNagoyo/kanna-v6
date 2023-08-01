import { Category } from "../../Components/Category/Category";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

export const Map = () => {
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle slug="map.status" displayName="Map" className="my2 px2 py1" />

        <Toggle
          slug="map.highestFirst"
          displayName="Highest Ranks First"
          className="stretch py1"
        />
        <Toggle
          slug="map.randomEnemies"
          displayName="Random Enemies"
          className="stretch py1 mt1"
        />
        <Toggle
          slug="map.attackMarked"
          displayName="Attack Marked Enemies"
          className="stretch py1 mt1"
        />
        <Toggle
          slug="map.collectIcons"
          displayName="Collect icons"
          className="stretch py1 mt1"
        />

        <div className="flex flex-wrap stretch justify-center mt1">
          <Category displayName="Avoid|Enemies" slug="enemyavoid" />
          <Category displayName="Prioritize|Enemies" slug="enemypriority" />
        </div>
      </div>
    </div>
  );
};
