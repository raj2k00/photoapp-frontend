import React, { useState, useEffect } from "react";
import Upload from "./components/Upload";
import useUserStore from "./store/userStore";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { truncateName } from "./utils";
import { toast } from "react-toastify";
import axios from "axios";
import "./Global.scss";
import { APP_URL } from "./constant";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserDetails } = useUserStore();
  const user = useUserStore((state) => state.userDetails);

  useEffect(() => {
    if (!cookies.jwt || Object.keys(user).length === 0) navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openUploadPopup = () => {
    setIsOpen(true);
  };

  const closeUploadPopup = () => {
    setIsOpen(false);
  };

  const handleSelectImages = (e) => {
    setSelectedImages((prevValue) => {
      if (prevValue.includes(e)) {
        return prevValue.filter((item) => item !== e);
      } else {
        return [...prevValue, e];
      }
    });
    console.log(selectedImages);
  };

  const handleDelete = () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.jwt}`,
      },
    };
    axios
      .patch(
        `${APP_URL}users/deletePhotos`,
        {
          photos: selectedImages,
        },
        config
      )
      .then(async (res) => {
        console.log(res);
        setLoading(false);
        toast("uploaded successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        axios
          .get(`${APP_URL}users/getUser`, config)
          .then((res) => {
            console.log(res);
            setUserDetails(res.data.data.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
        toast("error occurred! try again", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
      });
    setLoading(false);
  };

  return (
    <div className="home">
      <div className="home-header">
        <div className="home-header__title">
          <h1 className="home-header__title--heading">Media Library</h1>
          <p className="home-header__title--para">
            {user?.photos?.length} images
          </p>
        </div>
        <div className="btn-container">
          <div className="home-header__btn">
            <button className="home-header__btn--btn" onClick={openUploadPopup}>
              Upload new image
            </button>
            <img className="circle-icon" src="./circle.png" alt="circle" />
          </div>

          {selectedImages.length > 0 ? (
            <div className="home-header__btn">
              <button
                className="home-header__btn--delete_btn"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Selected"}
              </button>
              <img
                className="circle-icon"
                src="./delete_icon.png"
                alt="circle"
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="home-content">
        {user?.photos?.length > 0 ? (
          <div className="home-content__image">
            {user?.photos?.map((photo) => {
              return (
                <div key={photo} className="home-content__image-item">
                  <img
                    src={`https://pacific-lake-87005.herokuapp.com/images/${photo}`}
                    alt=""
                  />
                  <div className="home-content__image-item--description">
                    <div className="filename-style">{truncateName(photo)}</div>
                    <div className="filetype-style">{photo.split(".")[1]}</div>
                  </div>
                  <div
                    className={`image-selector ${
                      selectedImages.includes(photo) &&
                      "image-selector-selected"
                    } `}
                    onClick={() => handleSelectImages(photo)}
                  ></div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="home-content__bgImage">
            <img src="./background_image.png" alt="background" />
          </div>
        )}
      </div>
      {isOpen ? <Upload close={closeUploadPopup} /> : <></>}
    </div>
  );
};

export default Home;
