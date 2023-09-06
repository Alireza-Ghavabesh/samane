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

  const ref = useRef(null);

  useEffect(() => {
    // The DOM element is accessible here.
    console.log(ref.current);
  }, []);

  // getting td contents
  const handleChangeFullname = (event) => {
    const content = event.currentTarget.textContent;
    setFullname(() => content);
  };
  const handleChangeNationalcode = (event) => {
    const content = event.currentTarget.textContent;
    setNationalcode(() => content);
  };
  const handleChangeBirthDate = (event) => {
    const content = event.currentTarget.textContent;
    setBirthDate(() => content);
  };

  const handleChangeAddress = (event) => {
    const content = event.currentTarget.textContent;
    setAddress(() => content);
  };

  const handleChangeMobile = (event) => {
    const content = event.currentTarget.textContent;
    setMobile(() => content);
  };

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
    <tr
      key={props.user.user_id}
      id={String(props.index)}
      className="odd:bg-gray-100"
    >
      <td
        className="border-4 p-2 outline-none"
        contentEditable
        onInput={handleChangeFullname}
        ref={ref}
      >
        {props.user.full_name}
      </td>
      <td
        className="border-4 p-2"
        contentEditable
        onInput={handleChangeNationalcode}
        ref={ref}
      >
        {props.user.national_code}
      </td>
      <td
        className="border-4 p-2"
        contentEditable
        onInput={handleChangeBirthDate}
        ref={ref}
      >
        {props.user.birth_date}
      </td>
      <td
        className="border-4 p-2"
        contentEditable
        onInput={handleChangeAddress}
        ref={ref}
      >
        {props.user.address}
      </td>
      <td
        className="border-4 p-2"
        contentEditable
        onInput={handleChangeMobile}
        ref={ref}
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
