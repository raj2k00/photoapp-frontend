/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./Upload.scss";
import ImageUploading from "react-images-uploading";
import { truncateName, bytesToMb } from "../utils";
import axios from "axios";
import { APP_URL } from "../constant";
import { useCookies } from "react-cookie";
import useUserStore from "../store/userStore";
import { toast } from "react-toastify";

const Upload = ({ close }) => {
  const [images, setImages] = useState([]);
  const [cookies, setCookie] = useCookies(["jwt"]);
  const { setUserDetails } = useUserStore();
  const [isUploading, setIsUploading] = useState(false);
  const [percent, setPercent] = useState(0);
  const maxNumber = 20;
  const controller = new AbortController();

  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const handleSubmit = (e) => {
    setIsUploading(true);
    console.log(e.target);
    const config = {
      headers: {
        Authorization: `Bearer ${cookies.jwt}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      onUploadProgress: (data) => {
        setPercent(
          Math.max(
            0,
            Math.round((100 * data.loaded) / data.total) -
              Math.max(1, Math.round(Math.random() * 10))
          )
        );
      },
    };

    const imageData = images.map((data) => {
      return { url: data.data_url, name: data.file.name };
    });

    axios
      .post(
        `${APP_URL}users/uploadbase64`,
        {
          images: imageData,
        },
        config,
        {
          signal: controller.signal,
        }
      )
      .then((res) => {
        console.log(res);
        setIsUploading(false);
        setPercent(100);
        close();
        setUserDetails(res.data.data.data);
      })
      .catch((e) => {
        setIsUploading(false);
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
        console.log(e);
      });
  };

  return (
    <div className="upload">
      <div className="upload-container">
        <div className="upload-container__text">
          <p>Upload new images</p>
          <button onClick={() => close()}>
            <img src="./close.png" alt="close" />
          </button>
        </div>
        <div className="upload-container__line"></div>

        <div className="drop-container">
          <div className="drop-field">
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
            >
              {({ imageList, onImageUpload, onImageRemove, dragProps }) => (
                <>
                  {imageList.length > 0 ? (
                    <div>
                      <div className="image__wrapper">
                        <div className="image__container">
                          {imageList.map((image, index) => (
                            <div key={index} className="image-item">
                              <div className="image-item_container">
                                <img
                                  src={image["data_url"]}
                                  alt=""
                                  className="image_content"
                                  width={86}
                                  height={91}
                                />

                                <div className="image-item-description">
                                  <div>{truncateName(image?.file?.name)}</div>
                                  <div>{bytesToMb(image?.file?.size)} Mb</div>
                                </div>
                              </div>

                              <div
                                onClick={() => onImageRemove(index)}
                                className="image_removebtn"
                              >
                                <img src="./remove_image.png" alt="" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {isUploading ? (
                        <>
                          <div className="upload-progress ">
                            <div
                              class="upload-progress--bar"
                              style={{
                                width: `${percent}%`,
                              }}
                            ></div>
                          </div>
                          <div className="upload-box-container">
                            <button
                              onClick={() => {
                                controller.abort();
                              }}
                              className="remove-btn-style"
                            >
                              <div className="upload-box__btn--cancel">
                                Cancel
                              </div>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="upload-container__line "></div>
                          <div className="upload-box-container">
                            <button
                              onClick={onImageUpload}
                              className="remove-btn-style"
                            >
                              <div className="upload-box__btn  p-1">
                                Add more
                              </div>
                            </button>
                            <button
                              onClick={handleSubmit}
                              className="remove-btn-style"
                            >
                              <div className="upload-box__btn--submit">
                                Upload
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="drop-innerarea">
                      <button
                        onClick={onImageUpload}
                        {...dragProps}
                        className="upload-box"
                      >
                        <div className="upload-box__title">
                          Drop files here or
                        </div>
                        <div className="upload-box__btn">Browse</div>
                      </button>
                    </div>
                  )}
                </>
              )}
            </ImageUploading>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
