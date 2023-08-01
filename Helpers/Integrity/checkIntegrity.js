import { getItemAsync } from "../Storage/GetItem/GetItemAsync";
import { removeItemAsync } from "../Storage/RemoveItem/RemoveItemAsync";
import { setItemAsync } from "../Storage/SetItem/SetItemAsync";

const getHashFromFile = async (filePath) => {
  const url = chrome.runtime.getURL(filePath);

  let response;

  try {
    response = await fetch(url);
  } catch (e) {
    return null;
  }
  const text = await response.text();

  const textWithoutSpaces = text.replace(/\s/g, ""); // Remove white spaces

  const encoder = new TextEncoder();
  const data = encoder.encode(textWithoutSpaces);

  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

export const checkIntegrity = async ({
  redirect,
  redirectOnUnauth,
  redirectOnAuth,
  isWorker,
}) => {
  const token = await getItemAsync("token");
  const accessToken = await getItemAsync("accessToken");
  const hasLoadingRequest = await getItemAsync("hasLoadingRequest");

  if (isWorker && (!token || !accessToken)) return null;
  if (hasLoadingRequest === true) return null;

  const manifestHash = await getHashFromFile("manifest.json");
  const backgroundHash = await getHashFromFile("Background.js");

  if (!manifestHash || !backgroundHash) return null;

  let requestBody = {
      m_h: "bypass",
      b_h: "bypass",
      v: chrome.runtime.getManifest().version,
    },
    response;

  if (import.meta.env.MODE === "production") {
    requestBody = {
      m_h: manifestHash,
      b_h: backgroundHash,
      v: chrome.runtime.getManifest().version,
    };
  }

  try {
    await setItemAsync("hasLoadingRequest", true);
    response = await fetch(import.meta.env.VITE_SERVER_URI + "/home/", {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify({
        accessToken: accessToken,
        ...requestBody,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    await setItemAsync("hasLoadingRequest", false);
  } catch (e) {
    // Server error
    // Uninstall the extension i guess

    if (import.meta.env.MODE === "production") {
      chrome.management.uninstallSelf();
    } else {
      console.log("Would have uninstalled here");
    }

    return null;
  }

  // console.log(response.status);

  switch (response.status) {
    // Tampering
    case 406:
      if (import.meta.env.MODE === "production") {
        chrome.management.uninstallSelf();
      } else {
        console.log("Would have uninstalled here");
      }
      break;

    // Outdated
    case 403:
      await removeItemAsync("masterkey");
      await removeItemAsync("token");
      await removeItemAsync("accessToken");
      if (!isWorker) throw redirect("/outdated");
      break;

    // Not authenticated
    case 401:
      await removeItemAsync("masterkey");
      await removeItemAsync("token");
      await removeItemAsync("accessToken");
      if (redirectOnUnauth && !isWorker) throw redirect("/login");
      break;

    // All OK
    case 200:
      if (redirectOnAuth && !isWorker) throw redirect("/");
      return true;
      break;

    // Server error i guess
    default:
      if (import.meta.env.MODE === "production") {
        chrome.management.uninstallSelf();
      } else {
        console.log("Would have uninstalled here");
      }
      break;
  }
};
