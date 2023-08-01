import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../../../Helpers/Auth/Authentication";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";
import { Category } from "../../Components/Category/Category";
import { Header } from "../../Components/Header/Header";
import { Toggle } from "../../Components/Toggle/Toggle";

export const loginLoader = async () => {
  const token = await getItemAsync("token");
  const accessToken = await getItemAsync("accessToken");
  // console.log({ token, accessToken });

  // console.log(redirect);
  await isAuthenticated({ redirect, redirectOnAuth: true });
  return null;
};

const getLoginResponse = async (username, password, setError, navigate) => {
  setError(null);

  if (!username || !password) {
    setError("Username or Password cannot be empty");
    return null;
  }

  let response;
  let responseMessage;

  try {
    response = await fetch(import.meta.env.VITE_SERVER_URI + "/Login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache",
    });
  } catch (e) {
    setError("Unexpected server error");
    return null;
  }

  try {
    responseMessage = await response.json();
  } catch (e) {
    setError("Unexpected server error");
    return null;
  }

  switch (response.status) {
    case 400:
      setError(responseMessage.message);
      break;

    case 200:
      // Success
      await setItemAsync("token", responseMessage.token);
      await setItemAsync("accessToken", responseMessage.accessToken);
      return navigate("/", { replace: true });

    default:
      setError("Unexpected server error");
      break;
  }
};

export const Login = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [loadingData, setLoadingData] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");

  const [error, setError] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingData) return () => {};

    const interval = setInterval(() => {
      if (loadingDots.length < 3) {
        setLoadingDots(loadingDots + ".");
      } else {
        setLoadingDots(".");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [loadingData, loadingDots]);

  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex flex-column justify-center items-center flex-wrap max-width-1 stretch mt1">
        {error && (
          <div
            className="flex stretch max-width-1 border border-error unselectable rounded py1 justify-center cursor-pointer"
            onClick={() => {
              setError(null);
            }}
          >
            <span className="color-error">{error}</span>
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="border border-primary center rounded p1 ml1 mt1 unselectable"
          onChange={(e) => {
            setUsernameInput(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.target.blur();

              setLoadingData(true);

              await getLoginResponse(
                usernameInput,
                passwordInput,
                setError,
                navigate
              );
              setLoadingData(false);
            }
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-primary center rounded p1 ml1 mt1 unselectable"
          onChange={(e) => {
            setPasswordInput(e.target.value);
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.target.blur();

              setLoadingData(true);

              await getLoginResponse(
                usernameInput,
                passwordInput,
                setError,
                navigate
              );
              setLoadingData(false);
            }
          }}
        />

        <div
          className={`border border-primary center rounded py1 px2 mt1 unselectable ${
            !loadingData ? "cursor-pointer hoverable" : "disabled"
          }`}
          onClick={async () => {
            if (loadingData) return null;

            setLoadingData(true);

            await getLoginResponse(
              usernameInput,
              passwordInput,
              setError,
              navigate
            );

            setLoadingData(false);
          }}
        >
          {loadingData ? `Loading${loadingDots}` : "Login"}
        </div>
      </div>
    </div>
  );
};
