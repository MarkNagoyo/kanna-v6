import { getItemAsync } from "../../Helpers/Storage/GetItem/GetItemAsync";
import { getElementByXPath } from "../Helpers/Xpath/getElementByXpath";

const mainFn = async () => {
  const notifyOnMessage = await getItemAsync("notifier.notifyOnMessage");

  const hasNewMessage = getElementByXPath(
    "//div[@class='list small center']/a[contains(text(), 'You have new messages!')]"
  );

  if (notifyOnMessage && hasNewMessage) {
    const audioElement = new Audio(
      chrome.runtime.getURL("Audio/notification.mp3")
    );

    // Play the sound
    audioElement
      .play()
      .catch((error) => console.error("Error playing the sound:", error));
  }
};

mainFn();
