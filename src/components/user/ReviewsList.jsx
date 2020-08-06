import React, { useState, useEffect } from "react";
import { Collapse } from "@material-ui/core";
import { connect } from "react-redux";
import { GetReviewComments, GetPopularReviews } from "../../server/DatabaseApi";
import { Emoji } from "emoji-mart";
import Paigination from "../utility/Paigination";
import history from "../../History";
import date from "date-and-time";
import { MdThumbUp, MdChatBubble } from "react-icons/md";

const ReviewsList = ({ reviews, publicUsers, ratings }) => {
  const [reviewIdOfVisibleComments, setReviewIdOfVisibleComments] = useState(
    -1
  );
  // partitioning reviews into pages (8 reviews per page)
  const [page, setPage] = useState(-1);
  const [commentsPage, setCommentsPage] = useState(1);

  const [refreshComments, setRefreshComments] = useState(false);
  const [comments, setComments] = useState({});

  const commentsPerPage = 5;
  const reviewsPerPage = 8;

  useEffect(() => {
    async function getData() {
      if (reviewIdOfVisibleComments !== -1) {
        let data = await GetReviewComments(reviewIdOfVisibleComments);
        setComments((prev) =>
          Object.assign({}, prev, { [reviewIdOfVisibleComments]: data })
        );
      }
    }
    getData();
  }, [reviewIdOfVisibleComments, refreshComments]);

  let realPage = page === -1 ? 1 : page;

  return reviews
    .slice(
      (realPage - 1) * reviewsPerPage,
      (realPage - 1) * reviewsPerPage + reviewsPerPage
    )
    .map((x, i) => (
      <React.Fragment key={`fragment-review-${i}`}>
        <div
          key={`review-${i}`}
          className="row no-gutters p-4 bg-over-root-lighter rounded mb-2"
        >
          <div
            className="col-sm-auto col-20 pr-4 d-none d-sm-block"
            style={{ maxWidth: "150px" }}
          >
            <div className="row no-gutters mb-1">
              <img
                onClick={() => history.push(`/movie/${x.movie_id}`)}
                width="100%"
                style={{ borderRadius: "13px", cursor: "pointer" }}
                src={`https://image.tmdb.org/t/p/w154${x.movie_poster}`}
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
                        backgroundImage: `url(https://image.tmdb.org/t/p/w154${x.movie_poster})`,
                      }}
                    ></div>
                    {/* <img
                    onClick={() => history.push(`/movie/${x.id}`)}
                    width="100%"
                    style={{ borderRadius: "13px" }}
                    src={`https://image.tmdb.org/t/p/w154${x.movie_poster}`}
                  ></img> */}
                  </div>
                  <div className="col">
                    <div className="row no-gutters text-white h6 mb-0">
                      {x.movie_title} ({x.movie_release_date.substring(0, 4)})
                    </div>
                    <div className="row no-gutters text-muted">
                      <div className="text-truncate">{x.movie_genres}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-60">
                <div className="row no-gutters justify-content-between">
                  <div className="col-auto">
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
                        <div className="row no-gutters align-items-center text-white">
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
                    <div className="row no-gutters text-white">
                      <span className="mr-2">Posted review on</span>
                      <span className="text-muted">
                        {date.format(new Date(x.date), "MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters text-light mb-3 font-size-14 flex-grow-0 font-weight-300">
              {x.review}
            </div>

            <div className="row no-gutters flex-grow-1 align-items-bottom">
              <div className="col-60 d-flex flex-column justify-content-end">
                <div className="row no-gutters justify-content-between align-items-center text-white">
                  <div className="col-auto">
                    <div className="row no-gutters">
                      {x.rating ? (
                        <div style={{ marginBottom: "-6px" }}>
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
                            set="facebook"
                            size={24}
                          />
                        </div>
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
        <Collapse in={reviewIdOfVisibleComments === x._id} className="mb-3">
          <div className="ml-4 h5 py-2 text-white">
            Comments ({comments[x._id] ? comments[x._id].length : 0})
          </div>
          {comments[x._id]
            ? comments[x._id]
                .slice(
                  commentsPage * (commentsPage - 1),
                  commentsPage * (commentsPage - 1) + commentsPerPage
                )
                .map((y, ind) => (
                  <div
                    key={`comment-${reviewIdOfVisibleComments}-${ind}`}
                    className="row no-gutters p-4 bg-over-root-lighter rounded ml-4 mb-2"
                  >
                    <div className="col-auto pr-4 d-none d-md-block">
                      <div
                        className="bg-image rounded-circle square-70"
                        style={{
                          backgroundImage: `url(${
                            publicUsers[y.author]
                              ? publicUsers[y.author].photo
                              : ""
                          })`,
                        }}
                      ></div>
                    </div>
                    <div className="col">
                      <div className="row no-gutters align-items-center mb-2">
                        <div className="col-auto pr-2 d-block d-md-none">
                          <div
                            className="bg-image rounded-circle square-40"
                            style={{
                              backgroundImage: `url(${
                                publicUsers[y.author]
                                  ? publicUsers[y.author].photo
                                  : ""
                              })`,
                            }}
                          ></div>
                        </div>
                        <div className="col-auto">
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto mr-3 h6 text-white mb-0">
                              {publicUsers[y.author]
                                ? publicUsers[y.author].display_name
                                : ""}
                            </div>
                            <div className="col-auto mr-3 text-muted">
                              {date.format(new Date(y.date), "MMM DD, YYYY")}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row no-gutters text-light mb-3">
                        {y.comment}
                      </div>
                      <div className="row no-gutters justify-content-between align-items-center">
                        <div className="col-auto">
                          <div className="row no-gutters align-items-center">
                            <div className="col-auto mr-2">
                              {y.likes.length}
                            </div>
                            <div className="col-auto mr-2 ">
                              <MdThumbUp
                                fontSize="24px"
                                className="text-green cursor-pointer"
                              ></MdThumbUp>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            : ""}
          <div className="row no-gutters mt-2">
            <div className="col-auto ml-4">
              <Paigination
                count={Math.ceil(
                  comments[x._id] ? comments[x._id].length / commentsPerPage : 1
                )}
                current={commentsPage}
                setCurrent={setCommentsPage}
                classNames={{
                  notSelected: "input-dark",
                  selected: "input-dark-selected",
                }}
              ></Paigination>
            </div>
          </div>
        </Collapse>
      </React.Fragment>
    ));
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(ReviewsList);
