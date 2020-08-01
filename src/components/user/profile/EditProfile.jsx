import React, { useState, useEffect, useRef } from "react";
import Modal from "../../utility/Modal";
import imageCompression from "browser-image-compression";
import { EditUser } from "../../../server/DatabaseApi";
import store from "../../../store/store";

const EditProfile = ({ user, refreshProfile, editProfileOpen, onClose }) => {
  const [update, setUpdate] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    photo: "",
    password: "",
    confirm_assword: "",
    _id: "",
    token: "",
  });

  const [problem, setProblem] = useState("");

  const photoUploader = useRef(null);

  useEffect(() => {
    if (user.photo) {
      setUpdate((prev) =>
        Object.assign({}, prev, {
          first_name: user.first_name,
          last_name: user.last_name,
          display_name: user.display_name,
          photo: user.photo,
          token: user.token,
        })
      );
    }
  }, [user.first_name]);

  const handleFileUpload = async (e) => {
    var imageFile = e.target.files[0];
    var options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 100,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      const dataUrl = await imageCompression.getDataUrlFromFile(compressedFile);
      setUpdate((prev) => Object.assign({}, prev, { photo: dataUrl }));
    } catch (error) {}
  };

  const validations = [
    {
      valid: /[^\w\s]/.test(update.password) || /\d/.test(update.password),
      error: "Password must contain number or symbol",
    },
    {
      valid: update.password === update.confirm_assword,
      error: "Passwords dont't match",
    },
    {
      valid: update.password.length >= 6,
      error: "Password must contain at least 6 characters",
    },
  ];

  return (
    <Modal open={editProfileOpen} onClose={onClose}>
      <div className="col-xl-30 col-lg-40 col-md-50 col-58 bg-over-root rounded p-sm-5 p-4">
        <div className="row no-gutters mb-3 text-title-lg">
          Edit or update profile
        </div>
        <div className="row no-gutters justify-content-center mb-5">
          <div className="col-auto text-center">
            <div className="row no-gutters justify-content-center">
              <div
                className="square-100 bg-image rounded-circle d-flex align-items-end overflow-hidden mb-2"
                style={{ backgroundImage: `url(${update.photo})` }}
              >
                <input
                  spellCheck={false}
                  onChange={handleFileUpload}
                  type="file"
                  className="d-none"
                  ref={photoUploader}
                ></input>
              </div>
            </div>

            <div
              className="btn-custom btn-custom-primary px-4"
              onClick={() => photoUploader.current.click()}
            >
              Upload photo
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-3">
          <div className="col-30 pr-2">
            <div className="row no-gutters text-light">First Name</div>
            <div className="row no-gutters">
              <input
                spellCheck={false}
                type="text"
                className="input-light px-3 w-100"
                value={update.first_name}
                onChange={(e) => {
                  e.persist();
                  setUpdate((prev) =>
                    Object.assign({}, prev, { first_name: e.target.value })
                  );
                }}
              ></input>
            </div>
          </div>
          <div className="col-30">
            <div className="row no-gutters text-light">Last Name</div>
            <div className="row no-gutters">
              <input
                spellCheck={false}
                type="text"
                className="input-light px-3 w-100"
                value={update.last_name}
                onChange={(e) => {
                  e.persist();
                  setUpdate((prev) =>
                    Object.assign({}, prev, { last_name: e.target.value })
                  );
                }}
              ></input>
            </div>
          </div>
        </div>
        <div className="row no-gutters mb-3">
          <div className="col-60 text-light">Display Name</div>
          <div className="col-60">
            <input
              spellCheck={false}
              type="text"
              className="input-light px-3 w-100"
              value={update.display_name}
              onChange={(e) => {
                e.persist();
                setUpdate((prev) =>
                  Object.assign({}, prev, { display_name: e.target.value })
                );
              }}
            ></input>
          </div>
        </div>
        <div className="row no-gutters mb-3">
          <div className="col-60 text-light">Password</div>
          <div className="col-60">
            <input
              spellCheck={false}
              type="text"
              className="input-light px-3 w-100"
              value={update.password}
              onChange={(e) => {
                e.persist();
                setUpdate((prev) =>
                  Object.assign({}, prev, { password: e.target.value })
                );
              }}
            ></input>
          </div>
        </div>
        <div className="row no-gutters mb-3">
          <div className="col-60 text-light">Confirm Password</div>
          <div className="col-60">
            <input
              spellCheck={false}
              type="text"
              className="input-light px-3 w-100"
              value={update.confirm_assword}
              onChange={(e) => {
                e.persist();
                setUpdate((prev) =>
                  Object.assign({}, prev, { confirm_assword: e.target.value })
                );
              }}
            ></input>
          </div>
        </div>
        <div
          className="row no-gutters align-items-center text-danger justify-content-end"
          style={{ height: "50px", opacity: problem ? 1 : 0 }}
        >
          {problem}
        </div>
        <div className="row no-gutters">
          <div
            className="col-sm-auto btn-custom btn-custom-secondary btn-small mr-sm-2 mb-2 col-60"
            onClick={onClose}
          >
            Cancel
          </div>
          <div
            className="col-sm-auto col-60 btn-custom btn-custom-primary btn-small"
            onClick={async () => {
              let notValid = validations.filter((x) => !x.valid);
              if (notValid.length && update.password) {
                setProblem(notValid[0].error);
              } else {
                let finalUpdate = {};
                Object.keys(update).forEach((x) => {
                  if (update[x]) {
                    finalUpdate[x] = update[x];
                  }
                });
                let res = await EditUser(finalUpdate);
                if (!res.error) {
                  store.dispatch({
                    type: "SET_NOTIFICATION",
                    notification: {
                      title: "Profile updates",
                      message: "You successfully updated your profile",
                      type: "success",
                    },
                  });
                  store.dispatch({
                    type: "UPDATE_PUBLICUSERS",
                    publiUser: res.updatedPublicUser,
                  });

                  store.dispatch({
                    type: "UPDATE_USER",
                    userProperty: res.updatedUser,
                  });

                  refreshProfile();
                  onClose();
                  localStorage["movies_user_token"] = res.newToken;
                } else {
                  store.dispatch({
                    type: "SET_NOTIFICATION",
                    notification: {
                      title: "Error",
                      message: res.error,
                      type: "failure",
                    },
                  });
                }
              }
            }}
          >
            Save
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfile;
