import React, { useState, useRef } from "react";
import date from "date-and-time";
import { MdThumbUp } from "react-icons/md";
import { connect } from "react-redux";
import Paigination from "../../utility/Paigination";
import history from "../../../History";

const Comments = ({ comments, publicUsers, ratings }) => {
  // partitioning comments into pages (8 comments per page)
  const [page, setPage] = useState(-1);
  // reference to top of the comments block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

  const reviewsPerPage = 8;

  //to avoid scroll into view on first render
  let realPage = page === -1 ? 1 : page;

  return (
    <div className="row no-gutters text-white">
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
                      onClick={() => history.push(`/movie/${x.id}`)}
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
                          {/* <img
                            onClick={() => history.push(`/movie/${x.id}`)}
                            width="100%"
                            style={{ borderRadius: "13px" }}
                            src={`https://image.tmdb.org/t/p/w154${x.movie_poster}`}
                          ></img> */}
                        </div>
                        <div className="col">
                          <div className="row no-gutters text-white mb-0">
                            {ratings[x.movie_id].movie_title} (
                            {ratings[x.movie_id].movie_release_date.substring(
                              0,
                              4
                            )}
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
                        <span className="mr-2">Commented on</span>
                        <span className="text-muted">
                          {date.format(new Date(x.date), "MMM DD, YYYY")}
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
