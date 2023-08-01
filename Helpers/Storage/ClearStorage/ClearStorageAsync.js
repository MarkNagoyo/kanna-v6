export const clearStorageAsync = async () => {
  // if (import.meta.env.MODE === "production")
  return await chrome.storage.local.clear();

  return localStorage.clear();
};
