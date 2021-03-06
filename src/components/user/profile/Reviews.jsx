import React, { useEffect, useState, useRef } from "react";
import date from "date-and-time";
import Emoji from "../Emoji";
import { MdThumbUp, MdChatBubble } from "react-icons/md";
import { GetReviewComments, DeleteReview } from "../../../server/DatabaseApi";
import { connect } from "react-redux";
import Collapse from "@material-ui/core/Collapse";
import Paigination from "../../utility/Paigination";
import history from "../../../History";
import AddReview from "../AddReview";
import { BsPencil, BsTrash } from "react-icons/bs";
import Popover from "../../utility/Popover";
import store from "../../../store/store";
import Loader from "../../utility/Loader";
import { confirm } from "../../../utilities/Functions";

const Reviews = ({
  reviews,
  publicUsers,
  ratings,
  owner,
  user,
  refreshReviews,
}) => {
  //comments object.Its property will be review id.
  const [comments, setComments] = useState({});

  const [addReviewOpen, setAddReviewOpen] = useState(false);
  const [movie, setMovie] = useState(false);
  const [review, setReview] = useState(false);

  const [reviewIdOfVisibleComments, setReviewIdOfVisibleComments] = useState(
    -1
  );
  const [deletingReview, setDeletingReview] = useState(-1);

  // partitioning reviews into pages (8 reviews per page)
  const [page, setPage] = useState(-1);
  const [commentsPage, setCommentsPage] = useState(1);

  // reference to top of the reviews block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

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
  }, [reviewIdOfVisibleComments]);

  //to avoid scroll into view on first render
  let realPage = page === -1 ? 1 : page;

  const renderEditOptions = (element) => {
    return (
      <React.Fragment>
        <Popover
          arrow={false}
          position="top"
          trigger="mouseenter"
          theme="dark"
          content={(w) => (
            <div className="py-2 px-3 rounded bg-root">Edit review</div>
          )}
        >
          <div
            className="col-auto text-muted btn-tertiary-small d-flex flex-center"
            onClick={async () => {
              setMovie({
                release_date: ratings[element.movie_id].movie_release_date,
                title: ratings[element.movie_id].movie_title,
                id: ratings[element.movie_id].tmdb_id,
              });
              setReview(element);
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
            <div className="py-2 px-3 rounded bg-root">Delete review</div>
          )}
        >
          <div
            className="col-auto text-muted btn-tertiary-small d-flex flex-center"
            onClick={async () => {
              try {
                if (
                  await confirm({
                    confirmation: "Do you really want to delete review?",
                  })
                ) {
                  setDeletingReview(element._id);
                  let res = await DeleteReview(element);
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

                    let rating = ratings[element.movie_id];
                    let userInd = rating[element.rating].findIndex(
                      (r) => r === element.author
                    );
                    if (userInd !== -1) {
                      rating[element.rating].splice(userInd, 1);
                    }
                    store.dispatch({
                      type: "UPDATE_RATINGS",
                      rating: { [element.movie_id]: rating },
                    });

                    let userRatings = { ...user.ratings };
                    delete userRatings[element.movie_id];
                    store.dispatch({
                      type: "UPDATE_USER",
                      userProperty: {
                        ratings: userRatings,
                      },
                    });
                    refreshReviews();
                  }
                } else {
                }
              } catch (er) {}
            }}
          >
            {deletingReview === element._id ? (
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
      </React.Fragment>
    );
  };

  return (
    <div className="row no-gutters text-white">
      <AddReview
        userIsOwner={true}
        open={addReviewOpen}
        onClose={() => setAddReviewOpen(false)}
        movie={movie}
        review={review}
        user={user}
        refreshReviews={refreshReviews}
      ></AddReview>
      <div className="col-60">
        <div className="row no-gutters mb-2" ref={topOfReviewsBlock}></div>
        {reviews.length ? (
          reviews
            .slice(
              (realPage - 1) * reviewsPerPage,
              (realPage - 1) * reviewsPerPage + reviewsPerPage
            )
            .map((x, i) =>
              ratings[x.movie_id] ? (
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
                          alt={ratings[x.movie_id].movie_poster}
                          onClick={() => history.push(`/movie/${x.movie_id}`)}
                          width="100%"
                          style={{ borderRadius: "13px" }}
                          src={`https://image.tmdb.org/t/p/w154${
                            ratings[x.movie_id].movie_poster
                          }`}
                        ></img>
                      </div>
                    </div>
                    <div className="col d-flex flex-column">
                      <div className="row no-gutters justify-content-between align-items-center mb-2 flex-grow-0">
                        <div className="col-60 d-block d-sm-none mb-3">
                          <div className="row no-gutters mb-1 justify-content-between">
                            <div className="col-auto mr-3">
                              <div className="row no-gutters">
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
                                  <div className="row no-gutters text-white mb-0">
                                    {ratings[x.movie_id].movie_title} (
                                    {ratings[
                                      x.movie_id
                                    ].movie_release_date.substring(0, 4)}
                                    )
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-auto d-block d-sm-none">
                              <div className="row no-gutters">
                                {owner ? renderEditOptions(x) : ""}
                              </div>
                            </div>
                          </div>
                        </div>
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
                            <span className="mr-2 col-auto d-none d-md-block">
                              Posted review on
                            </span>
                            <span className="text-muted col-auto mr-2">
                              {date.format(new Date(x.date), "MMM DD, YYYY")}
                            </span>
                            <span className="d-none d-sm-flex">
                              {owner ? renderEditOptions(x) : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="row no-gutters text-light mb-3 flex-grow-0 font-weigt-300 text-break">
                        {x.review}
                      </div>
                      <div className="row no-gutters align-items-center">
                        {x.rating ? (
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
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="row no-gutters flex-grow-1">
                        <div className="col-60 d-flex flex-column justify-content-end">
                          <div className="row no-gutters justify-content-end align-items-center text-white">
                            <div className="col-auto">
                              <div className="row no-gutters align-items-center">
                                <div className="col-auto mr-2">
                                  {x.likes.length}
                                </div>
                                <div className="col-auto mr-2 ">
                                  <MdThumbUp
                                    fontSize="24px"
                                    className="text-green"
                                  ></MdThumbUp>
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
                    <div className="ml-4 py-2 text-light">
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
                                        {date.format(
                                          new Date(y.date),
                                          "MMM DD, YYYY"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="row no-gutters text-light mb-3 font-weight-300 text-break">
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
              ) : (
                ""
              )
            )
        ) : (
          <div
            className="row no-gutters flex-center bg-over-root-lighter rounded p-5"
            style={{ height: "150px" }}
          >
            You have not reviewed any movies/series. Your review will help your
            friends and family pick the right movie or series to watch.
          </div>
        )}
        <div className="row no-gutters justify-content-sm-end justify-content-center mt-2">
          <div className="col-auto mb-4 mr-sm-2 mr-md-0">
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

export default connect(mapp)(Reviews);
