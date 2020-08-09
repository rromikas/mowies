import React from "react";
import { connect } from "react-redux";
import history from "../../History";
import { useLocation } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = ({ user, settings }) => {
  const menuItems = [
    { name: "Home", path: "/" },
    {
      name: "My Wishlist",
      path: user._id ? `/profile/${user._id}/0` : "/login",
    },
    {
      name: "My Reviews",
      path: user._id ? `/profile/${user._id}/2` : "/login",
    },
    { name: "About Us", path: "/" },
    { name: "Contact", path: "/" },
  ];

  const socialIcons = [
    { icon: FaFacebookF, path: settings.FacebookLink },
    { icon: FaInstagram, path: settings.InstagramLink },
    { icon: FaLinkedinIn, path: settings.LinkedinLink },
    { icon: FaTwitter, path: settings.TwitterLink },
  ];

  const secodaryItems = [
    { name: "Privacy policy", path: "/privacy-policy" },
    { name: "Cookies Policy", path: "/cookies-policy" },
    { name: "Terms And Conditions", path: "/terms-and-conditions" },
  ];

  const location = useLocation();

  return location.pathname !== "/login" && location.pathname !== "/signup" ? (
    <div className="row no-gutters justify-content-center bg-over-root-lighter text-white">
      <div
        className={`p-sm-5 p-4 col-60${
          location.pathname !== "/admin" ? " content-container" : ""
        }`}
      >
        <div className="row no-gutters justify-content-between align-items-center">
          <div className="col-auto mb-4">
            <div className="row no-gutters">
              {menuItems.map((x, i) => (
                <div
                  key={`footer-item-${i}`}
                  className="col-auto text-title-md btn-tertiary"
                  onClick={() => history.push(x.path)}
                >
                  {x.name}
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-auto col-60 px-3 mb-4">
            <div className="row no-gutters justify-content-center justify-content-md-start">
              {socialIcons.map((x, i) => (
                <div
                  key={`social-icon-${i}`}
                  className={`col-auto scale-transition cursor-pointer mr-${
                    i === socialIcons.length - 1 ? "0" : "2"
                  }`}
                >
                  <div
                    className="square-40 rounded-circle bg-white d-flex flex-center"
                    onClick={() => {
                      window.open(x.path);
                    }}
                  >
                    <x.icon fontSize="24px" className="text-dark"></x.icon>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row no-gutters justify-content-md-between justify-content-center">
          <div className="col-auto px-3">©2020 CozyPotato, Inc.</div>
          <div className="col-auto px-3">
            <div className="row no-gutters">
              {secodaryItems.map((x, i) => (
                <React.Fragment key={`footer-item-${i}`}>
                  <div
                    className="col-auto link-primary d-sm-block d-none"
                    onClick={() => history.push(x.path)}
                  >
                    {x.name}
                  </div>
                  <div
                    className="col-auto link-primary d-block d-sm-none"
                    onClick={() => history.push(x.path)}
                  >
                    {x.name.split(" ")[0]}
                  </div>
                  {i !== secodaryItems.length - 1 && (
                    <div className="px-2">|</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(Footer);
