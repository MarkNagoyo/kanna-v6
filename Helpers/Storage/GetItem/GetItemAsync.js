export const getItemAsync = async (key, isArray) => {
  // if (import.meta.env.MODE === "production")
  return (await chrome.storage.local.get(key))[key];

  const item = localStorage.getItem(key);

  if (!item) return null;

  if (item === "true") return true;
  if (item === "false") return false;

  if (isArray) return item.split(",");

  return item;
};
