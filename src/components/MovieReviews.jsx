import React, { useEffect, useState, useRef } from "react";
import { Reviews } from "../Data";
import date from "date-and-time";
import { nFormatter } from "../utilities/Functions";
import { Emoji } from "emoji-mart";
import { MdThumbUp, MdChatBubble } from "react-icons/md";
import { FaRegPaperPlane } from "react-icons/fa";
import ReplyToReview from "./ReplyToReview";
import AddReview from "./AddReview";

const MovieReviews = ({ initialData, movie, user }) => {
  // local reviews object in order to be able to update it quickly instead of waiting for real changes in database
  const [reviews, setReviews] = useState([]);

  // partitioning reviews into pages (8 reviews per page)
  const [page, setPage] = useState(-1);

  // reference to top of the reviews block to scroll into view after changing the page
  const topOfReviewsBlock = useRef(null);

  // boolean variable to display "add review" modal or not
  const [addReviewOpen, setAddReviewOpen] = useState(false);

  // boolean variable to display "add review" modal or not
  const [replyReviewAuthor, setReplyReviewAuthor] = useState("");

  useEffect(() => {
    setReviews(initialData);
  }, [initialData]);

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

  const realPage = page < 0 ? 0 : page;

  return (
    <div className="row no-gutters">
      <div className="col-60 h1 mb-3">
        Popular Reviews ({nFormatter(reviews.length, 1)})
      </div>
      <div className="col-60">
        <div className="row no-gutters mb-2" ref={topOfReviewsBlock}></div>
        {reviews.slice(realPage * 8, realPage * 8 + 8).map((x, i) => (
          <div
            key={`review-${i}`}
            className="row no-gutters p-4 bg-over-root-lighter rounded mb-2"
          >
            <div className="col-auto pr-4 d-none d-md-block">
              <div
                className="bg-image rounded-circle square-70"
                style={{ backgroundImage: `url(${x.author.photo})` }}
              ></div>
            </div>
            <div className="col">
              <div className="row no-gutters justify-content-between align-items-center mb-2">
                <div className="col-auto pr-4 d-block d-md-none">
                  <div
                    className="bg-image rounded-circle square-40"
                    style={{ backgroundImage: `url(${x.author.photo})` }}
                  ></div>
                </div>
                <div className="col-auto">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto mr-3 h5 mb-0">{x.author.name}</div>
                    <div className="col-auto mr-3 text-muted">
                      {date.format(new Date(x.date), "MMM DD, YYYY")}
                    </div>
                  </div>
                </div>
                <div className="col-auto text-muted">Report Abuse</div>
              </div>

              <div className="row no-gutters text-light mb-3">{x.review}</div>
              <div className="row no-gutters justify-content-between align-items-center">
                <div className="col-auto">
                  <Emoji
                    emoji={
                      x.rate === "Excellent"
                        ? "fire"
                        : x.rate === "Good"
                        ? "heart"
                        : x.rate === "OK"
                        ? "heavy_division_sign"
                        : "shit"
                    }
                    set="facebook"
                    size={24}
                  />
                </div>
                <div className="col-auto">
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto mr-2">{x.likes}</div>
                    <div className="col-auto mr-2 ">
                      <MdThumbUp
                        fontSize="24px"
                        className="text-green"
                      ></MdThumbUp>
                    </div>
                    <div className="col-auto mr-2">{x.comments}</div>
                    <div className="col-auto mr-2">
                      <MdChatBubble
                        fontSize="24px"
                        className="text-orange"
                      ></MdChatBubble>
                    </div>
                    <div
                      className="col-auto text-orange"
                      onClick={() => setReplyReviewAuthor(x.author)}
                    >
                      Reply
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="row no-gutters justify-content-sm-between justify-content-center pt-5">
          <div className="col-auto mb-4 mr-sm-2 mr-md-0">
            <div className="row no-gutters">
              {Array.apply(null, Array(Math.ceil(reviews.length / 8))).map(
                (x, i) => (
                  <div
                    onClick={() => {
                      setPage(i);
                    }}
                    key={`roles-page-${i}`}
                    className={`square-64 cursor-pointer d-flex col-auto mr-2 flex-center rounded ${
                      realPage === i
                        ? "bg-white-10 font-weight-600"
                        : "bg-white-5-10 text-muted"
                    }`}
                  >
                    {i + 1}
                  </div>
                )
              )}
            </div>
          </div>
          <div
            className="col-auto btn-custom btn-custom-primary btn-small"
            onClick={() => setAddReviewOpen(true)}
          >
            Add Review
            <FaRegPaperPlane fontSize="20px" className="ml-2"></FaRegPaperPlane>
          </div>
          <AddReview
            open={addReviewOpen}
            onClose={() => setAddReviewOpen(false)}
            movie={movie}
            user={user}
          ></AddReview>
          <ReplyToReview
            open={replyReviewAuthor}
            onClose={() => setReplyReviewAuthor(false)}
            reviewAuthor={replyReviewAuthor}
            user={user}
          ></ReplyToReview>
        </div>
      </div>
    </div>
  );
};

export default MovieReviews;
