/* eslint-disable */

import { useEffect, useRef, useState } from "react";
import Gallery from "./gallrey";
import { toast } from "react-toastify";
import IRANSansWeb from "./../../../assets/fonts/IRANSansWeb.woff2";

export default function Tr(props) {
  const [userImages, setUserImages] = useState(props.user.images);
  const TrRef = useRef(null);
  const notify = () => {
    let user_id = TrRef.current.id;
    let fullName = TrRef.current.childNodes[0].textContent;
    let nationalCode = TrRef.current.childNodes[1].textContent;
    let birthDate = TrRef.current.childNodes[2].textContent;
    let address = TrRef.current.childNodes[3].textContent;
    let mobile = TrRef.current.childNodes[4].textContent;
    let newInfo = {
      user_id: user_id,
      fullName: fullName,
      nationalCode: nationalCode,
      birthDate: birthDate,
      address: address,
      mobile: mobile,
    };

    window.electron.ipcRenderer.removeAllListenersResultUpdateUser();
    window.electron.ipcRenderer.onResultUpdateUser((event, value) => {
      if (value.status === "OK") {
        toast.success("تغییرات ذخیره شد", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          style: {
            fontFamily: "IRANSansWeb",
          },
        });
      }
    });
    window.electron.ipcRenderer.invokeUpdateUser(newInfo);
  };

  const addMoreImages = () => {
    let user_id = TrRef.current.id;
    let nationalCode = TrRef.current.childNodes[1].textContent;

    window.electron.ipcRenderer.removeAllListenersResultNewUserImages();
    window.electron.ipcRenderer.onResultNewUserImages((event, value) => {
      console.log(event, value);
      if (value.status === "canceled") {
        console.log("canceled");
      } else if (value.status === "ErrorInsert") {
        if (JSON.parse(value.error).code === "SQLITE_CONSTRAINT") {
          toast.error("عکس تکراری ذخیره نشد", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
            style: {
              fontFamily: "IRANSansWeb",
            },
          });
        }
      } else if (value.status === "OkInsert") {
        console.log(value.newImagePath);
        console.log(value.user_id);
        console.log(value.image_id);
        // setUserImages(() =>
        //   userImages.push({
        //     src: require(`${value.newImagePath}`),
        //     user_id: value.user_id,
        //     image_id: value.image_id,
        //   })
        // );
        toast.success("عکس ذخیره شد", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          style: {
            fontFamily: "IRANSansWeb",
          },
        });
      } else if (value.status === "ErrorCopy") {
        toast.error("مشکلی در کپی فایل ها پیش آمده", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
          style: {
            fontFamily: "IRANSansWeb",
          },
        });
      }
    });
    window.electron.ipcRenderer.invokeNewUserImages({
      user_id: user_id,
      nationalCode: nationalCode,
    });
  };

  useEffect(() => {
    setUserImages(() => userImages);
  }, [userImages]);

  return (
    <tr
      key={props.user.user_id}
      id={props.user.user_id}
      className="odd:bg-gray-100"
      ref={TrRef}
    >
      <td className="border-4 p-2 outline-none" contentEditable>
        {props.user.full_name}
      </td>
      <td className="border-4 p-2 outline-none" contentEditable>
        {props.user.national_code}
      </td>
      <td className="border-4 p-2 outline-none" contentEditable>
        {props.user.birth_date}
      </td>
      <td className="border-4 p-2 outline-none" contentEditable>
        {props.user.address}
      </td>
      <td className="border-4 p-2 outline-none" contentEditable>
        {props.user.mobile}
      </td>
      <td className="bg-orange-400 border-4 hover:bg-orange-600">
        <Gallery images={userImages} name="تصاویر" />
      </td>
      <td className="hover:bg-gray-300 cursor-pointer" onClick={notify}>
        ذخیره
      </td>
      <td
        className="flex justify-center items-center border-r-4 outline-none text-4xl hover:transition hover:bg-gray-300  cursor-pointer"
        onClick={addMoreImages}
      >
        +
      </td>
    </tr>
  );
}
