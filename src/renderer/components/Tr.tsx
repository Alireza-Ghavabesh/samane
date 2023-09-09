/* eslint-disable */
import { useAlert } from 'react-alert';
import { useEffect, useState, useRef } from 'react';
import Gallery from './gallrey';
import iconSave from '../../../assets/Save.512.png';

export default function Tr(props) {
  const alert = useAlert();
  const [fullname, setFullname] = useState('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [nationalcode, setNationalcode] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const TrRef = useRef(null);

  const testAlert = () => {
    // console.log({
    //   fullname,
    //   address,
    //   birthDate,
    //   mobile,
    //   nationalcode,
    // });
    let user_id = TrRef.current.id;
    let fullName = TrRef.current.childNodes[0].textContent;
    let nationalCode = TrRef.current.childNodes[1].textContent;
    let birthDate = TrRef.current.childNodes[2].textContent;
    let address = TrRef.current.childNodes[3].textContent;
    let mobile = TrRef.current.childNodes[4].textContent;
    window.electron.ipcRenderer.invokeUpdateUser({
      user_id: user_id,
      fullName: fullName,
      nationalCode: nationalCode,
      birthDate: birthDate,
      address: address,
      mobile: mobile,
    });
    // alert.show('تغییرات با موفقیت دخیره شد', {
    //   timeout: 1500, // custom timeout just for this one alert
    //   type: 'success',
    //   onOpen: () => {
    //     console.log('hey');
    //   }, // callback that will be executed after this alert open
    //   onClose: () => {
    //     console.log('closed');
    //   }, // callback that will be executed after this alert is removed
    // });
  };

  return (
    <tr
      key={props.user.user_id}
      id={String(props.index)}
      className="odd:bg-gray-100"
      ref={TrRef}
    >
      <td
        className="border-4 p-2 outline-none"
        contentEditable
        onInput={handleChangeFullname}
      >
        {props.user.full_name}
      </td>
      <td
        className="border-4 p-2 outline-none"
        contentEditable
        onInput={handleChangeNationalcode}
      >
        {props.user.national_code}
      </td>
      <td
        className="border-4 p-2 outline-none"
        contentEditable
        onInput={handleChangeBirthDate}
      >
        {props.user.birth_date}
      </td>
      <td
        className="border-4 p-2 outline-none"
        contentEditable
        onInput={handleChangeAddress}
      >
        {props.user.address}
      </td>
      <td
        className="border-4 p-2 outline-none"
        contentEditable
        onInput={handleChangeMobile}
      >
        {props.user.mobile}
      </td>
      <td className="bg-orange-400 p-2 border-4 hover:bg-orange-600">
        <Gallery images={props.user.images} name="تصاویر" />
      </td>
      <td className="m-auto w-12 hover:bg-gray-600" onClick={testAlert}>
        <img src={iconSave} alt="" className="cursor-pointer" />
      </td>
    </tr>
  );
}
