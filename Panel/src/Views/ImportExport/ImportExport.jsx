import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import { AES } from "crypto-js";
import { enc } from "crypto-js/core";
import { useState } from "react";
import { Header } from "../../Components/Header/Header";
import { getItemAsync } from "../../../../Helpers/Storage/GetItem/GetItemAsync";
import { setItemAsync } from "../../../../Helpers/Storage/SetItem/SetItemAsync";

const DownloadConfig = async (file_name) => {
  const data = await chrome.storage.local.get();
  delete data.masterkey;
  delete data.token;
  delete data.accessToken;

  const encrypted = AES.encrypt(JSON.stringify(data), "eni.eni.eni");
  const blob = new Blob([encrypted], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${file_name}.txt`);
};

const UploadConfig = async ({ file, navigate }) => {
  file.preventDefault();
  const reader = new FileReader();
  reader.onload = async (e) => {
    const text = e.target.result;

    await chrome.storage.local.set(
      JSON.parse(AES.decrypt(text, "eni.eni.eni").toString(enc.Utf8))
    );
    navigate("/");
  };

  reader.readAsText(file.target.files[0]);
};

export default function ImportExport() {
  const [file_name, setFileName] = useState("Config");
  const navigate = useNavigate();
  return (
    <div className="flex flex-column items-center justify-center main-bg">
      <Header />

      <div className="flex flex-column justify-center items-center flex-wrap max-width-1">
        <input
          type="text"
          className="border border-primary center rounded p1 ml1 my1"
          placeholder="File name"
          onChange={(e) => setFileName(e.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.target.blur();
              DownloadConfig(file_name);
            }
          }}
        />

        <div
          className="border border-primary center rounded p1 ml1 my1 hoverable cursor-pointer bold"
          onClick={() => {
            DownloadConfig(file_name);
          }}
        >
          Download Config
        </div>
      </div>

      <div className="mt3 flex justify-center">
        <input
          type="file"
          onChange={(file) => UploadConfig({ file, navigate })}
          className="display-none"
          id="upload"
        />

        <label
          htmlFor="upload"
          className="border border-primary center rounded h3 p1 hoverable cursor-pointer bold"
        >
          Upload file
        </label>
      </div>
    </div>
  );
}
