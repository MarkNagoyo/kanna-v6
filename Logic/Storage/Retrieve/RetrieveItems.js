import { getItemAsync } from "../../../Helpers/Storage/GetItem/GetItemAsync";
import { removeItemAsync } from "../../../Helpers/Storage/RemoveItem/RemoveItemAsync";
import { setItemAsync } from "../../../Helpers/Storage/SetItem/SetItemAsync";
import { getElementByXPath } from "../../Helpers/Xpath/getElementByXpath";
import { getElementsByXPath } from "../../Helpers/Xpath/getElementsByXpath";

const extractValuesFromURL = (url) => {
  const splitUrl = url.split("/");
  const output = {};
  splitUrl.map((chunk) => {
    if (chunk.includes("=")) {
      const splitChunk = chunk.split("=");
      output[splitChunk[0]] = splitChunk[1];
    }
  });

  return output;
};

const parser = new DOMParser();

export const RetrieveItems = async () => {
  const itemList = getElementsByXPath(
    "//a[contains(@href, 'https://blackdragon.mobi/buildings/view/building=') and contains(@href, 'action=get_items/id=')]"
  );

  const maxCapacity = parseInt(
    getElementByXPath("//div[@class='block']/text()[4]").textContent.replace(
      "/",
      ""
    )
  );

  const freeSpace =
    maxCapacity -
    parseInt(getElementByXPath("//div[@class='block']/strong[2]").textContent);

  let selectedAmount = 0;

  const itemListContainer = getElementByXPath("//div[@class='list']");

  const selectAllContainer = document.createElement("div");
  const selectAllDiv = document.createElement("div");
  const selectAllLink = document.createElement("a");
  const continueButton = document.createElement("input");

  selectAllLink.textContent = "(Select all)";
  selectAllLink.setAttribute("id", "selectAllLink");
  selectAllLink.style.cursor = "pointer";
  selectAllLink.onclick = (e) => {
    const element = e.currentTarget;
    const newStatus = !(element.getAttribute("selected") === "true");

    const checkBoxes = getElementsByXPath("//input[@type='checkbox']");
    element.setAttribute("selected", newStatus);

    if (newStatus === true) {
      element.textContent = "(Unselect all)";
    } else {
      element.textContent = "(Select all)";
    }

    checkBoxes.map((checkbox, index) => {
      if (newStatus === true) {
        if (selectedAmount + 1 > freeSpace || checkbox.checked) return null;
        selectedAmount++;
      } else {
        if (selectedAmount > 0) selectedAmount--;
      }

      checkbox.checked = newStatus;
      checkbox.value = newStatus;
    });
  };

  selectAllDiv.textContent = "Select items ";
  selectAllDiv.appendChild(selectAllLink);

  continueButton.name = continueButton.type = "submit";
  continueButton.className = "button";
  continueButton.value = "Continue »";

  continueButton.onclick = async () => {
    const checkedItems = getElementsByXPath(
      "//input[@type='checkbox' and @value='true']"
    );

    if (checkedItems.length === 0) return null;
    itemListContainer.style.display = "none";
    selectAllContainer.style.display = "none";

    const confirmContainer = document.createElement("div");
    confirmContainer.className = "list";
    confirmContainer.innerHTML = "Are you sure?<br>";

    const confirmButton = document.createElement("input");
    confirmButton.name = confirmButton.type = "submit";
    confirmButton.className = "button";
    confirmButton.value = "Confirm »";
    confirmButton.onclick = async () => {
      const baseUrl = "https://blackdragon.mobi/buildings/view/";
      const outputContainer = document.getElementById("outputContainer");

      confirmContainer.style.display = "none";
      outputContainer.innerHTML = `Retrieving Item: <b>${checkedItems[0].nextElementSibling.textContent}</b>`;
      const firstItemFetch = await fetch(checkedItems[0].getAttribute("link"));
      const firstItemRaw = await firstItemFetch.text();

      const firstItemParsed = parser.parseFromString(firstItemRaw, "text/html");

      let vars = extractValuesFromURL(
        getElementByXPath(
          "//a[contains(@href, 'https://blackdragon.mobi/buildings/view/building=') and contains(@href, 'action=get_items/id=')]",
          firstItemParsed
        ).href
      );

      checkedItems.shift();

      for (let i = 0; i < checkedItems.length; i++) {
        const element = checkedItems[i];

        const link = element.getAttribute("link");

        const vars2 = extractValuesFromURL(link);
        vars2["c"] = vars["c"];
        vars2["captcha"] = vars["captcha"];

        const results = [];

        Object.keys(vars2).map((key) => {
          results.push(`${key}=${vars2[key]}`);
        });

        outputContainer.innerHTML = `Retrieving Item: <b>${element.nextElementSibling.textContent}</b>`;
        const itemFetch = await fetch(`${baseUrl}${results.join("/")}`);
        const itemFetchRaw = await itemFetch.text();

        const itemFetchParsed = parser.parseFromString(
          itemFetchRaw,
          "text/html"
        );

        const isInventoryFull = getElementByXPath(
          "//div[@class='block' and contains(text(), 'Sorry, your inventory is full!')]",
          itemFetchParsed
        );

        if (isInventoryFull) {
          console.log("Inventory full");
          return null;
        }

        vars = extractValuesFromURL(
          getElementByXPath(
            "//a[contains(@href, 'https://blackdragon.mobi/buildings/view/building=') and contains(@href, 'action=get_items/id=')]",
            itemFetchParsed
          ).href
        );
      }

      outputContainer.innerHTML = `Finished Retrieving All Items`;
      location.reload();
    };

    const itemOutputContainer = document.createElement("div");
    itemOutputContainer.className = "list";
    itemOutputContainer.setAttribute("id", "outputContainer");

    checkedItems.map((item) => {
      const elem = document.createElement("div");
      elem.className = "list";
      elem.textContent = item.nextElementSibling.textContent;
      itemOutputContainer.appendChild(elem);
    });

    confirmContainer.appendChild(confirmButton);

    itemListContainer.parentElement.insertBefore(
      confirmContainer,
      itemListContainer
    );

    itemListContainer.parentElement.insertBefore(
      document.createElement("br"),
      itemListContainer
    );

    itemListContainer.parentElement.insertBefore(
      itemOutputContainer,
      itemListContainer
    );

    return null;
  };

  selectAllContainer.appendChild(selectAllDiv);
  selectAllContainer.appendChild(continueButton);

  itemListContainer.parentNode.insertBefore(
    selectAllContainer,
    itemListContainer
  );

  itemList.map((item) => {
    const newSpan = document.createElement("div");
    newSpan.style.width = "fit-content";

    const sibling = item.nextSibling;
    const nextSibling = sibling.nextSibling;
    sibling.remove();

    if (nextSibling.tagName === "SPAN") {
      nextSibling.nextSibling.remove();
      nextSibling.remove();
    }

    newSpan.innerHTML = `
        <input type="checkbox" value="false" link="${item.href}">
        &nbsp;<u style='color: white'>${item.textContent}</u>
        ${nextSibling.tagName === "SPAN" ? nextSibling.outerHTML : ""}
        <div class="line"></div>
    `;

    newSpan.onclick = (e) => {
      const checkbox = e.currentTarget.firstElementChild;

      if (checkbox.checked === false) {
        if (selectedAmount + 1 === freeSpace) {
          document
            .getElementById("selectAllLink")
            .setAttribute("selected", true);

          document.getElementById("selectAllLink").textContent =
            "(Unselect all)";
        }

        if (selectedAmount >= freeSpace) return null;
      }

      checkbox.checked = !checkbox.checked;
      checkbox.value = !(checkbox.value === "true");

      if (checkbox.checked === false) {
        selectedAmount -= 1;

        document
          .getElementById("selectAllLink")
          .setAttribute("selected", false);

        document.getElementById("selectAllLink").textContent = "(Select all)";
      } else {
        selectedAmount += 1;
      }
    };

    item.parentNode.replaceChild(newSpan, item);
  });
};
