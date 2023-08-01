import { DropDownFilter } from "../../../Components/Filter/DropDown/DropDownFilter";
import { Header } from "../../../Components/Header/Header";
import enemiesList from "../../../Assets/JSON/enemyList.json";
import { useEffect, useState } from "react";

export const AvoidEnemies = () => {
  const [data, setData] = useState();

  useEffect(() => {
    for (let i = 0; i <= 10; i++) {
      enemiesList[`r=${i}`] = `Rank ${i}`;
    }

    setData(enemiesList);
  }, []);

  if (!data) return null;

  return (
    <div className="flex flex-column items-center justify-center main-bg border-box">
      <Header />

      <DropDownFilter
        slug="avoid_enemies_filter"
        displayName="Avoid Enemies"
        baseData={data}
      />
    </div>
  );
};
