export const removeItemAsync = async (slug) => {
  // if (import.meta.env.MODE === "production")
  return await chrome.storage.local.remove(slug);

  return localStorage.removeItem(slug);
};
