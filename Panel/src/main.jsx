import React from "react";
import ReactDOM from "react-dom/client";
import "./Assets/Css/basscss.min.css";
import "./Assets/Css/common.css";

import { isMobile } from "react-device-detect";
import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";

import Index, { indexLoader } from "./Views/Index/Index.jsx";
import { Login, loginLoader } from "./Views/Login/Login.jsx";
import { Map } from "./Views/Map/Map";
import { AvoidEnemies } from "./Views/Map/AvoidEnemies/AvoidEnemies";
import { PrioritizeEnemies } from "./Views/Map/PrioritizeEnemies/PrioritizeEnemies";
import { Enemies } from "./Views/Enemies/Enemies";
import { Storage } from "./Views/Storage/Storage";
import { Inventory } from "./Views/Inventory/Inventory";
import { AutoBoost, autoBoostLoader } from "./Views/AutoBoost/AutoBoost";
import { Bosses, bossesLoader } from "./Views/Bosses/Bosses";
import { Dungeon } from "./Views/Dungeon/Dungeon";
import { Outdated } from "./Views/Outdated/Outdated";
import ImportExport from "./Views/ImportExport/ImportExport";
import Notifier, { notifierLoader } from "./Views/Notifications/Notifier";
import StorageSorter, {
  storageSorterLoader,
} from "./Views/StorageSorter/StorageSorter";
import Plugins from "./Views/Plugins/Plugins";

// if (isMobile) {
//   await import("./Assets/Css/Mobile.css");
// } else {
//   await import("./Assets/Css/Desktop.css");
// }

const router = createHashRouter([
  {
    path: "/login",
    element: <Login />,
    loader: loginLoader,
  },
  {
    path: "/",
    element: <Index />,
    loader: indexLoader,
  },
  {
    path: "/category/map/",
    element: <Map />,
    loader: indexLoader,
  },
  {
    path: "/category/enemyavoid/",
    element: <AvoidEnemies />,
    loader: indexLoader,
  },
  {
    path: "/category/enemypriority/",
    element: <PrioritizeEnemies />,
    loader: indexLoader,
  },
  {
    path: "/category/enemies/",
    element: <Enemies />,
    loader: indexLoader,
  },
  {
    path: "/category/storage/",
    element: <Storage />,
    loader: indexLoader,
  },
  {
    path: "/category/inventory/",
    element: <Inventory />,
    loader: indexLoader,
  },
  {
    path: "/category/autoboost/",
    element: <AutoBoost />,
    loader: autoBoostLoader,
  },
  {
    path: "/category/bosses/",
    element: <Bosses />,
    loader: bossesLoader,
  },
  {
    path: "/category/dungeon/",
    element: <Dungeon />,
    loader: indexLoader,
  },
  {
    path: "/outdated",
    element: <Outdated />,
  },
  {
    path: "/category/importexport",
    element: <ImportExport />,
    loader: indexLoader,
  },
  {
    path: "/category/notifier",
    element: <Notifier />,
    loader: notifierLoader,
  },
  {
    path: "/category/storagesorter",
    element: <StorageSorter />,
    loader: storageSorterLoader,
  },
  {
    path: "/category/plugins",
    element: <Plugins />,
    loader: indexLoader,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
