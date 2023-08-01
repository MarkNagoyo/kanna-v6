export const setItemAsync = async (key, value) => {
  // if (import.meta.env.MODE === "production")
  return await chrome.storage.local.set({ [key]: value });

  let val = value;

  if (Array.isArray(value)) {
    val = value.join(",");
  }

  return localStorage.setItem(key, val);
};
