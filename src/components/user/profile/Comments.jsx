import React, { useState, useRef } from "react";
import date from "date-and-time";
import { MdThumbUp } from "react-icons/md";
import { connect } from "react-redux";
import Paigination from "../../utility/Paigination";
import history from "../../../History";
import EditComment from "../EditComment";
import { BsPencil, BsTrash } from "react-icons/bs";
import Popover from "../../utility/Popover";
import { DeleteComment } from "../../../server/DatabaseApi";
import store from "../../../store/store";
import Loader from "../../utility/Loader";
import { confirm } from "../../../utilities/Functions";

const Comments = ({
  comments,
  publicUsers,
  ratings,
  owner,
  user,
  refreshComments,
}) => {
  // partitioning comments into pages (8 comments per page)
  const [page, setPage] = useState(-1);
  // reference to top of the comments block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

  const [movie, setMovie] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [comment, setComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState(-1);
  const reviewsPerPage = 8;

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
            <div className="py-2 px-3 rounded bg-root">Edit comment</div>
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
              setComment(element);
              setReplyOpen(true);
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
            <div className="py-2 px-3 rounded bg-root">Delete comment</div>
          )}
        >
          <div
            className="col-auto text-muted btn-tertiary-small d-flex flex-center"
            onClick={async () => {
              if (
                await confirm({
                  confirmation: "Do you really want to delete comment?",
                })
              ) {
                setDeletingComment(element._id);
                let res = await DeleteComment(element._id);
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
                  refreshComments();
                }
              }
            }}
          >
            {deletingComment === element._id ? (
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
      <EditComment
        comment={comment}
        refreshComments={refreshComments}
        setComments={() => {}}
        movie={movie}
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        user={user}
      ></EditComment>
      <div className="col-60">
        <div className="row no-gutters mb-2" ref={topOfReviewsBlock}></div>
        {comments.length ? (
          comments
            .slice(
              (realPage - 1) * reviewsPerPage,
              (realPage - 1) * reviewsPerPage + reviewsPerPage
            )
            .map((x, i) => (
              <div
                key={`comment-${i}`}
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
                        <div className="col-auto">
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
                            <div className="col-auto mr-3 h6 mb-0">
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
                        <span className="mr-2 col-auto d-md-block d-none">
                          Commented on
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

                  <div className="row no-gutters text-light mb-3 flex-grow-0 font-weight-300">
                    {x.comment}
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
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div
            className="row no-gutters flex-center bg-over-root-lighter rounded p-5"
            style={{ height: "150px" }}
          >
            You have not commented on any comments. We encourage you to share
            your opinion on your friends and family comments.
          </div>
        )}
        <div className="row no-gutters justify-content-sm-end justify-content-center mt-2">
          <div className="col-auto mb-4 mr-sm-2 mr-md-0">
            <Paigination
              classNames={{
                notSelected: "input-dark",
                selected: "input-dark-selected",
              }}
              count={Math.ceil(comments.length / reviewsPerPage)}
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

export default connect(mapp)(Comments);
