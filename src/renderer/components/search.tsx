/* eslint-disable react/no-array-index-key */
/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Search() {

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.electron.ipcRenderer.removeAllListenersGetUsers();
    window.electron.ipcRenderer.onGetUsers((event, value) => {
      console.log(value.users);
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
          className="border-2  outline-none placeholder:p-2 rounded-xl h-12 w-full"
          dir="rtl"
          placeholder="جستجو"
          onChange={handleChangeSearch}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
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
                <tr key={user.id} id={String(index)}>
                  <td className="border p-2">{user.full_name}</td>
                  <td className="border p-2">{user.national_code}</td>
                  <td className="border p-2">{user.birth_date}</td>
                  <td className="border p-2">{user.address}</td>
                  <td className="border p-2">{user.mobile}</td>
                  <td className="border p-2">
                    <img
                      src="https://www.dehkadehquran.ir/wp-content/uploads/elementor/thumbs/-دوره-تجوید-سطح-یک-2-q7mjcu57kej5rjxenma7f838pldfoba387fb85knre.jpg"
                      alt=""
                      width={272}
                      height={161}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
