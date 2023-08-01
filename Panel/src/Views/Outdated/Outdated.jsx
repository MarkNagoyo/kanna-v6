import { Category } from "../../Components/Category/Category";
import { Header } from "../../Components/Header/Header";

export const Outdated = () => {
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex flex-column justify-center items-center flex-wrap max-width-1 stretch mt3 center">
        <span className="h2">
          Your version{" "}
          <b>
            {import.meta.env.MODE === "production"
              ? chrome.runtime.getManifest().version
              : "x.x.x"}{" "}
          </b>
          is outdated
        </span>
        <div className="flex flex-row h2 mt1">
          Please Install The Latest Version
        </div>
      </div>
    </div>
  );
};
