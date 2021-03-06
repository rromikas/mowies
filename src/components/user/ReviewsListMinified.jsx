import React, { useState } from "react";
import { connect } from "react-redux";
import Emoji from "./Emoji";
import history from "../../History";
import date from "date-and-time";
import { MdThumbUp, MdChatBubble } from "react-icons/md";

const ReviewsListMinified = ({ reviews, publicUsers, ratings }) => {
  const [reviewIdOfVisibleComments, setReviewIdOfVisibleComments] = useState(
    -1
  );

  const page = 1;

  const reviewsPerPage = 8;

  return reviews
    .slice(
      (page - 1) * reviewsPerPage,
      (page - 1) * reviewsPerPage + reviewsPerPage
    )
    .map((x, i) => (
      <div
        onClick={() => history.push(`/movie/${x.movie_id}`)}
        key={`review-${i}`}
        className="row no-gutters p-2 border-bottom rounded mb-2 text-dark movie-card-minified"
      >
        <div
          className="col-sm-auto col-20 pr-4 d-none d-sm-block"
          style={{ maxWidth: "100px" }}
        >
          <div className="row no-gutters mb-1">
            <img
              alt={ratings[x.movie_id].movie_poster}
              width="100%"
              style={{ borderRadius: "13px", cursor: "pointer" }}
              src={`https://image.tmdb.org/t/p/w154${
                ratings[x.movie_id].movie_poster
              }`}
            ></img>
          </div>
        </div>
        <div className="col d-flex flex-column">
          <div className="row no-gutters justify-content-between align-items-center mb-2 flex-grow-0">
            <div className="col-60 d-block d-sm-none mb-3">
              <div className="row no-gutters mb-1">
                <div className="col-auto pr-3">
                  <div
                    className="square-70 rounded bg-image"
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/w154${
                        ratings[x.movie_id].movie_poster
                      })`,
                    }}
                  ></div>
                </div>
                <div className="col">
                  <div className="row no-gutters h6 mb-0">
                    {ratings[x.movie_id].movie_title} (
                    {ratings[x.movie_id].movie_release_date.substring(0, 4)}
                  </div>
                  <div className="row no-gutters text-muted">
                    <div className="text-truncate">{x.movie_genres}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-60">
              <div className="row no-gutters justify-content-between">
                <div className="col-auto mb-2">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto pr-2">
                      <div
                        className="bg-image rounded-circle square-40"
                        style={{
                          backgroundImage: `url(${
                            publicUsers[x.author]
                              ? publicUsers[x.author].photo
                              : ""
                          })`,
                        }}
                      ></div>
                    </div>
                    <div className="col-auto">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-3 mb-0">
                          {publicUsers[x.author]
                            ? publicUsers[x.author].display_name
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="row no-gutters">
                    <span className="mr-2">Posted review on</span>
                    <span className="text-muted">
                      {date.format(new Date(x.date), "MMM DD, YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row no-gutters mb-3 font-size-14 flex-grow-0">
            {x.review}
          </div>
          <div className="row no-gutters flex-grow-1 align-items-bottom">
            <div className="col-60 d-flex flex-column justify-content-end">
              <div className="row no-gutters justify-content-between align-items-center">
                <div className="col-auto">
                  <div className="row no-gutters">
                    {x.rating ? (
                      <Emoji
                        emoji={
                          x.rating === "excellent_rate"
                            ? "fire"
                            : x.rating === "good_rate"
                            ? "heart"
                            : x.rating === "ok_rate"
                            ? "heavy-division-sign"
                            : "shit"
                        }
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="col-auto px-0">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto mr-2">{x.likes.length}</div>
                    <div className="col-auto mr-2 ">
                      <MdThumbUp
                        fontSize="24px"
                        className="text-green"
                      ></MdThumbUp>
                    </div>
                    <div className="col-auto mr-2">{x.comments.length}</div>
                    <div className="col-auto">
                      <MdChatBubble
                        onClick={() => {
                          setReviewIdOfVisibleComments(
                            reviewIdOfVisibleComments === x._id ? -1 : x._id
                          );
                        }}
                        fontSize="24px"
                        className="text-orange scale-transition cursor-pointer"
                      ></MdChatBubble>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(ReviewsListMinified);
