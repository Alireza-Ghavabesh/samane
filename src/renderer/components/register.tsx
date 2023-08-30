/* eslint-disable react/button-has-type */
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [nationalCode, setNationalCode] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [IsImagechoosed, setIsImagechoosed] = useState(false);

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
    setIsImagechoosed(true);
    e.preventDefault();
    window.electron.ipcRenderer.registerUserInfo({
      op_type: 'images',
    });
  }

  function registerUserInfo(e) {
    e.preventDefault();

    window.electron.ipcRenderer.onResultRegister((event, value) => {
      if (value.status === 'OK') {
        alert('اطلاعات با موفقیت ثبت شد');
      }
    });

    if (IsImagechoosed) {
      window.electron.ipcRenderer.registerUserInfo({
        op_type: 'info',
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
      console.log(fullName);
      console.log(nationalCode);
      console.log(year);
      console.log(month);
      console.log(day);
      console.log(address);
      console.log(mobile);
    } else {
      alert('تصویر انتخاب نکرده اید!');
    }
  }

  return (
    <div className="flex p-4 gap-4 justify-between h-screen bg-emerald-700">
      <Link
        to="/"
        className="bg-yellow-400 text-2xl p-2 rounded-xl h-fit min-w-fit border-black border-4"
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
