/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
// import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Tr from './Tr';

export default function Search() {
  // const alert = useAlert();
  // for users
  const [users, setUsers] = useState([]);
  // for search
  const [searchTerm, setSearchTerm] = useState('');
  // for
  // const [fullname, setFullname] = useState('');
  // const [address, setAddress] = useState('');
  // const [mobile, setMobile] = useState('');
  // const [nationalcode, setNationalcode] = useState('');
  // const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.removeAllListenersGetUsers();
    window.electron.ipcRenderer.onGetUsers((event, value) => {
      let tempUsers = [];
      value.users.forEach((user) => {
        const userImages: { original: string; thumbnail: string }[] = [];
        const parsedUser = JSON.parse(user.record);
        parsedUser.images.forEach((image) => {
          const img = {
            src: `file:///${image.original}`,
          };
          userImages.push(img);
        });
        const newUser = {
          user_id: parsedUser.user_id,
          full_name: parsedUser.full_name,
          mobile: parsedUser.mobile,
          address: parsedUser.address,
          birth_date: parsedUser.birth_date,
          national_code: parsedUser.national_code,
          images: userImages,
        };
        tempUsers.push(newUser);
      });

      console.log(tempUsers);
      // fill userImages
      setUsers(() => tempUsers);
    });
    window.electron.ipcRenderer.invokeGetUsers({ term: searchTerm });
  }, [searchTerm]);

  const handleChangeSearch = (event) => {
    setSearchTerm(() => event.target.value);
  };
  // // getting td contents
  // const handleChangeFullname = (event) => {
  //   const content = event.currentTarget.textContent;
  //   setFullname(() => content);
  // };
  // const handleChangeNationalcode = (event) => {
  //   const content = event.currentTarget.textContent;
  //   setNationalcode(() => content);
  // };
  // const handleChangeBirthDate = (event) => {
  //   const content = event.currentTarget.textContent;
  //   setBirthDate(() => content);
  // };

  // const handleChangeAddress = (event) => {
  //   const content = event.currentTarget.textContent;
  //   setAddress(() => content);
  // };

  // const handleChangeMobile = (event) => {
  //   const content = event.currentTarget.textContent;
  //   setMobile(() => content);
  // };

  const testAlert = () => {
    console.log({
      fullname,
      address,
      birthDate,
      mobile,
      nationalcode,
    });
    alert.show('تغییرات با موفقیت دخیره شد', {
      timeout: 1500, // custom timeout just for this one alert
      type: 'success',
      onOpen: () => {
        console.log('hey');
      }, // callback that will be executed after this alert open
      onClose: () => {
        console.log('closed');
      }, // callback that will be executed after this alert is removed
    });
  };

  return (
    <div>
      <div className="flex flex-row p-4 gap-4 justify-between">
        <Link
          to="/"
          className="bg-yellow-400 text-2xl p-2 rounded-xl h-fit min-w-fit border-black border-4 hover:bg-white"
        >
          بازگشت
        </Link>
        <input
          type="text"
          className="border-2 border-gray-400 outline-none placeholder:p-2 rounded-xl h-12 w-full"
          dir="rtl"
          placeholder="جستجو"
          onChange={handleChangeSearch}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          // eslint-disable-next-line jsx-a11y/no-autofocus
        />
      </div>
      <div dir="rtl" className="p-4">
        <table className="table-auto border-4 w-full text-center">
          <thead>
            <tr className="border-4">
              <th className="border-4 p-2">نام و نام خانوادگی</th>
              <th className="border-4 p-2">کد ملی</th>
              <th className="border-4 p-2">تاریخ تولد</th>
              <th className="border-4 p-2">آدرس</th>
              <th className="border-4 p-2">شماره همراه</th>
              <th className="border-4 p-2">تصاویر</th>
              <th className="border-4 p-2">ذخیره</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => (
                // <tr
                //   key={user.user_id}
                //   id={String(index)}
                //   className="odd:bg-gray-100"
                // >
                //   <td
                //     className="border-4 p-2 outline-none"
                //     contentEditable
                //     onInput={handleChangeFullname}
                //   >
                //     {user.full_name}
                //   </td>
                //   <td
                //     className="border-4 p-2"
                //     contentEditable
                //     onInput={handleChangeNationalcode}
                //   >
                //     {user.national_code}
                //   </td>
                //   <td
                //     className="border-4 p-2"
                //     contentEditable
                //     onInput={handleChangeBirthDate}
                //   >
                //     {user.birth_date}
                //   </td>
                //   <td
                //     className="border-4 p-2"
                //     contentEditable
                //     onInput={handleChangeAddress}
                //   >
                //     {user.address}
                //   </td>
                //   <td
                //     className="border-4 p-2"
                //     contentEditable
                //     onInput={handleChangeMobile}
                //   >
                //     {user.mobile}
                //   </td>
                //   <td className="bg-orange-400 p-2 border-4 hover:bg-orange-600">
                //     <Gallery images={user.images} name="تصاویر" />
                //   </td>
                //   <td
                //     className="m-auto w-12 hover:bg-gray-600"
                //     onClick={testAlert}
                //   >
                //     <img src={iconSave} alt="" className="cursor-pointer" />
                //   </td>
                // </tr>
                <Tr user={user} index={index} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
