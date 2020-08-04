import React from "react";
import { Emoji } from "emoji-mart";
import { nFormatter } from "../../utilities/Functions";
import { connect } from "react-redux";
import store from "../../store/store";
import { RateMovie } from "../../server/DatabaseApi";

const ReactionButton = (props) => {
  const user = props.user;
  const movie = props.movie;
  const ratings = props.ratings;
  const size = props.size ? props.size : "normal";
  return (
    <div
      onClick={async () => {
        if (props.onClick) {
          props.onClick();
        } else {
          if (movie) {
            if (user.token) {
              let rate = {};
              if (props.emoji === "fire") {
                rate.type = "excellent_rate";
              } else if (props.emoji === "heart") {
                rate.type = "good_rate";
              } else if (props.emoji === "shit") {
                rate.type = "bad_rate";
              } else {
                rate.type = "ok_rate";
              }

              let rateTypeToReduce = user.ratings[movie.id]
                ? user.ratings[movie.id].rate_type
                : "";

              let userRatings = { ...user.ratings };
              if (userRatings[movie.id]) {
                userRatings[movie.id].rate_type = rate.type;
              } else {
                userRatings[movie.id] = {};
                userRatings[movie.id].rate_type = rate.type;
              }
              store.dispatch({
                type: "UPDATE_USER",
                userProperty: { ratings: userRatings },
              });

              let rating = ratings[movie.id]
                ? { ...ratings[movie.id] }
                : {
                    excellent_rate: 0,
                    ok_rate: 0,
                    bad_rate: 0,
                    good_rate: 0,
                    views: 0,
                    reviews: 0,
                  };
              if (rateTypeToReduce) {
                rating[rateTypeToReduce] -= 1;
              }
              rating[rate.type] += 1;
              store.dispatch({
                type: "UPDATE_RATINGS",
                rating: { [movie.id]: rating },
              });
              let res = await RateMovie(rate, movie, user);
            } else {
              store.dispatch({
                type: "SET_NOTIFICATION",
                notification: {
                  title: "Login required",
                  message: "You need to login to rate movies",
                  type: "failure",
                },
              });
            }
          } else {
            store.dispatch({
              type: "SET_NOTIFICATION",
              notification: {
                title: "Action not allowed",
                message: "You can not rate movies on this page",
                type: "failure",
              },
            });
          }
        }
      }}
      className={`col-auto btn-reaction-${size} btn-reaction${
        props.selected ? " btn-reaction-selected" : ""
      }${props.className ? ` ${props.className}` : ""}`}
    >
      <div className="row no-gutters align-items-center h-100 justify-content-center">
        {props.value !== undefined && props.value !== null ? (
          <div className={`col mr-${size === "normal" ? "2" : "1"}`}>
            {nFormatter(props.value, 1)}
          </div>
        ) : (
          ""
        )}
        <div className="col-auto">
          <div style={{ marginBottom: size === "normal" ? "-6px" : "-2px" }}>
            <Emoji
              emoji={props.emoji}
              set="facebook"
              size={size === "small" ? "14px" : "16px"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(ReactionButton);
