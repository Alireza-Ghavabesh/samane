/* eslint-disable react/button-has-type */
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import IRANSansWeb from "./../../../assets/fonts/IRANSansWeb.woff2";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const handleChangeFullName = (event) => {
    setFullName(() => event.target.value);
  };

  const handleChangeNationalCode = (event) => {
    setNationalCode(() => event.target.value);
  };

  const handleChangeYear = (event) => {
    setYear(() => event.target.value);
  };

  const handleChangeMonth = (event) => {
    setMonth(() => event.target.value);
  };

  const handleChangeDay = (event) => {
    setDay(() => event.target.value);
  };

  const handleChangeAddress = (event) => {
    setAddress(() => event.target.value);
  };

  const handleChangeMobile = (event) => {
    setMobile(() => event.target.value);
  };

  //= =====================================

  function selectImages(e) {
    e.preventDefault();
    window.electron.ipcRenderer.invokeRegisterUserInfo({
      op_type: "images",
    });
  }

  function isNumeric(str) {
    if (typeof str != "string") return false; // we only process strings!
    return (
      // eslint-disable-next-line no-restricted-globals
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      // eslint-disable-next-line no-restricted-globals
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  }

  function registerUserInfo(e) {
    e.preventDefault();
    let nationalCodeStatus = false;

    if (nationalCode !== "" && isNumeric(nationalCode)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      nationalCodeStatus = true;
    }

    if (nationalCodeStatus) {
      window.electron.ipcRenderer.removeAllListenersResultRegister();
      window.electron.ipcRenderer.onResultRegister((event, value) => {
        console.log(value.status);
        if (value.status === "OkInsert") {
          console.log(value.status);
          toast.success("اطلاعات ذخیره شد", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
            style: {
              fontFamily: "IRANSansWeb",
            },
          });
        } else if (value.status === "ErrorInsertUser") {
          if (JSON.parse(value.error).code === "SQLITE_CONSTRAINT") {
            toast.error("کد ملی تکراری است", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
              style: {
                fontFamily: "IRANSansWeb",
              },
            });
          }
        }
      });

      window.electron.ipcRenderer.invokeRegisterUserInfo({
        op_type: "info",
        info: {
          fullName,
          nationalCode,
          year,
          month,
          day,
          address,
          mobile,
        },
      });
    } else {
      toast.error("لطفا یک کدملی وارد کنید", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
        style: {
          fontFamily: "IRANSansWeb",
        },
      });
    }
  }

  return (
    <div className="flex p-4 gap-4 justify-between h-screen bg-emerald-700">
      <Link
        to="/"
        className="bg-yellow-400 text-2xl hover:bg-emerald-800 p-2 rounded-xl h-fit min-w-fit border-black border-4"
      >
        بازگشت
      </Link>

      <form
        action="/"
        method="post"
        className="flex flex-col gap-4 bg-emerald-800 p-4 rounded-xl w-full"
      >
        <input
          type="text"
          className="border-4 outline-none placeholder:p-2 rounded-xl h-1/6 placeholder:text-2xl"
          dir="rtl"
          placeholder="نام و نام خانوادگی"
          onChange={handleChangeFullName}
        />
        <input
          type="text"
          className="border-4 outline-none placeholder:p-2 rounded-xl h-1/6 placeholder:text-2xl"
          dir="rtl"
          placeholder="کد ملی"
          onChange={handleChangeNationalCode}
        />
        <input
          type="text"
          className="border-4 outline-none placeholder:p-2 rounded-xl h-1/6 placeholder:text-2xl"
          dir="rtl"
          placeholder="شماره همراه"
          onChange={handleChangeMobile}
        />
        <div className="flex gap-2 justify-between h-1/6">
          <input
            type="text"
            className="border-4 outline-none placeholder:p-2 rounded-xl w-1/4 placeholder:text-2xl"
            dir="rtl"
            placeholder="سال"
            onChange={handleChangeYear}
          />
          <input
            type="text"
            className="border-4 outline-none placeholder:p-2 rounded-xl w-1/4 placeholder:text-2xl"
            dir="rtl"
            placeholder="ماه"
            onChange={handleChangeMonth}
          />
          <input
            type="text"
            className="border-4 outline-none placeholder:p-2 rounded-xl w-1/4 placeholder:text-2xl"
            dir="rtl"
            placeholder="روز"
            onChange={handleChangeDay}
          />
          <div className="flex items-center border-2 px-2 bg-lime-200 w-1/4 justify-center text-2xl">
            تاریخ تولد
          </div>
        </div>
        <input
          type="text"
          className="border-4 outline-none placeholder:p-2 h-1/6 rounded-xl placeholder:text-2xl"
          dir="rtl"
          placeholder="آدرس"
          onChange={handleChangeAddress}
        />
        <button
          id="upload-tasvir"
          onClick={selectImages}
          className="bg-white border-4 outline-none placeholder:p-2 h-1/6 rounded-xl text-2xl"
        >
          انتخاب تصویر
        </button>
        <button
          className="bg-yellow-200 rounded-xl h-1/6 text-2xl"
          onClick={registerUserInfo}
        >
          ثبت
        </button>
      </form>
    </div>
  );
}
