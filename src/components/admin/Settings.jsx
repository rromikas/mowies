import React, { useState } from "react";
import {
  UpdateOrCreateSettings,
  ChangeBackgroundMovie,
  GetSettings,
} from "../../server/DatabaseApi";
import { connect } from "react-redux";
import store from "../../store/store";
import date from "date-and-time";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Loader from "../utility/Loader";

const socialIcons = [
  { icon: FaFacebookF, name: "Facebook" },
  { icon: FaInstagram, name: "Instagram" },
  { icon: FaLinkedinIn, name: "Linkedin" },
  { icon: FaTwitter, name: "Twitter" },
];

const Settings = ({ settings }) => {
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);

  const validations = [
    {
      valid:
        (/^http/.test(settings.FacebookLink) || settings.FacebookLink === "") &&
        (/^http/.test(settings.TwitterLink) || settings.TwitterLink === "") &&
        (/^http/.test(settings.LinkedinLink) || settings.LinkedinLink === "") &&
        (/^http/.test(settings.InstagramLink) || settings.InstagramLink === ""),

      error: "Social link must start with http:// or https://",
    },
  ];

  return (
    <div className={`row no-gutters admin-screen`}>
      <div className="col-60">
        <div className="row no-gutters border-bottom pb-3 mb-5">
          <div className="col-60 admin-screen-title">Settings</div>
          <div className="col-60">Configuration settings for admin panel</div>
        </div>
        <div className="row no-gutters">
          <div className="col-xl-40 col-sm-60">
            <div className="row no-gutters">
              <div className="col-60 mb-4">
                <div className="row no-gutters mb-1">
                  Configure API for popular movies (main for now)
                </div>
                <div className="row no-gutters">
                  <input
                    type="text"
                    placeholder="Enter API key"
                    value={settings.movies_api_key}
                    onChange={(e) => {
                      e.persist();
                      store.dispatch({
                        type: "UPDATE_SETTINGS",
                        settings: { movies_api_key: e.target.value },
                      });
                    }}
                    className="px-3 input-light w-100"
                  ></input>
                </div>
              </div>
              <div className="col-60 mb-4">
                <div className="row no-gutters mb-1">
                  Configure API for movie data
                </div>
                <div className="row no-gutters">
                  <input
                    value={settings.movie_data_api}
                    onChange={(e) => {
                      e.persist();
                      store.dispatch({
                        type: "UPDATE_SETTINGS",
                        settings: { movie_data_api: e.target.value },
                      });
                    }}
                    type="text"
                    placeholder="Enter API key"
                    className="px-3 input-light w-100"
                  ></input>
                </div>
              </div>
              <div className="col-60 mb-4">
                <div className="row no-gutters mb-1">
                  Configure API for latest movies
                </div>
                <div className="row no-gutters">
                  <input
                    type="text"
                    placeholder="Enter API key"
                    value={settings.latest_movies_api}
                    onChange={(e) => {
                      e.persist();
                      store.dispatch({
                        type: "UPDATE_SETTINGS",
                        settings: { latest_movies_api: e.target.value },
                      });
                    }}
                    className="px-3 input-light w-100"
                  ></input>
                </div>
              </div>
              <div className="col-60 mb-4">
                <div className="row no-gutters mb-1">Set Captcha API key</div>
                <div className="row no-gutters">
                  <input
                    type="text"
                    placeholder="Enter API key"
                    value={settings.captcha_api_key}
                    onChange={(e) => {
                      e.persist();
                      store.dispatch({
                        type: "UPDATE_SETTINGS",
                        settings: { captcha_api_key: e.target.value },
                      });
                    }}
                    className="px-3 input-light w-100"
                  ></input>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters">
                  <div className="col-lg-30 col-60 mb-4">
                    <div className="row no-gutters mb-1">
                      Number of popular reviews to show
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_popular_reviews}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { no_popular_reviews: e.target.value },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters">
                  <div className="col-lg-30 col-60 mb-4">
                    <div className="row no-gutters mb-1">
                      Number of popular movies to show
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_popular_movies}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { no_popular_movies: e.target.value },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters">
                  <div className="col-lg-30 col-60 mb-4">
                    <div className="row no-gutters mb-1">
                      Number of Reviews allowed per day per user
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_allowed_reviews}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { no_allowed_reviews: e.target.value },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters">
                  <div className="col-lg-30 col-60 mb-4">
                    <div className="row no-gutters mb-1">
                      Number of characters allowed in comments
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_comment_characters}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { no_comment_characters: e.target.value },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters">
                  <div className="col-lg-30 col-60 mb-4">
                    <div className="row no-gutters mb-1">
                      Number of characters allowed in display name
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_display_name_characters}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: {
                              no_display_name_characters: e.target.value,
                            },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters">
                  <div className="col-lg-30 col-60 mb-4">
                    <div className="row no-gutters mb-1">
                      Number of words allowed in review
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_review_words}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { no_review_words: e.target.value },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-40 col-60 mb-4">
                <div className="row no-gutters mb-1">
                  Background image refresh time (days, hours, minutes)
                </div>
                <div className="row no-gutters">
                  <div className="col-20 pr-3">
                    <div className="row no-gutters text-muted">days</div>
                    <div className="row no-gutters">
                      <input
                        value={settings.bg_image_refresh_time_days}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: {
                              bg_image_refresh_time_days: e.target.value,
                            },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                  <div className="col-20 pr-3">
                    <div className="row no-gutters text-muted">hours</div>
                    <div className="row no-gutters">
                      <input
                        value={settings.bg_image_refresh_time_hours}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: {
                              bg_image_refresh_time_hours: e.target.value,
                            },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                  <div className="col-20 ">
                    <div className="row no-gutters text-muted">minutes</div>
                    <div className="row no-gutters">
                      <input
                        value={settings.bg_image_refresh_time_minutes}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: {
                              bg_image_refresh_time_minutes: e.target.value,
                            },
                          });
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60 mb-4">
                <div className="row no-gutters mb-1">
                  Current background movie
                </div>
                <div className="row no-gutters mb-3">
                  <img
                    alt={settings.current_bg_movie.backdrop_path}
                    style={{ maxWidth: "500px" }}
                    width="100%"
                    src={`https://image.tmdb.org/t/p/w500${settings.current_bg_movie.backdrop_path}`}
                  ></img>
                </div>
                <div className="row no-gutters mb-1">Title</div>
                <div className="row no-gutters mb-3">
                  <input
                    disabled
                    className="input-light-disabled w-100 px-3"
                    value={settings.current_bg_movie.title}
                  ></input>
                </div>
                <div className="row no-gutters mb-3">
                  <div className="col-auto mr-4">
                    <div className="row no-gutters mb-1">Set Date</div>
                    <div className="row no-gutters">
                      <input
                        disabled
                        className="input-light-disabled px-3"
                        value={date.format(
                          new Date(settings.current_bg_movie.date_set),
                          "YYYY-MM-DD @ hh:mm A"
                        )}
                      ></input>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="row no-gutters mb-1">Refresh Date</div>
                    <div className="row no-gutters">
                      <input
                        disabled
                        className="input-light-disabled px-3"
                        value={date.format(
                          new Date(
                            settings.current_bg_movie.date_set +
                              settings.bg_image_refresh_time_minutes * 60000 +
                              settings.bg_image_refresh_time_hours * 3600000 +
                              settings.bg_image_refresh_time_days * 86400000
                          ),
                          "YYYY-MM-DD @ hh:mm A"
                        )}
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="row no-gutters">
                  <div
                    className="col-auto btn-custom btn-custom-primary btn-small"
                    onClick={async () => {
                      if (settings.movies_api_key) {
                        setLoading(true);
                        let res = await ChangeBackgroundMovie(
                          settings.movies_api_key
                        );
                        setLoading(false);
                        if (!res.error) {
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { current_bg_movie: res },
                          });
                        } else {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              title: "Action not allowed",
                              message: res.error,
                              type: "failure",
                            },
                          });
                        }
                      } else {
                        store.dispatch({
                          type: "SET_NOTIFICATION",
                          notification: {
                            title: "Action not allowed",
                            message:
                              "You need to set movies api key to change background movie",
                            type: "failure",
                          },
                        });
                      }
                    }}
                  >
                    {loading ? (
                      <Loader
                        color={"white"}
                        style={{
                          position: "absolute",
                          left: "10px",
                          top: 0,
                          bottom: 0,
                          margin: "auto",
                          display: "flex",
                          alignItems: "center",
                        }}
                        loading={loading}
                        size={20}
                      ></Loader>
                    ) : (
                      "Refresh"
                    )}
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters mb-1">Set social links</div>
                {socialIcons.map((x, i) => (
                  <div
                    className="row no-gutters mb-2"
                    key={`social-icons-settings-${i}`}
                  >
                    <div className="col-auto mr-2">
                      <div className="square-40 rounded-circle bg-white d-flex flex-center">
                        <x.icon fontSize="24px" className="text-dark"></x.icon>
                      </div>
                    </div>
                    <div className="col">
                      <input
                        spellCheck={false}
                        type="text"
                        placeholder={`Paste ${x.name} link`}
                        value={settings[`${x.name}Link`]}
                        onChange={(e) => {
                          e.persist();
                          store.dispatch({
                            type: "UPDATE_SETTINGS",
                            settings: { [`${x.name}Link`]: e.target.value },
                          });
                        }}
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                ))}
              </div>
              <div className="col-60 mt-3">
                <div
                  style={{ height: "30px", opacity: problem ? 1 : 0 }}
                  className="row no-gutters align-items-center text-danger"
                >
                  {problem}
                </div>
                <div className="row no-gutters">
                  <div className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto">
                    Cancel
                  </div>
                  <div
                    className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto"
                    onClick={async () => {
                      let invalid = validations.filter((x) => !x.valid);
                      if (invalid.length) {
                        setProblem(invalid[0].error);
                      } else {
                        setProblem("");
                        let res = await UpdateOrCreateSettings(settings);
                        if (res.error) {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              title: "Error",
                              message: "Settings were not updated",
                              type: "failure",
                            },
                          });
                        } else {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              title: "Settings updated!",
                              message: "Settings were successfully updated",
                              type: "success",
                            },
                          });
                          GetSettings((settings) => {
                            if (!settings.error) {
                              if (settings.length) {
                                store.dispatch({
                                  type: "UPDATE_SETTINGS",
                                  settings: settings[0],
                                });
                              }
                            }
                          });
                        }
                      }
                    }}
                  >
                    Save
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(Settings);
