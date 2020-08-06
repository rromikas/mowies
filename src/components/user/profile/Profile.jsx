import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  GetUser,
  GetUserReviews,
  GetUserComments,
} from "../../../server/DatabaseApi";
import Wishlist from "./Wishlist";
import Watchedlist from "./Watchedlist";
import Reviews from "./Reviews";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import Comments from "./Comments";
import EditProfile from "./EditProfile";
import Footer from "../Footer";

const Profile = (props) => {
  const user = props.user;
  const userId = props.match.params.userId;
  const publicUsers = props.publicUsers;
  const sectionInUrl = props.match.params.section;

  const [profileData, setProfileData] = useState({
    wishlist: [],
    comments: [],
    watchedlist: [],
    reviews: [],
    first_name: "",
    last_name: "",
  });

  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);

  const reviewsFetched = useRef(false);
  const commentsFetched = useRef(false);

  const [section, setSection] = useState(0);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [refreshProfile, setRefreshProfile] = useState(false);

  useEffect(() => {
    async function getData() {
      if (userId) {
        let res = await GetUser(userId);
        if (!res.error) {
          setProfileData(res);
        }
      }
    }
    getData();
  }, [userId, refreshProfile]);

  useEffect(() => {
    if (sectionInUrl !== undefined) {
      setSection(+sectionInUrl);
    }
  }, [sectionInUrl]);

  useEffect(() => {
    async function getData() {
      if (
        section === 2 &&
        !reviewsFetched.current &&
        profileData.reviews.length
      ) {
        reviewsFetched.current = true;
        let res = await GetUserReviews(profileData.reviews);
        if (!res.error) {
          setReviews(res);
        }
      } else if (section === 3 && !commentsFetched.current) {
        commentsFetched.current = true;
        let res = await GetUserComments(profileData.comments);
        if (!res.error) {
          setComments(res);
        }
      }
    }
    getData();
  }, [section, profileData.reviews.length]);

  return (
    <div className="row no-gutters">
      <EditProfile
        refreshProfile={() => setRefreshProfile(!refreshProfile)}
        editProfileOpen={editProfileOpen}
        user={user}
        onClose={() => setEditProfileOpen(false)}
      ></EditProfile>
      <div className="col-60 content-container mx-auto p-sm-5 p-4">
        <div className="row no-gutters justify-content-xl-between justify-content-center text-white bg-over-root-lighter p-sm-5 p-4 rounded mb-2">
          <div className="col-auto mb-4 mr-lg-5">
            <div className="row no-gutters justify-content-xl-start justify-content-center">
              <div
                className="col-auto bg-image square-100 rounded-circle mr-md-4"
                style={{
                  backgroundImage: `url(${
                    publicUsers[userId] ? publicUsers[userId].photo : ""
                  })`,
                }}
              ></div>
              <div className="col-60 col-md-auto">
                {profileData.first_name || profileData.last_name ? (
                  <div className="row no-gutters text-title-lg justify-content-md-start justify-content-center">
                    <div className="col-auto mr-2">
                      {profileData.first_name ? profileData.first_name : ""}
                    </div>
                    <div className="col-auto">
                      {profileData.last_name ? profileData.last_name : ""}
                    </div>
                  </div>
                ) : (
                  <div className="row no-gutters h5 justify-content-md-start justify-content-center">
                    Full name is empty
                  </div>
                )}

                <div className="row no-gutters justify-content-md-start justify-content-center text-title-md mb-2">
                  @{publicUsers[userId] ? publicUsers[userId].display_name : ""}
                </div>
                <div className="row no-gutters justify-content-md-start justify-content-center">
                  <div
                    className="col-auto btn-custom btn-custom-primary btn-small"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    Edit Profile
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-auto col-60">
            <div className="row no-gutters justify-content-center h-100 align-items-center">
              <div className="col-sm-auto col mr-sm-4">
                <div className="row no-gutters mb-3 profile-stats-title">
                  Wishlist
                </div>
                <div className="row no-gutters text-lift justify-content-center">
                  {profileData.wishlist.length}
                </div>
              </div>
              <div className="col-sm-auto col mr-sm-4 mr-0">
                <div className="row no-gutters mb-3 profile-stats-title">
                  Watched
                </div>
                <div className="row no-gutters text-lift justify-content-center">
                  {profileData.watchedlist.length}
                </div>
              </div>
              <div className="col-sm-auto col mr-sm-4 mr-0">
                <div className="row no-gutters mb-3 profile-stats-title">
                  Reviews
                </div>
                <div className="row no-gutters text-lift justify-content-center profile-stats-title">
                  {profileData.reviews.length}
                </div>
              </div>
              <div className="col-sm-auto col">
                <div className="row no-gutters mb-3 profile-stats-title">
                  Comments
                </div>
                <div className="row no-gutters text-lift justify-content-center">
                  {profileData.comments.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-over-root-lighter row no-gutters rounded w-100 justify-content-between text-white">
          <div className="col-60">
            <SimpleBar
              style={{
                maxWidth: "100%",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <div
                className="d-inline-block p-sm-4 p-3 cursor-pointer mr-4 text-title-md mb-0 user-select-none"
                style={{
                  borderTop: "3px solid transparent",
                  borderBottom:
                    section === 0
                      ? "3px solid rgb(255, 0, 64)"
                      : "3px solid transparent",
                }}
                onClick={() => setSection(0)}
              >
                Wishlist
              </div>
              <div
                style={{
                  borderTop: "3px solid transparent",
                  borderBottom:
                    section === 1
                      ? "3px solid rgb(255, 0, 64)"
                      : "3px solid transparent",
                }}
                className="d-inline-block p-sm-4 p-3 cursor-pointer mr-4 text-title-md mb-0 user-select-none"
                onClick={() => setSection(1)}
              >
                Watched
              </div>
              <div
                style={{
                  borderTop: "3px solid transparent",
                  borderBottom:
                    section === 2
                      ? "3px solid rgb(255, 0, 64)"
                      : "3px solid transparent",
                }}
                className="d-inline-block p-sm-4 p-3 cursor-pointer mr-4 text-title-md mb-0 user-select-none"
                onClick={() => setSection(2)}
              >
                Reviews
              </div>
              <div
                style={{
                  borderTop: "3px solid transparent",
                  borderBottom:
                    section === 3
                      ? "3px solid rgb(255, 0, 64)"
                      : "3px solid transparent",
                }}
                className="d-inline-block p-sm-4 p-3 cursor-pointer mr-4 text-title-md mb-0 user-select-none"
                onClick={() => setSection(3)}
              >
                Comments
              </div>
            </SimpleBar>
          </div>
        </div>
        {section === 0 ? (
          <Wishlist
            refreshProfile={() => setRefreshProfile(!refreshProfile)}
            movies={profileData.wishlist}
            owner={user._id === profileData._id}
          ></Wishlist>
        ) : section === 1 ? (
          <Watchedlist movies={profileData.watchedlist}></Watchedlist>
        ) : section === 2 ? (
          <Reviews reviews={reviews}></Reviews>
        ) : section === 3 ? (
          <Comments reviews={comments}></Comments>
        ) : (
          ""
        )}
      </div>
      <div className="col-60">
        <Footer></Footer>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    publicUsers: state.publicUsers,
    ...ownProps,
  };
}

export default connect(mapp)(Profile);
