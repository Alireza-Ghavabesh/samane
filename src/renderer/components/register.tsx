import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="flex p-4 gap-4 justify-between">
      <Link to="/" className="bg-green-300 h-fit text-2xl p-2 rounded-xl">
        بازگشت
      </Link>
    </div>
  );
}
