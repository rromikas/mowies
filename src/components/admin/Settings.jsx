import React, { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    popular_movies_api: "",
    movie_data_api: "",
    latest_movies_api: "",
    no_popular_reviews: 5,
    no_popular_movies: 5,
    no_allowed_reviews: 5,
    no_comment_characters: 400,
    no_title_characters: 80,
    bg_image_refresh_time: { days: 0, hours: 15, minutes: 0 },
  });
  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60">
        <div className="row no-gutters border-bottom py-3 mb-5">
          <div className="col-60 h3">Settings</div>
          <div className="col-60">Configuration settings for admin panel</div>
        </div>
        <div className="row no-gutters">
          <div className="col-xl-40 col-sm-60">
            <div className="row no-gutters">
              <div className="col-60 mb-4">
                <div className="row no-gutters mb-1">
                  Configure API for popular movies
                </div>
                <div className="row no-gutters">
                  <input
                    type="text"
                    placeholder="Enter API key"
                    value={settings.popular_movies_api}
                    onChange={(e) => {
                      e.persist();
                      setSettings((prev) =>
                        Object.assign({}, prev, {
                          popular_movies_api: e.target.value,
                        })
                      );
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
                      setSettings((prev) =>
                        Object.assign({}, prev, {
                          movie_data_api: e.target.value,
                        })
                      );
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
                      setSettings((prev) =>
                        Object.assign({}, prev, {
                          latest_movies_api: e.target.value,
                        })
                      );
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
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              no_popular_reviews: e.target.value,
                            })
                          );
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
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              no_popular_movies: e.target.value,
                            })
                          );
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
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              no_allowed_reviews: e.target.value,
                            })
                          );
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
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              no_comment_characters: e.target.value,
                            })
                          );
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
                      Number of characters allowed in title of discussion
                    </div>
                    <div className="row no-gutters">
                      <input
                        value={settings.no_title_characters}
                        onChange={(e) => {
                          e.persist();
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              no_title_characters: e.target.value,
                            })
                          );
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-40 col-60">
                <div className="row no-gutters mb-1">
                  Background image refresh time (days, hours, minutes)
                </div>
                <div className="row no-gutters">
                  <div className="col-20 pr-3">
                    <div className="row no-gutters">
                      <input
                        value={settings.bg_image_refresh_time.days}
                        onChange={(e) => {
                          e.persist();
                          let time = { ...settings.bg_image_refresh_time };
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              bg_image_refresh_time: Object.assign({}, time, {
                                days: e.target.value,
                              }),
                            })
                          );
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                  <div className="col-20 pr-3">
                    <div className="row no-gutters">
                      <input
                        value={settings.bg_image_refresh_time.hours}
                        onChange={(e) => {
                          e.persist();
                          let time = { ...settings.bg_image_refresh_time };
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              bg_image_refresh_time: Object.assign({}, time, {
                                hours: e.target.value,
                              }),
                            })
                          );
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                  <div className="col-20">
                    <div className="row no-gutters">
                      <input
                        value={settings.bg_image_refresh_time.minutes}
                        onChange={(e) => {
                          e.persist();
                          let time = { ...settings.bg_image_refresh_time };
                          setSettings((prev) =>
                            Object.assign({}, prev, {
                              bg_image_refresh_time: Object.assign({}, time, {
                                minutes: e.target.value,
                              }),
                            })
                          );
                        }}
                        min={0}
                        type="number"
                        className="px-3 input-light w-100"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60 mt-5">
                <div className="row no-gutters">
                  <div className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto">
                    Cancel
                  </div>
                  <div className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto">
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

export default Settings;
