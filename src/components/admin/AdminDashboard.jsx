import React, { useState } from "react";
import LeftSideMenu from "./LeftSideMenu";
import Settings from "./Settings";
import RightSideMenuFloating from "./RightSideMenuFloating";
import Navbar from "./Navbar";
import ReviewsAndComments from "./ReviewAndComments";
import EditReview from "./EditReview";
import { BsArrowLeft } from "react-icons/bs";
import EditComment from "./EditComment";
import Announcements from "./Announcements";
import EditAnnouncement from "./EditAnnouncement";
import AddNewAnnouncement from "./AddNewAnnouncement";
import Promotions from "./Promotions";
import EditPromotion from "./EditPromotion";
import AddNewPromotion from "./AddNewPromotion";
import Notifications from "./Notifications";
import EditNotification from "./EditNotification";
import AddNewNotification from "./AddNewNotification";
import Users from "./Users";
import AddNewUser from "./AddNewUser";
import EditUser from "./EditUser";
import { connect } from "react-redux";

const sections = {
  settings: 0,
  userManagement: 1,
  reviewsAndComments: 2,
  announcements: 3,
  promotions: 4,
  notifications: 5,
  editReview: 6,
  editComment: 7,
  editAnnouncement: 8,
  addNewAnnouncement: 9,
  editPromotion: 10,
  addNewPromotion: 11,
  editNotification: 12,
  addNewNotification: 13,
  editUser: 14,
  addNewUser: 15,
};

const AdminDashboard = ({ dashboardMenuOpened }) => {
  const [section, setSection] = useState(0);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [editPromotion, setEditPromotion] = useState(null);
  const [editNotification, setEditNotification] = useState(null);
  const [editUser, setEditUser] = useState(null);
  return (
    <div
      className="row no-gutters justify-content-center"
      style={{ minHeight: window.innerHeight }}
    >
      <div className="col-60">
        <div className="row no-gutters h-100 position-relative bg-light">
          <RightSideMenuFloating
            isMenuOpened={dashboardMenuOpened}
            setSection={setSection}
            section={section}
          ></RightSideMenuFloating>
          <div
            className="col-auto d-none d-lg-block"
            style={{ width: "300px" }}
          >
            <LeftSideMenu
              section={section}
              setSection={setSection}
            ></LeftSideMenu>
          </div>
          <div className="col">
            {section >= 6 && (
              <div
                className="row no-gutters px-md-5 px-4 pt-4"
                style={{ marginBottom: "-40px" }}
              >
                <div className="col-auto cursor-pointer">
                  <BsArrowLeft
                    fontSize="24px"
                    onClick={() =>
                      setSection(
                        section === 6 || section === 7
                          ? 2
                          : section === 8 || section === 9
                          ? 3
                          : section === 10 || section === 11
                          ? 4
                          : section === 12 || section === 13
                          ? 5
                          : section === 14 || section === 15
                          ? 1
                          : 0
                      )
                    }
                  ></BsArrowLeft>
                </div>
              </div>
            )}
            {section === 0 ? (
              <Settings></Settings>
            ) : section === 1 ? (
              <Users
                setAddNewUserSection={() => setSection(sections["addNewUser"])}
                setEditUser={(u) => setEditUser(u)}
                setEditUserSection={() => setSection(sections["editUser"])}
              ></Users>
            ) : section === 2 ? (
              <ReviewsAndComments
                setEditReview={(rev) => setEditReview(rev)}
                setEditReviewSection={() => setSection(sections["editReview"])}
                setEditComment={(rev) => setEditComment(rev)}
                setEditCommentSection={() =>
                  setSection(sections["editComment"])
                }
              ></ReviewsAndComments>
            ) : section === 3 ? (
              <Announcements
                setAddNewAnouncementSection={() =>
                  setSection(sections["addNewAnnouncement"])
                }
                setEditAnnouncement={(ann) => setEditAnnouncement(ann)}
                setEditAnnouncementSection={() => {
                  setSection(sections["editAnnouncement"]);
                }}
              ></Announcements>
            ) : section === 4 ? (
              <Promotions
                setAddNewPromotionSection={() =>
                  setSection(sections["addNewPromotion"])
                }
                setEditPromotion={(prom) => setEditPromotion(prom)}
                setEditPromotionSection={() =>
                  setSection(sections["editPromotion"])
                }
              ></Promotions>
            ) : section === 5 ? (
              <Notifications
                setAddNewNotificationSection={() =>
                  setSection(sections["addNewNotification"])
                }
                setEditNotification={(not) => setEditNotification(not)}
                setEditNotificationSection={() =>
                  setSection(sections["editNotification"])
                }
              ></Notifications>
            ) : section === 6 ? (
              <EditReview
                currentReview={editReview}
                getBack={() => setSection(2)}
              ></EditReview>
            ) : section === 7 ? (
              <EditComment
                currentComment={editComment}
                getBack={() => setSection(2)}
              ></EditComment>
            ) : section === 8 ? (
              <EditAnnouncement
                getBack={() => setSection(3)}
                currentAnnouncement={editAnnouncement}
              ></EditAnnouncement>
            ) : section === 9 ? (
              <AddNewAnnouncement getBack={() => setSection(3)} />
            ) : section === 10 ? (
              <EditPromotion
                currentPromotion={editPromotion}
                getBack={() => setSection(4)}
              ></EditPromotion>
            ) : section === 11 ? (
              <AddNewPromotion getBack={() => setSection(4)}></AddNewPromotion>
            ) : section === 12 ? (
              <EditNotification
                currentNotification={editNotification}
                getBack={() => setSection(5)}
              ></EditNotification>
            ) : section === 13 ? (
              <AddNewNotification
                getBack={() => setSection(5)}
              ></AddNewNotification>
            ) : section === 14 ? (
              <EditUser
                currentUser={editUser}
                getBack={() => setSection(1)}
              ></EditUser>
            ) : section === 15 ? (
              <AddNewUser getBack={() => setSection(1)}></AddNewUser>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    dashboardMenuOpened: state.dashboardMenuOpened,
    ...ownProps,
  };
}

export default connect(mapp)(AdminDashboard);
