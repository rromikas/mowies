import React, { useState } from "react";
import LeftSideMenu from "./LeftSideMenu";
import Settings from "./Settings";
import UserManagement from "./UserManagement";
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
};

const AdminDashboard = () => {
  const [section, setSection] = useState(0);
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [editComment, setEditComment] = useState(null);
  const [editAnnouncement, setEditAnnouncement] = useState(null);
  const [editPromotion, setEditPromotion] = useState(null);
  const [editNotification, setEditNotification] = useState(null);
  return (
    <div className="row no-gutters" style={{ minHeight: window.innerHeight }}>
      <div className="col-60">
        <div
          style={{ height: "108px", width: "100%" }}
          className="row no-gutters"
        >
          <div
            className="col-auto d-none d-lg-block bg-dark"
            style={{ width: "350px" }}
          ></div>
          <div className="col bg-light"></div>
        </div>

        <Navbar
          setIsMenuOpened={setIsMenuOpened}
          isMenuOpened={isMenuOpened}
        ></Navbar>

        <div className="row no-gutters h-100 position-relative bg-light">
          <RightSideMenuFloating
            isMenuOpened={isMenuOpened}
            setMenu={setIsMenuOpened}
            setSection={setSection}
            section={section}
          ></RightSideMenuFloating>
          <div
            className="col-auto d-none d-lg-block"
            style={{ width: "350px" }}
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
              <UserManagement></UserManagement>
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
              <EditReview currentReview={editReview}></EditReview>
            ) : section === 7 ? (
              <EditComment currentComment={editComment}></EditComment>
            ) : section === 8 ? (
              <EditAnnouncement
                currentAnnouncement={editAnnouncement}
              ></EditAnnouncement>
            ) : section === 9 ? (
              <AddNewAnnouncement />
            ) : section === 10 ? (
              <EditPromotion currentPromotion={editPromotion}></EditPromotion>
            ) : section === 11 ? (
              <AddNewPromotion></AddNewPromotion>
            ) : section === 12 ? (
              <EditNotification
                currentNotification={editNotification}
              ></EditNotification>
            ) : section === 13 ? (
              <AddNewNotification></AddNewNotification>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
