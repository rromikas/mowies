import React, { useEffect, useState, useRef } from "react";
import date from "date-and-time";
import { nFormatter } from "../../utilities/Functions";
import { Emoji } from "emoji-mart";
import { MdThumbUp, MdChatBubble } from "react-icons/md";
import { FaRegPaperPlane } from "react-icons/fa";
import ReplyToReview from "./ReplyToReview";
import AddReview from "./AddReview";
import {
  GetMovieReviews,
  GetReviewComments,
  LikeReview,
  LikeComment,
  ReportReview,
  ReportComment,
} from "../../server/DatabaseApi";
import { connect } from "react-redux";
import { Collapse } from "@material-ui/core";
import Paigination from "../utility/Paigination";
import store from "../../store/store";

const MovieReviews = ({ initialData, movie, user, publicUsers }) => {
  // local reviews object in order to be able to update it quickly instead of waiting for real changes in database
  const [reviews, setReviews] = useState([]);

  //comments object.Its property will be review id.
  const [comments, setComments] = useState({});

  //
  const [reviewIdOfVisibleComments, setReviewIdOfVisibleComments] = useState(
    -1
  );

  // partitioning reviews into pages (8 reviews per page)
  const [page, setPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);

  // reference to top of the reviews block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

  // boolean variable to display "add review" modal or not
  const [addReviewOpen, setAddReviewOpen] = useState(false);

  // boolean variable to display "add review" modal or not
  const [review, setReview] = useState("");

  //state to refresh comments after writing it
  const [refreshComments, setRefreshComments] = useState(false);

  //state to refresh reviews after writing it
  const [refreshReviews, setRefreshReviews] = useState(false);

  const commentsPerPage = 5;
  const reviewsPerPage = 8;

  useEffect(() => {
    async function getData() {
      if (reviewIdOfVisibleComments !== -1) {
        let data = await GetReviewComments(reviewIdOfVisibleComments);
        console.log("comment data", data);
        setComments((prev) =>
          Object.assign({}, prev, { [reviewIdOfVisibleComments]: data })
        );
      }
    }
    getData();
  }, [reviewIdOfVisibleComments, refreshComments]);

  useEffect(() => {
    async function getData() {
      if (movie.id) {
        let reviews = await GetMovieReviews(movie.id);
        console.log("REviews", reviews);
        setReviews(reviews);
      }
    }
    getData();
  }, [movie, refreshReviews]);

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

  return (
    <div className="row no-gutters">
      <div className="col-60 h1 mb-3">
        Popular Reviews ({nFormatter(reviews.length, 1)})
      </div>
      <div className="col-60">
        <div className="row no-gutters mb-2" ref={topOfReviewsBlock}></div>
        {reviews
          .slice(
            (page - 1) * reviewsPerPage,
            (page - 1) * reviewsPerPage + reviewsPerPage
          )
          .map((x, i) => (
            <React.Fragment>
              <div
                key={`review-${i}`}
                className="row no-gutters p-4 bg-over-root-lighter rounded mb-2"
              >
                <div className="col-auto pr-4 d-none d-md-block">
                  <div
                    className="bg-image rounded-circle square-70"
                    style={{
                      backgroundImage: `url(${
                        publicUsers[x.author] ? publicUsers[x.author].photo : ""
                      })`,
                    }}
                  ></div>
                </div>
                <div className="col">
                  <div className="row no-gutters justify-content-between align-items-center mb-2">
                    <div className="col-auto pr-4 d-block d-md-none">
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
                        <div className="col-auto mr-3 h5 mb-0">
                          {publicUsers[x.author]
                            ? publicUsers[x.author].display_name
                            : ""}
                        </div>
                        <div className="col-auto mr-3 text-muted">
                          {date.format(new Date(x.date), "MMM DD, YYYY")}
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-auto text-muted btn-tertiary"
                      onClick={async () => {
                        if (user.token) {
                          let res = await ReportReview(user, x._id);
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
                              message: "You need to login to report review",
                              type: "failure",
                            },
                          });
                        }
                      }}
                    >
                      Report Abuse
                    </div>
                  </div>

                  <div className="row no-gutters text-light mb-3">
                    {x.review}
                  </div>
                  <div className="row no-gutters justify-content-between align-items-center">
                    <div className="col-auto">
                      <Emoji
                        emoji={
                          x.rating === "excellent_rate"
                            ? "fire"
                            : x.rating === "good_rate"
                            ? "heart"
                            : x.rating === "ok_rate"
                            ? "heavy_division_sign"
                            : "shit"
                        }
                        set="facebook"
                        size={24}
                      />
                    </div>
                    <div className="col-auto">
                      <div className="row no-gutters align-items-center">
                        <div className="col-auto mr-2">{x.likes.length}</div>
                        <div className="col-auto mr-2 ">
                          <MdThumbUp
                            onClick={async () => {
                              if (user.token) {
                                let res = await LikeReview(user, x._id);
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
                        </div>
                        <div className="col-auto mr-2">{x.comments.length}</div>
                        <div className="col-auto mr-2">
                          <MdChatBubble
                            onClick={() => {
                              console.log(reviewIdOfVisibleComments === x._id);
                              setReviewIdOfVisibleComments(
                                reviewIdOfVisibleComments === x._id ? -1 : x._id
                              );
                            }}
                            fontSize="24px"
                            className="text-orange scale-transition cursor-pointer"
                          ></MdChatBubble>
                        </div>
                        <div
                          className="col-auto text-orange btn-tertiary"
                          onClick={() =>
                            setReview(
                              Object.assign({}, x, {
                                notificationReceivers: [publicUsers[x.author]],
                              })
                            )
                          }
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
                <div className="ml-4 h5 py-2">
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
                            <div className="row no-gutters justify-content-between align-items-center mb-2">
                              <div className="col-auto pr-4 d-block d-md-none">
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
                                  <div className="col-auto mr-3 h5 mb-0">
                                    {publicUsers[y.author]
                                      ? publicUsers[y.author].display_name
                                      : ""}
                                  </div>
                                  <div className="col-auto mr-3 text-muted">
                                    {date.format(
                                      new Date(y.date),
                                      "MMM DD, YYYY"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div
                                className="col-auto text-muted btn-tertiary"
                                onClick={async () => {
                                  if (user.token) {
                                    let res = await ReportComment(user, y._id);
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
                                        message:
                                          "You need to login to report comment",
                                        type: "failure",
                                      },
                                    });
                                  }
                                }}
                              >
                                Report Abuse
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
                                      onClick={async () => {
                                        if (user.token) {
                                          let res = await LikeComment(
                                            user,
                                            x._id
                                          );
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
                                            setRefreshComments(
                                              !refreshComments
                                            );
                                          }
                                        } else {
                                          store.dispatch({
                                            type: "SET_NOTIFICATION",
                                            notification: {
                                              title: "Login required",
                                              message:
                                                "You need to login to like comment",
                                              type: "failure",
                                            },
                                          });
                                        }
                                      }}
                                      fontSize="24px"
                                      className="text-green scale-transition cursor-pointer"
                                    ></MdThumbUp>
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
                                              publicUsers[y.author],
                                            ],
                                          })
                                        );
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
                      ))
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
          ))}
        <div className="row no-gutters justify-content-sm-between justify-content-center pt-5">
          <div className="col-auto mb-4 mr-sm-2 mr-md-0">
            <Paigination
              classNames={{
                notSelected: "input-dark",
                selected: "input-dark-selected",
              }}
              count={Math.ceil(reviews.length / reviewsPerPage)}
              current={page}
              setCurrent={setPage}
            ></Paigination>
          </div>
          <div
            className="col-auto btn-custom btn-custom-primary btn-small"
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
                setAddReviewOpen(true);
              }
            }}
          >
            Add Review
            <FaRegPaperPlane fontSize="20px" className="ml-2"></FaRegPaperPlane>
          </div>
          <AddReview
            open={addReviewOpen}
            onClose={() => setAddReviewOpen(false)}
            movie={movie}
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
            open={review}
            onClose={() => setReview("")}
            user={user}
          ></ReplyToReview>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(MovieReviews);