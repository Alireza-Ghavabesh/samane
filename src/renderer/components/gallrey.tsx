import { useState, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/counter.css";
import iconDelete from "../../../assets/delete-orange.png";

export default function Gallery(props) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);

  const deleteUserImage = () => {
    if (ref.current.getLightboxState().slides.length > 0) {
      const user_id = ref.current.getLightboxState().currentSlide.user_id;
      const image_id = ref.current.getLightboxState().currentSlide.image_id;
      window.electron.ipcRenderer.removeAllListenersResultDeleteUserImage();
      window.electron.ipcRenderer.onResultDeleteUserImage((event, value) => {
        if (value.status === "OK") {
          console.log(`deleted: user_id=${user_id} , image_id=${image_id}`);
        }
      });

      window.electron.ipcRenderer.invokeDeleteUserImage({
        user_id: user_id,
        image_id: image_id,
      });
    }
  };

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
        slides={props.images}
        controller={{ ref }}
      />
    </>
  );
}
