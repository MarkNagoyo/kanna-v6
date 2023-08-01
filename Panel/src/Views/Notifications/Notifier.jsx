import { redirect } from "react-router-dom";
import { isAuthenticated } from "../../../../Helpers/Auth/Authentication";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

export const notifierLoader = async () => {
  await isAuthenticated({ redirectOnUnauth: true, redirect });

  const notifyOnMessage = await getItemAsync("notifier.notifyOnMessage");

  return {
    notifyOnMessage,
  };
};

export default function Notifier() {
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex justify-center items-center flex-wrap max-width-1 stretch">
        <Toggle
          slug="notifier.notifyOnMessage"
          displayName="Notify on new message"
          className="mt1 p1"
        />
      </div>
    </div>
  );
}
