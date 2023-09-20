import { useState, useRef, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import iconDelete from "../../../assets/delete-orange.png";

export default function Gallery(props) {
  const [userImages, setUserImages] = useState(props.images);
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const deleteUserImage = () => {
    if (ref.current.getLightboxState().slides.length > 0) {
      const user_id = ref.current.getLightboxState().currentSlide.user_id;
      const image_id = ref.current.getLightboxState().currentSlide.image_id;
      const image_name = ref.current.getLightboxState().currentSlide.image_name;
      window.electron.ipcRenderer.removeAllListenersResultDeleteUserImage();
      window.electron.ipcRenderer.onResultDeleteUserImage((event, value) => {
        if (value.status === "OK") {
          console.log(`deleted: user_id=${user_id} , image_id=${image_id}`);
          setUserImages(() =>
            userImages.filter((image) => {
              return image.image_id !== image_id;
            })
          );
          // console.log(userImages);
          // setUserImages(() =>
          //   userImages.splice(ref.current.getLightboxState().currentIndex)
          // );
        }
      });

      window.electron.ipcRenderer.invokeDeleteUserImage({
        user_id: user_id,
        image_id: image_id,
        image_name: image_name,
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setUserImages(() => userImages);
  });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="w-full">
        {props.name}
      </button>

      <Lightbox
        toolbar={{
          buttons: [
            <button
              key="delete-image"
              type="button"
              className="yarl__button"
              style={{ width: 80 }}
              onClick={deleteUserImage}
            >
              <img src={iconDelete} alt="" />
            </button>,
            "close",
          ],
        }}
        plugins={[Thumbnails, Counter]}
        open={open}
        close={() => setOpen(false)}
        slides={userImages}
        controller={{ ref }}
      />
    </>
  );
}
