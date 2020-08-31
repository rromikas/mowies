import React, { useEffect, useState, useRef } from "react";
import date from "date-and-time";
import { nFormatter } from "../../utilities/Functions";
import { Emoji } from "emoji-mart";
import { MdThumbUp, MdChatBubble, MdFlag } from "react-icons/md";
import { BsPencil, BsTrash } from "react-icons/bs";
import ReplyToReview from "./ReplyToReview";
import AddReview from "./AddReview";
import {
  GetMovieReviews,
  GetMoviePromotedReviews,
  GetReviewComments,
  LikeReview,
  LikeComment,
  ReportReview,
  DeleteReview,
  ReportComment,
  DeleteComment,
} from "../../server/DatabaseApi";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Paigination from "../utility/Paigination";
import store from "../../store/store";
import Loader from "../utility/Loader";
import Popover from "../utility/Popover";
import OkIcon from "../../images/OkIcon";
import EditComment from "./EditComment";

const MovieReviews = ({
  movie,
  user,
  publicUsers,
  refreshReviewsFromParent,
  seekReviewId,
  seekCommentId,
  ratings,
}) => {
  // local reviews object in order to be able to update it quickly instead of waiting for real changes in database
  const [reviews, setReviews] = useState([]);
  const [promotedReviews, setPromotedReviews] = useState([]);

  const [loadingComment, setLoadingComment] = useState(-1);
  const [loadingReview, setLoadingReview] = useState(-1);
  const [loadingReport, setLoadingReport] = useState(-1);
  const [deletingComment, setDeletingComment] = useState(-1);
  const [deletingReview, setDeletingReview] = useState(-1);
  const [userIsOwnerOfReview, setUserIsOwnerOfReview] = useState(false);

  //admin can edit review and rating in promotions section. So promotions have edited content.
  const [promotedContents, setPromotedContents] = useState({});

  //comments object.Its property will be review id.
  const [comments, setComments] = useState({});
  const [comment, setComment] = useState(false);

  //
  const [reviewIdOfVisibleComments, setReviewIdOfVisibleComments] = useState(
    seekCommentId ? seekReviewId : -1
  );

  // partitioning reviews into pages (8 reviews per page)
  const [page, setPage] = useState(-1);
  const [commentsPage, setCommentsPage] = useState(1);

  // reference to top of the reviews block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

  // boolean variable to display "add review" modal or not
  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editCommentOpen, setEditCommentOpen] = useState(false);

  // boolean variable to display "add review" modal or not
  const [review, setReview] = useState("");

  //state to refresh comments after writing it
  const [refreshComments, setRefreshComments] = useState(false);

  //state to refresh reviews after writing it
  const [refreshReviews, setRefreshReviews] = useState(false);

  const commentsPerPage = 5;
  const reviewsPerPage = 8;

  const [scrolledOnce, setScrolledOnce] = useState(false);

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
      if (movie.id) {
        let promoted = await GetMoviePromotedReviews(movie.id);
        let promotedContentIds = [];
        let promoContents = {};
        if (!promoted.error) {
          promoted.forEach((x) => {
            promotedContentIds.push(x.content_id);
            promoContents[x.content_id] = x;
          });
        }
        setPromotedContents(promoContents);
        let data = await GetMovieReviews(movie.id);
        if (!data.error) {
          let promReviews = [],
            notPromotedReviews = [];
          data.reverse().forEach((x) => {
            if (x._id === seekReviewId) {
              promReviews.unshift(x);
            } else if (promotedContentIds.includes(x._id)) {
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
  }, [movie, refreshReviews, refreshReviewsFromParent]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderComments = (ids, review) => {
    return ids.map((x, ind) => {
      return comments[review._id][x] ? (
        <React.Fragment
          key={`comment-fragment-${reviewIdOfVisibleComments}-${ind}`}
        >
          <div
            ref={(el) => {
              if (x === seekCommentId && el && !scrolledOnce) {
                setScrolledOnce(true);
                el.scrollIntoView({ behavior: "smooth" });
                // reviewToSeek.current = el;
              }
            }}
            style={{
              marginLeft: `${
                comments[review._id][x].notificationReceivers.length * 60 - 30
              }px`,
            }}
            key={`comment-${reviewIdOfVisibleComments}-${ind}`}
            className={`indented-comment row no-gutters p-4 bg-over-root-lighter rounded mb-2${
              x === seekCommentId ? " fading-shadow" : ""
            }`}
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
                    <div className="col-auto">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-3 text-title-md mb-0">
                          {publicUsers[comments[review._id][x].author]
                            ? publicUsers[comments[review._id][x].author]
                                .display_name
                            : ""}
                        </div>
                        <div className="col-auto mr-3 text-muted">
                          {date.format(
                            new Date(comments[review._id][x].date),
                            "MMM DD, YYYY"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {user._id === comments[review._id][x].author ? (
                  <div className="col-auto">
                    <div className="row no-gutters">
                      <Popover
                        arrow={false}
                        position="top"
                        trigger="mouseenter"
                        theme="dark"
                        content={(w) => (
                          <div className="py-2 px-3 rounded bg-root">
                            Edit comment
                          </div>
                        )}
                      >
                        <div
                          className="col-auto text-muted btn-tertiary-small d-flex flex-center"
                          onClick={async () => {
                            setComment(comments[review._id][x]);
                            setEditCommentOpen(true);
                          }}
                        >
                          <BsPencil fontSize="24px"></BsPencil>
                        </div>
                      </Popover>
                      <Popover
                        arrow={false}
                        position="top"
                        trigger="mouseenter"
                        theme="dark"
                        content={(w) => (
                          <div className="py-2 px-3 rounded bg-root">
                            Delete comment
                          </div>
                        )}
                      >
                        <div
                          className="col-auto text-muted btn-tertiary-small d-flex flex-center"
                          onClick={async () => {
                            setDeletingComment(comments[review._id][x]._id);
                            let res = await DeleteComment(
                              comments[review._id][x]._id
                            );
                            setDeletingComment(-1);
                            if (res.error) {
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  title: `Couldn't delete comment`,
                                  type: "failure",
                                  message: res.error,
                                },
                              });
                            } else {
                              store.dispatch({
                                type: "SET_NOTIFICATION",
                                notification: {
                                  title: `Success`,
                                  type: "success",
                                  message: "Comment successfully deleted",
                                },
                              });
                              setRefreshComments(!refreshComments);
                              setRefreshReviews(!refreshReviews);
                            }
                          }}
                        >
                          {deletingComment === comments[review._id][x]._id ? (
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
                            <BsTrash fontSize="24px"></BsTrash>
                          )}
                        </div>
                      </Popover>
                    </div>
                  </div>
                ) : (
                  <Popover
                    arrow={false}
                    position="top"
                    trigger="mouseenter"
                    theme="dark"
                    content={(w) => (
                      <div className="py-2 px-3 rounded bg-root">
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
                )}
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
                          setReplyOpen(true);
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

  //avoid scrolling on first render into view
  const realPage = page === -1 ? 1 : page;

  return (
    <div className="row no-gutters">
      {reviews.length ? (
        <div className="col-60 h5 mb-3">
          Reviews ({nFormatter(reviews.length, 1)})
        </div>
      ) : (
        ""
      )}
      <div className="col-60">
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
              <React.Fragment key={`review-fragment-${i}`}>
                <div
                  ref={(el) => {
                    if (!seekCommentId) {
                      if (x._id === seekReviewId && el && !scrolledOnce) {
                        setScrolledOnce(true);
                        el.scrollIntoView({ behavior: "smooth" });
                        // reviewToSeek.current = el;
                      }
                    }
                  }}
                  key={`review-${i}`}
                  className={`row no-gutters p-4 bg-over-root-lighter rounded mb-2${
                    x._id === seekReviewId && !seekCommentId
                      ? " fading-shadow"
                      : ""
                  }`}
                >
                  <div className="col-auto pr-4 d-none d-md-block">
                    <div
                      className="bg-image rounded-circle square-70"
                      style={{
                        backgroundImage: `url(${
                          publicUsers[x.author ? x.author : x.content_author]
                            ? publicUsers[
                                x.author ? x.author : x.content_author
                              ].photo
                            : ""
                        })`,
                      }}
                    ></div>
                  </div>
                  <div className="col">
                    <div className="row no-gutters justify-content-between align-items-center mb-1">
                      <div className="col-auto">
                        <div className="row no-gutters align-items-center">
                          <div className="col-auto pr-2 d-block d-md-none">
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
                              <div className="col-auto mr-3 text-title-md mb-0">
                                {publicUsers[x.author]
                                  ? publicUsers[x.author].display_name
                                  : ""}
                              </div>
                              <div className="col-auto mr-3 text-muted">
                                {date.format(new Date(x.date), "MMM DD, YYYY")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {user._id === x.author ? (
                        <div className="col-auto">
                          <div className="row no-gutters">
                            <Popover
                              arrow={false}
                              position="top"
                              trigger="mouseenter"
                              theme="dark"
                              content={(w) => (
                                <div className="py-2 px-3 rounded bg-root">
                                  Edit review
                                </div>
                              )}
                            >
                              <div
                                className="col-auto text-muted btn-tertiary-small d-flex flex-center"
                                onClick={async () => {
                                  setReview(x);
                                  setUserIsOwnerOfReview(true);
                                  setAddReviewOpen(true);
                                }}
                              >
                                <BsPencil fontSize="24px"></BsPencil>
                              </div>
                            </Popover>
                            <Popover
                              arrow={false}
                              position="top"
                              trigger="mouseenter"
                              theme="dark"
                              content={(w) => (
                                <div className="py-2 px-3 rounded bg-root">
                                  Delete review
                                </div>
                              )}
                            >
                              <div
                                className="col-auto text-muted btn-tertiary-small d-flex flex-center"
                                onClick={async () => {
                                  setDeletingReview(x._id);
                                  let res = await DeleteReview(x);
                                  setDeletingReview(-1);
                                  if (res.error) {
                                    store.dispatch({
                                      type: "SET_NOTIFICATION",
                                      notification: {
                                        title: `Couldn't delete comment`,
                                        type: "failure",
                                        message: res.error,
                                      },
                                    });
                                  } else {
                                    store.dispatch({
                                      type: "SET_NOTIFICATION",
                                      notification: {
                                        title: `Success`,
                                        type: "success",
                                        message: "Comment successfully deleted",
                                      },
                                    });

                                    let rating = ratings[movie.id];
                                    let userInd = rating[x.rating].findIndex(
                                      (r) => r === x.author
                                    );
                                    if (userInd !== -1) {
                                      rating[x.rating].splice(userInd, 1);
                                    }
                                    store.dispatch({
                                      type: "UPDATE_RATINGS",
                                      rating: { [movie.id]: rating },
                                    });

                                    let userRatings = { ...user.ratings };
                                    delete userRatings[movie.id];
                                    store.dispatch({
                                      type: "UPDATE_USER",
                                      userProperty: {
                                        ratings: userRatings,
                                      },
                                    });
                                    setRefreshReviews(!refreshReviews);
                                  }
                                }}
                              >
                                {deletingReview === x._id ? (
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
                                  <BsTrash fontSize="24px"></BsTrash>
                                )}
                              </div>
                            </Popover>
                          </div>
                        </div>
                      ) : (
                        <Popover
                          arrow={false}
                          position="top"
                          trigger="mouseenter"
                          theme="dark"
                          content={(w) => (
                            <div className="py-2 px-3 rounded bg-root">
                              Report Abuse
                            </div>
                          )}
                        >
                          <div
                            className="col-auto text-muted btn-tertiary-small d-flex flex-center"
                            onClick={async () => {
                              if (user.token) {
                                setLoadingReport(x._id);
                                let res = await ReportReview(user, x._id);
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
                                      title: "Review reported",
                                      message:
                                        "Review was successfully reported. We will review it soon.",
                                      type: "success",
                                    },
                                  });
                                }
                              } else {
                                store.dispatch({
                                  type: "SET_NOTIFICATION",
                                  notification: {
                                    title: "Login required",
                                    message:
                                      "You need to login to report review",
                                    type: "failure",
                                  },
                                });
                              }
                            }}
                          >
                            {loadingReport === x._id ? (
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
                      )}
                    </div>

                    <div className="row no-gutters text-light mb-3 font-weight-300 text-break">
                      <div className="text-break">{review}</div>
                    </div>
                    <div className="row no-gutters justify-content-between align-items-center">
                      <div className="col-auto">
                        {rating === "ok_rate" ? (
                          <OkIcon size={24}></OkIcon>
                        ) : (
                          <Emoji
                            emoji={
                              rating === "excellent_rate"
                                ? "fire"
                                : rating === "good_rate"
                                ? "heart"
                                : rating === "ok_rate"
                                ? "heavy_division_sign"
                                : "shit"
                            }
                            set="facebook"
                            size={24}
                          />
                        )}
                      </div>
                      <div className="col-auto">
                        <div className="row no-gutters align-items-center">
                          <div className="col-auto mr-2">{x.likes.length}</div>
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
                                      let res = await LikeReview(user, x._id);
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
                                            "You can not like you own review",
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
                              setReview(
                                Object.assign({}, x, {
                                  notificationReceivers: [
                                    publicUsers[x.author],
                                  ],
                                })
                              );
                              setReplyOpen(true);
                            }}
                          >
                            Reply
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
                    style={{ marginLeft: "30px" }}
                    className="py-2 text-light"
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
                  <div className="row no-gutters justify-content-end">
                    <div className="col-auto">
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
        <div className="row no-gutters justify-content-end pt-2">
          <div className="col-auto">
            <Paigination
              classNames={{
                notSelected: "input-dark",
                selected: "input-dark-selected",
              }}
              count={Math.ceil(reviews.length / reviewsPerPage)}
              current={realPage}
              setCurrent={setPage}
            ></Paigination>
          </div>
          <AddReview
            userIsOwner={userIsOwnerOfReview}
            open={addReviewOpen}
            onClose={() => setAddReviewOpen(false)}
            movie={movie}
            review={review}
            user={user}
            refreshReviews={() => setRefreshReviews(!refreshReviews)}
          ></AddReview>
          <ReplyToReview
            refreshReviews={() => setRefreshReviews(!refreshReviews)}
            setReviewIdOfVisibleComments={setReviewIdOfVisibleComments}
            refreshComments={() => setRefreshComments(!refreshComments)}
            setComments={setComments}
            movie={movie}
            reviewAuthor={
              publicUsers[review.author]
                ? publicUsers[review.author]
                : { display_name: "" }
            }
            review={review}
            open={replyOpen}
            onClose={() => setReplyOpen(false)}
            user={user}
          ></ReplyToReview>
          <EditComment
            comment={comment}
            refreshComments={() => setRefreshComments(!refreshComments)}
            setComments={() => {}}
            movie={movie}
            open={editCommentOpen}
            onClose={() => setEditCommentOpen(false)}
            user={user}
          ></EditComment>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(MovieReviews);
