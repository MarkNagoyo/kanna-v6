import { checkIntegrity } from "../Integrity/checkIntegrity";
import { getItemAsync } from "../Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../Storage/SetItem/SetItemAsync";

export const isAuthenticated = async ({
  redirect,
  redirectOnUnauth,
  redirectOnAuth,
}) => {
  const token = await getItemAsync("token");
  const accessToken = await getItemAsync("accessToken");

  if (!token || !accessToken) {
    if (redirectOnUnauth) throw redirect("/login");

    return null;
  }

  const now = new Date().getTime().toString();
  const lastCheckedTime = await getItemAsync("lastCheckedTime");

  const secondsBetween = Math.floor((now - lastCheckedTime) / 1000);

  if (!lastCheckedTime || secondsBetween > 10) {
    await checkIntegrity({ redirect, redirectOnUnauth, redirectOnAuth });
    await setItemAsync("lastCheckedTime", now);
  }
  // setInterval(async () => {
  //   await checkIntegrity({ redirect, redirectOnUnauth, redirectOnAuth });
  // }, 1000 * 20);
};
