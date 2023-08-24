/* eslint-disable prettier/prettier */
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Search() {
  useEffect(() => {
    console.log('loaded search');
  });

  return (
    <div className="flex p-4 gap-4 justify-between">
      <Link
        to="/"
        className="bg-yellow-400 text-2xl p-2 rounded-xl h-fit min-w-fit"
      >
        بازگشت
      </Link>
    </div>
  );
}
