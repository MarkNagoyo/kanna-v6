import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

export default function Plugins() {
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="plugins.multiRetrievePlugin"
          displayName="Multiple Item Storage"
          className="mt1 p1"
        />
      </div>
    </div>
  );
}
