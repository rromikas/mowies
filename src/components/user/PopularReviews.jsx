import React, { useEffect, useState, useRef } from "react";
import date from "date-and-time";
import { Emoji } from "emoji-mart";
import { MdThumbUp, MdChatBubble, MdFlag } from "react-icons/md";
import {
  GetReviewComments,
  GetPopularReviews,
  GetPromotedReviews,
  LikeReview,
  LikeComment,
  ReportComment,
} from "../../server/DatabaseApi";
import { connect } from "react-redux";
import { Collapse } from "@material-ui/core";
import Paigination from "../utility/Paigination";
import history from "../../History";
import ReplyToReview from "./ReplyToReview";
import store from "../../store/store";
import Loader from "../utility/Loader";
import Popover from "../utility/Popover";

const PopularReviews = ({ publicUsers, settings, user, ratings }) => {
  //comments object.Its property will be review id.
  const [comments, setComments] = useState({});

  const [reviews, setReviews] = useState([]);
  const [promotedReviews, setPromotedReviews] = useState([]);

  const [reviewIdOfVisibleComments, setReviewIdOfVisibleComments] = useState(
    -1
  );

  const [loadingComment, setLoadingComment] = useState(-1);
  const [loadingReview, setLoadingReview] = useState(-1);
  const [loadingReport, setLoadingReport] = useState(-1);

  // partitioning reviews into pages (8 reviews per page)
  const [page, setPage] = useState(-1);
  const [commentsPage, setCommentsPage] = useState(1);

  // reference to top of the reviews block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

  // boolean variable to display "add review" modal or not
  const [addReviewOpen, setAddReviewOpen] = useState(false);

  const [review, setReview] = useState({
    movie_title: "",
    movie_id: "",
    movie_genres: "",
    movie_release_date: "",
    movie_poster: "",
  });

  const [addReplyOpen, setAddReplyOpen] = useState(false);

  //state to refresh comments after writing it
  const [refreshComments, setRefreshComments] = useState(false);

  //state to refresh reviews after writing it
  const [refreshReviews, setRefreshReviews] = useState(false);

  const commentsPerPage = 5;
  const reviewsPerPage = 8;

  const [promotedContents, setPromotedContents] = useState({});

  useEffect(() => {
    async function getData() {
      if (reviewIdOfVisibleComments !== -1) {
        let data = await GetReviewComments(reviewIdOfVisibleComments);

        let commentsObj = {};
        data.forEach((x) => {
          commentsObj[x._id] = x;
        });
        setComments((prev) =>
          Object.assign({}, prev, { [reviewIdOfVisibleComments]: commentsObj })
        );
      }
    }
    getData();
  }, [reviewIdOfVisibleComments, refreshComments]);

  useEffect(() => {
    async function getData() {
      if (settings.no_popular_reviews) {
        let promoted = await GetPromotedReviews();
        let promotedContentIds = [];
        let promoContents = {};
        if (!promoted.error) {
          promoted.forEach((x) => {
            promotedContentIds.push(x.content_id);
            promoContents[x.content_id] = x;
          });
        }
        setPromotedContents(promoContents);

        let data = await GetPopularReviews(settings.no_popular_reviews);
        if (!data.error) {
          let promReviews = [],
            notPromotedReviews = [];
          data.forEach((x) => {
            if (promotedContentIds.includes(x._id)) {
              x.promoted = true;
              promReviews.push(x);
            } else {
              notPromotedReviews.push(x);
            }
          });
          setPromotedReviews(promReviews);
          setReviews(notPromotedReviews);
        }
      }
    }
    getData();
  }, [settings, refreshReviews]);

  useEffect(() => {
    //to avoid scroll on first render
    if (page >= 0) {
      //100 ms for reviews to be rendered. It increases successful scrolls to top.
      async function scrollAfterDelayToTopReview() {
        await new Promise((resolve) => setTimeout(resolve, 100));
        topOfReviewsBlock.current.scrollIntoView({
          behavior: "smooth",
        });
      }
      scrollAfterDelayToTopReview();
    }
  }, [page]);

  const renderComments = (ids, review) => {
    return ids.map((x, ind) => {
      return comments[review._id][x] ? (
        <React.Fragment>
          <div
            style={{
              marginLeft: `${
                comments[review._id][x].notificationReceivers.length * 60 - 30
              }px`,
            }}
            key={`comment-${reviewIdOfVisibleComments}-${ind}`}
            className={`row no-gutters p-4 bg-over-root-lighter rounded mb-2 indented-comment`}
          >
            <div className="col-auto pr-4 d-none d-md-block">
              <div
                className="bg-image rounded-circle square-70"
                style={{
                  backgroundImage: `url(${
                    publicUsers[comments[review._id][x].author]
                      ? publicUsers[comments[review._id][x].author].photo
                      : ""
                  })`,
                }}
              ></div>
            </div>
            <div className="col">
              <div className="row no-gutters justify-content-between align-items-center mb-2">
                <div className="col-auto">
                  <div className="row no-gutters">
                    <div className="col-auto pr-2 d-block d-md-none">
                      <div
                        className="bg-image rounded-circle square-40"
                        style={{
                          backgroundImage: `url(${
                            publicUsers[comments[review._id][x].author]
                              ? publicUsers[comments[review._id][x].author]
                                  .photo
                              : ""
                          })`,
                        }}
                      ></div>
                    </div>
                    <div className="col-auto mr-3 text-title-md mb-0">
                      {publicUsers[comments[review._id][x].author]
                        ? publicUsers[comments[review._id][x].author]
                            .display_name
                        : ""}
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-2">Commented on</div>
                        <div className="col-auto mr-3 text-muted">
                          {date.format(
                            new Date(comments[review._id][x].date),
                            "MMM DD, YYYY"
                          )}
                        </div>
                      </div>
                    </div>
                    <Popover
                      arrow={false}
                      position="top"
                      trigger="mouseenter"
                      theme="dark"
                      content={(w) => (
                        <div className="py-2 px-3 rounded bg-over-root">
                          Report Abuse
                        </div>
                      )}
                    >
                      <div
                        className="col-auto text-muted btn-tertiary-small d-flex flex-center"
                        onClick={async () => {
                          if (user.token) {
                            setLoadingReport(x);
                            let res = await ReportComment(user, x);
                            setLoadingReport(-1);
                            if (res.error) {
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  title: "Error",
                                  message: res.error,
                                  type: "failure",
                                },
                              });
                            } else {
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  title: "Comment reported",
                                  message:
                                    "Comment was successfully reported. We will review it soon.",
                                  type: "success",
                                },
                              });
                            }
                          } else {
                            store.dispatch({
                              type: "SET_NOTIFICATION",
                              notification: {
                                title: "Login required",
                                message: "You need to login to report comment",
                                type: "failure",
                              },
                            });
                          }
                        }}
                      >
                        {loadingReport === x ? (
                          <div className="square-20">
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
                              loading={true}
                              size={20}
                            ></Loader>
                          </div>
                        ) : (
                          <MdFlag fontSize="24px"></MdFlag>
                        )}
                      </div>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="row no-gutters text-light mb-3 font-weight-300 text-break">
                {comments[review._id][x].comment}
              </div>
              <div className="row no-gutters justify-content-end align-items-center">
                <div className="col-auto">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto mr-2">
                      {comments[review._id][x].likes.length}
                    </div>
                    <div className="col-auto mr-2 ">
                      {loadingComment === ind ? (
                        <div className="square-20">
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
                            loading={loadingComment === ind}
                            size={20}
                          ></Loader>
                        </div>
                      ) : (
                        <MdThumbUp
                          onClick={async () => {
                            if (user.token) {
                              if (user._id !== comments[review._id][x].author) {
                                setLoadingComment(ind);
                                let res = await LikeComment(user, x);
                                setLoadingComment(-1);
                                if (res.error) {
                                  store.dispatch({
                                    type: "SET_NOTIFICATION",
                                    notification: {
                                      title: "Error",
                                      message: res.error,
                                      type: "failure",
                                    },
                                  });
                                } else {
                                  setRefreshComments(!refreshComments);
                                }
                              } else {
                                store.dispatch({
                                  type: "SET_NOTIFICATION",
                                  notification: {
                                    title: "Action not allowed",
                                    message:
                                      "You can not like your own comment",
                                    type: "failure",
                                  },
                                });
                              }
                            } else {
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  title: "Login required",
                                  message: "You need to login to like review",
                                  type: "failure",
                                },
                              });
                            }
                          }}
                          fontSize="24px"
                          className="text-green scale-transition cursor-pointer"
                        ></MdThumbUp>
                      )}
                    </div>
                    <div
                      className="col-auto text-orange btn-tertiary"
                      onClick={() => {
                        if (!user.token) {
                          store.dispatch({
                            type: "SET_NOTIFICATION",
                            notification: {
                              title: "Login required",
                              message: "You need to login to write review.",
                              type: "failure",
                            },
                          });
                        } else {
                          setReview(
                            Object.assign({}, review, {
                              comment_id: x,
                              notificationReceivers: comments[review._id][
                                x
                              ].notificationReceivers.concat([
                                publicUsers[comments[review._id][x].author],
                              ]),
                            })
                          );
                          setAddReplyOpen(true);
                        }
                      }}
                    >
                      Reply
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {renderComments(comments[review._id][x].comments, review)}
        </React.Fragment>
      ) : (
        ""
      );
    });
  };

  //to avoid scroll into view on first render
  let realPage = page === -1 ? 1 : page;

  return (
    <div className="row no-gutters justify-content-center text-white">
      <div className="col-60 content-container py-3 px-md-5 px-4">
        <div className="row no-gutters h5">
          <div
            className="col-auto"
            style={{
              padding: "6px 30px 6px 0px",
              background: "linear-gradient(to left, #ff0037, transparent)",
              borderRadius: "0 4px 4px 0",
            }}
          >
            Popular Reviews
          </div>
        </div>
        <div className="row no-gutters text-light mb-3">
          Most commented reviews in last 30 days
        </div>
        <div className="row no-gutters mb-2" ref={topOfReviewsBlock}></div>
        {promotedReviews
          .concat(reviews)
          .slice(
            (realPage - 1) * reviewsPerPage,
            (realPage - 1) * reviewsPerPage + reviewsPerPage
          )
          .map((x, i) => {
            let rating = promotedContents[x._id]
              ? promotedContents[x._id].content.rating
              : x.rating;
            let review = promotedContents[x._id]
              ? promotedContents[x._id].content.review
              : x.review;
            return (
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
                        src={`https://image.tmdb.org/t/p/w154${
                          ratings[x.movie_id]
                            ? ratings[x.movie_id].movie_poster
                            : "https://critics.io/img/movies/poster-placeholder.png"
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
                                  ratings[x.movie_id]
                                    ? ratings[x.movie_id].movie_poster
                                    : "https://critics.io/img/movies/poster-placeholder.png"
                                })`,
                              }}
                            ></div>
                          </div>
                          <div className="col">
                            <div className="row no-gutters text-white mb-0">
                              {ratings[x.movie_id]
                                ? ratings[x.movie_id].movie_title
                                : ""}{" "}
                              (
                              {ratings[x.movie_id]
                                ? ratings[
                                    x.movie_id
                                  ].movie_release_date.substring(0, 4)
                                : ""}
                              )
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
                              <span className="mr-2">Posted on</span>
                              <span className="text-muted">
                                {date.format(new Date(x.date), "MMM DD, YYYY")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row no-gutters text-light mb-3 font-size-14 flex-grow-0 font-weight-300 text-break">
                      {review}
                    </div>

                    <div className="row no-gutters flex-grow-1 align-items-bottom">
                      <div className="col-60 d-flex flex-column justify-content-end">
                        <div className="row no-gutters justify-content-between align-items-center text-white">
                          <div className="col-auto">
                            <div className="row no-gutters">
                              <div style={{ marginBottom: "-6px" }}>
                                <Emoji
                                  emoji={
                                    rating === "excellent_rate"
                                      ? "fire"
                                      : rating === "good_rate"
                                      ? "heart"
                                      : rating === "ok_rate"
                                      ? "heavy-division-sign"
                                      : "shit"
                                  }
                                  set="facebook"
                                  size={24}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-auto px-0">
                            <div className="row no-gutters align-items-center">
                              <div className="col-auto mr-2">
                                {x.likes.length}
                              </div>
                              <div className="col-auto mr-2 ">
                                {loadingReview === i ? (
                                  <div className="square-20">
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
                                      loading={loadingReview === i}
                                      size={20}
                                    ></Loader>
                                  </div>
                                ) : (
                                  <MdThumbUp
                                    onClick={async () => {
                                      if (user.token) {
                                        if (user._id !== x.author) {
                                          setLoadingReview(i);
                                          let res = await LikeReview(
                                            user,
                                            x._id
                                          );
                                          setLoadingReview(-1);
                                          if (res.error) {
                                            store.dispatch({
                                              type: "SET_NOTIFICATION",
                                              notification: {
                                                title: "Error",
                                                message: res.error,
                                                type: "failure",
                                              },
                                            });
                                          } else {
                                            setRefreshReviews(!refreshReviews);
                                          }
                                        } else {
                                          store.dispatch({
                                            type: "SET_NOTIFICATION",
                                            notification: {
                                              title: "Action not allowed",
                                              message:
                                                "You can not like your own review",
                                              type: "failure",
                                            },
                                          });
                                        }
                                      } else {
                                        store.dispatch({
                                          type: "SET_NOTIFICATION",
                                          notification: {
                                            title: "Login required",
                                            message:
                                              "You need to login to like review",
                                            type: "failure",
                                          },
                                        });
                                      }
                                    }}
                                    fontSize="24px"
                                    className="text-green scale-transition cursor-pointer"
                                  ></MdThumbUp>
                                )}
                              </div>
                              <div className="col-auto mr-2">
                                {x.comments.length}
                              </div>
                              <div className="col-auto mr-2">
                                <MdChatBubble
                                  onClick={() => {
                                    setReviewIdOfVisibleComments(
                                      reviewIdOfVisibleComments === x._id
                                        ? -1
                                        : x._id
                                    );
                                  }}
                                  fontSize="24px"
                                  className="text-orange scale-transition cursor-pointer"
                                ></MdChatBubble>
                              </div>
                              <div
                                className="col-auto text-orange btn-tertiary"
                                onClick={() => {
                                  if (!user.token) {
                                    store.dispatch({
                                      type: "SET_NOTIFICATION",
                                      notification: {
                                        title: "Login required",
                                        message:
                                          "You need to login to write review.",
                                        type: "failure",
                                      },
                                    });
                                  } else {
                                    setReview(
                                      Object.assign({}, x, {
                                        notificationReceivers: [
                                          publicUsers[x.author],
                                        ],
                                      })
                                    );
                                    setAddReplyOpen(true);
                                  }
                                }}
                              >
                                Reply
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Collapse
                  in={reviewIdOfVisibleComments === x._id}
                  className="mb-3"
                >
                  <div
                    className="h5 py-2 text-white"
                    style={{ marginLeft: "30px" }}
                  >
                    Comments (
                    {comments[x._id]
                      ? Object.values(comments[x._id]).length
                      : 0}
                    )
                  </div>
                  {comments[x._id]
                    ? renderComments(
                        Object.values(comments[x._id])
                          .filter((a) => a.notificationReceivers.length === 1)
                          .map((b) => b._id),
                        x
                      )
                    : ""}
                  <div className="row no-gutters justify-content-end mt-2">
                    <div className="col-auto ml-4">
                      <Paigination
                        count={Math.ceil(
                          comments[x._id]
                            ? comments[x._id].length / commentsPerPage
                            : 1
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
            );
          })}
        <ReplyToReview
          refreshReviews={() => setRefreshReviews(!refreshReviews)}
          setReviewIdOfVisibleComments={setReviewIdOfVisibleComments}
          refreshComments={() => setRefreshComments(!refreshComments)}
          setComments={setComments}
          movie={{
            id: review.movie_id,
          }}
          reviewAuthor={
            publicUsers[review.author]
              ? publicUsers[review.author]
              : { display_name: "" }
          }
          review={review}
          open={addReplyOpen}
          onClose={() => setAddReplyOpen(false)}
          user={user}
        ></ReplyToReview>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    settings: state.settings,
    ratings: state.ratings,
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(PopularReviews);
