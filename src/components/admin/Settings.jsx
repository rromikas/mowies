import React, { useState, useEffect, useRef } from "react";
import { UpdateOrCreateSettings } from "../../server/DatabaseApi";
import { connect } from "react-redux";
import store from "../../store/store";

const Settings = ({ settings }) => {
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
              <div className="col-xl-40 col-60">
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
                  <div className="col-20">
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
              <div className="col-60 mt-5">
                <div className="row no-gutters">
                  <div className="btn-custom btn-custom-secondary btn-small mr-sm-3 mb-3 col-60 col-sm-auto">
                    Cancel
                  </div>
                  <div
                    className="btn-custom btn-custom-primary btn-small mb-3 col-60 col-sm-auto"
                    onClick={async () => {
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
