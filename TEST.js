// eslint-disable-next-line no-undef
const fs = require('fs');
const path = require('path');
const { basename } = require('path');

function copyFileFromDatabase(FILEPATH, DEST) {
  let src = FILEPATH;
  // fs.mkdir(national_code);
  let national_code = DEST;
  let dest = `${national_code}/${basename(src)}`;
  if (!fs.existsSync(`${national_code}`)) {
    fs.mkdirSync(`${national_code}`, { recursive: true });
  }

  // eslint-disable-next-line camelcase
  fs.copyFile(src, dest, (err) => {
    if (err) throw err;
    console.log('op successfull');
  });
}

copyFileFromDatabase(
  'D:\\wallpaper\\samurai-art-hd-wallpaper-uhdpaper.com-534@0@i.jpg',
  'pictures/1742909973'
);
