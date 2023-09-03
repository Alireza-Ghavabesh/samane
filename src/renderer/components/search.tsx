/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ReactComponent as Next } from './../../../assets/icons/left-angle-arrow-outline-icon.svg';
import { ReactComponent as Back } from './../../../assets/icons/right-angle-arrow-outline-icon.svg';

export default function Search() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.removeAllListenersGetUsers();
    window.electron.ipcRenderer.onGetUsers((event, value) => {
      console.log(value.users.length);
      setUsers(value.users);
    });
    window.electron.ipcRenderer.invokeGetUsers({ term: searchTerm });
  }, [searchTerm]);

  const handleChangeSearch = (event) => {
    setSearchTerm(() => event.target.value);
    // window.electron.ipcRenderer.invokeGetUsers({ term: event.target.value });
  };

  return (
    <div>
      <div className="flex flex-row p-4 gap-4 justify-between">
        <Link
          to="/"
          className="bg-yellow-400 text-2xl p-2 rounded-xl h-fit min-w-fit border-black border-4"
        >
          بازگشت
        </Link>
        <input
          type="text"
          className="border-2 outline-none placeholder:p-2 rounded-xl h-12 w-full"
          dir="rtl"
          placeholder="جستجو"
          onChange={handleChangeSearch}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          // eslint-disable-next-line jsx-a11y/no-autofocus
        />
      </div>
      <div dir="rtl" className="p-4">
        <table className="table-auto border w-full text-center">
          <thead>
            <tr className="border">
              <th className="border p-2">نام و نام خانوادگی</th>
              <th className="border p-2">کد ملی</th>
              <th className="border p-2">تاریخ تولد</th>
              <th className="border p-2">آدرس</th>
              <th className="border p-2">شماره همراه</th>
              <th className="border p-2">عکس</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 &&
              users.map((user, index) => (
                <tr key={JSON.parse(user.record).user_id} id={String(index)}>
                  <td className="border p-2">
                    {JSON.parse(user.record).full_name}
                  </td>
                  <td className="border p-2">
                    {JSON.parse(user.record).national_code}
                  </td>
                  <td className="border p-2">
                    {JSON.parse(user.record).birth_date}
                  </td>
                  <td className="border p-2">
                    {JSON.parse(user.record).address}
                  </td>
                  <td className="border p-2">
                    {JSON.parse(user.record).mobile}
                  </td>
                  <td className="flex border justify-center flex-col">
                    <div className="flex justify-around">
                      <div className="block m-auto">
                        <Back className="w-10" />
                      </div>
                      <img
                        src={require(`../../../pictures/1742909973/horizon-call-of-the-mountain-vr-game-hd-wallpaper-uhdpaper.com-804@0@i.jpg`)}
                        alt=""
                        className=""
                        width={400}
                      />
                      <div className="block m-auto">
                        <Next className="w-10" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
