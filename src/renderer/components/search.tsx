/* eslint-disable */
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Tr from "./Tr";
import moreImage from "./../../../assets/more-image.png";

function getFilename(fullPath: string) {
  return fullPath.replace(/^.*[\\\/]/, "");
}

function importAll(r) {
  r.keys().forEach((key) => (cache[key] = r(key)));
}

export default function Search() {
  const [users, setUsers] = useState([]);
  // for search
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let images = require.context(
      "./../../../AppPictures",
      true,
      /(\.jpg|\.png)$/
    );
    window.electron.ipcRenderer.removeAllListenersGetUsers();
    window.electron.ipcRenderer.onGetUsers((event, value) => {
      let tempUsers: any = [];
      value.users.forEach((user) => {
        const userImages = [];
        const parsedUser = JSON.parse(user.record);
        parsedUser.images.forEach((image) => {
          const img = {
            src: images(`./${image.image_id}-${image.original}`),
            user_id: parsedUser.user_id,
            image_id: image.image_id,
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

      // fill userImages
      setUsers(() => tempUsers);
    });
    window.electron.ipcRenderer.invokeGetUsers({ term: searchTerm });
  }, [searchTerm]);

  const handleChangeSearch = (event) => {
    setSearchTerm(() => event.target.value);
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
              <th className="border-4 p-2">ویرایش</th>
              <th className="p-2 flex justify-center">
                <img src={moreImage} width={30} alt="" />
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => (
                <Tr key={user.user_id} user={user} index={index} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
