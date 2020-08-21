import React, { useState, useEffect } from "react";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import { Swipeable } from "react-swipeable";
import {
  GetPromotions,
  DeleteMultiplePromotions,
} from "../../server/DatabaseApi";
import store from "../../store/store";
import { connect } from "react-redux";
import history from "../../History";

const Promotions = ({
  setEditPromotion,
  setAddNewPromotionSection,
  setEditPromotionSection,
  ratings,
}) => {
  const [action, setAction] = useState("");
  const [type, setType] = useState("");
  const [searchKey, setSearchKey] = useState("Description");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [mainFilter, setMainFilter] = useState({ key: "", value: "" });

  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function getData() {
      let data = await GetPromotions();
      if (!data.error) {
        setPromotions(
          data.map((x) => Object.assign({}, x, { selected: false }))
        );
      }
    }

    getData();
  }, [refresh]);

  useEffect(() => {
    let arr = [...promotions];
    if (promotions.length) {
      if (search) {
        if (searchKey === "Description") {
          arr = arr.filter((x) =>
            x.description.toLowerCase().includes(search.toLowerCase())
          );
        } else if (searchKey === "Review") {
          arr = arr.filter(
            (x) =>
              x.content_type === "Review" &&
              x.content.review.toLowerCase().includes(search.toLowerCase())
          );
        }
      }

      if (typeFilter) {
        arr = arr.filter((x) =>
          x.content_type.match(new RegExp(typeFilter, "i"))
        );
      }

      if (mainFilter.key) {
        arr = arr.filter((x) => x[mainFilter.key] === mainFilter.value);
      }

      setFilteredPromotions(arr);
    }
  }, [search, typeFilter, promotions, mainFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  //boundaries for slicing reviews array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredPromotions.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - filteredPromotions.length);
  }

  const columns = ["Review", "Rating", "Duration", "Status"];
  const searchOptions = ["Description", "Review"];

  const publishStatuses = ["Published", "Drafted", "Deleted"];
  return (
    <div className="row no-gutters admin-screen">
      <div className="col-60 border-bottom">
        <div className="row no-gutters justify-content-between pb-3 align-items-end">
          <div className="col-auto">
            <div className="row no-gutters admin-screen-title">
              Promotions List
            </div>
            <div className="row no-gutters">Edit, add and delete promtions</div>
          </div>
          <div
            className="col-auto btn-custom btn-custom-primary btn-natural"
            onClick={() => setAddNewPromotionSection()}
          >
            Add New
          </div>
        </div>
      </div>
      <div className="col-60">
        <div className="row no-gutters">
          <div className="col-60 py-5">
            <div className="row no-gutters h6 mb-3">
              <div
                className={`cursor-pointer col-auto ${
                  mainFilter.key === "" && !typeFilter
                    ? "text-primary"
                    : "text-dark"
                }`}
                onClick={() => {
                  setTypeFilter("");
                  setType("");
                  setMainFilter({ key: "", value: "" });
                }}
              >
                All ({promotions.length})
              </div>
              {publishStatuses.map((x, i) => (
                <React.Fragment key={`status-${i}`}>
                  <div className="col-auto px-2 text-muted">|</div>
                  <div
                    onClick={() =>
                      setMainFilter((prev) =>
                        Object.assign({}, prev, {
                          key: "publish_status",
                          value: x,
                        })
                      )
                    }
                    className={`cursor-pointer col-auto ${
                      mainFilter.key === "publish_status" &&
                      mainFilter.value === x
                        ? "text-primary"
                        : "text-dark"
                    }`}
                  >
                    {x} (
                    {promotions.filter((y) => y.publish_status === x).length})
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="row no-gutters justify-content-between">
              <div className="col-sm-auto col-60">
                <div className="row no-gutters">
                  <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) => setAction(["Delete"][index])}
                        items={["Delete"]}
                        btnName={action ? action : "Select Action"}
                        className="input-light px-3 col-auto"
                      ></Select>
                    </div>
                  </div>
                  <div className="col-60 col-sm-auto pb-3 mr-sm-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setType(["Review", "Comment"][index])
                        }
                        items={["Review", "Comment"]}
                        btnName={type ? type : "Select Type"}
                        className="input-light px-3 col-auto"
                      ></Select>
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      if (action === "Edit") {
                        let selected = filteredPromotions.filter(
                          (x) => x.selected
                        );
                        if (selected.length) {
                          setEditPromotion(selected[0]);
                          setEditPromotionSection();
                        }
                      } else if (action === "Delete") {
                        //delete review
                      } else {
                        setTypeFilter(type);
                      }
                    }}
                    className="btn-custom btn-custom-primary col-60 col-sm-auto mb-3 mr-3 btn-xsmall"
                  >
                    Apply
                  </div>
                </div>
              </div>
              <div className="col-60 d-block d-sm-none">
                <div className="row no-gutters mb-3">
                  <Select
                    popoverClass="w-100"
                    onSelect={(index) => setSearchKey(searchOptions[index])}
                    className="input-light col-60"
                    items={searchOptions}
                    btnName={`Search by ${searchKey}`}
                  ></Select>
                </div>
                <div className="row no-gutters mb-3">
                  <div className="col-60 position-relative">
                    <BsSearch
                      fontSize="20px"
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        right: "18px",
                      }}
                    ></BsSearch>
                    <input
                      className="input-light w-100 pr-5 pl-3"
                      value={search}
                      onChange={(e) => {
                        e.persist();
                        setSearch(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="col-auto mb-3 d-none d-sm-block">
                <div className="row no-gutters">
                  <Select
                    onSelect={(index) => setSearchKey(searchOptions[index])}
                    className="table-input-prepend-select col-auto"
                    items={searchOptions}
                    btnName={`Search by ${searchKey}`}
                  ></Select>
                  <div className="col position-relative">
                    <BsSearch
                      fontSize="20px"
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        margin: "auto",
                        right: "18px",
                      }}
                    ></BsSearch>
                    <input
                      value={search}
                      onChange={(e) => {
                        e.persist();
                        setSearch(e.target.value);
                      }}
                      className="table-input pr-5 pl-3"
                      style={{ minWidth: "300px" }}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <Swipeable
                style={{ minWidth: "100%" }}
                onSwipedLeft={() => {
                  setLastVisibleColumn(
                    lastVisibleColumn + 1 < 4
                      ? lastVisibleColumn + 1
                      : lastVisibleColumn
                  );
                }}
                onSwipedRight={() => {
                  setLastVisibleColumn(
                    lastVisibleColumn - 1 >= 0
                      ? lastVisibleColumn - 1
                      : lastVisibleColumn
                  );
                }}
              >
                <div className="table-responsive">
                  <table className="table bg-white border">
                    <thead>
                      <tr>
                        <th className="text-center">
                          <Checkbox
                            color={"primary"}
                            checked={
                              filteredPromotions
                                .slice(boundaries[0], boundaries[1])
                                .filter((x) => x.selected).length ===
                              boundaries[1] - boundaries[0]
                            }
                            onChange={(e) => {
                              setFilteredPromotions((prev) => {
                                let arr = [...prev];
                                for (
                                  let i = boundaries[0];
                                  i < boundaries[1];
                                  i++
                                ) {
                                  arr[i].selected = e.target.checked;
                                }
                                return arr;
                              });
                            }}
                          ></Checkbox>
                        </th>
                        <th className="table-header text-truncate text-left">
                          Description
                        </th>
                        <th className="d-table-cell d-xl-none table-header text-truncate">
                          {columns[lastVisibleColumn]}
                        </th>
                        {columns.map((c, j) => (
                          <th
                            className="d-none d-xl-table-cell table-header text-truncate"
                            key={`column-${j}`}
                          >
                            <div>{c}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPromotions.length ? (
                        filteredPromotions
                          .slice((page - 1) * 5, (page - 1) * 5 + 5)
                          .map((x, i) => (
                            <tr
                              className="font-weight-600 bg-light"
                              key={`shortlist-item-${i}`}
                            >
                              <td className="text-center">
                                <Checkbox
                                  color={"primary"}
                                  checked={x.selected}
                                  onChange={(e) => {
                                    setFilteredPromotions((prev) => {
                                      let arr = [...prev];
                                      arr[(page - 1) * 5 + i].selected =
                                        e.target.checked;
                                      return arr;
                                    });
                                  }}
                                ></Checkbox>
                              </td>
                              <td style={{ whiteSpace: "nowrap" }}>
                                <div
                                  className="mb-2"
                                  style={{ minWidth: "150px" }}
                                >
                                  {x.description}
                                </div>
                                <div className="d-flex">
                                  <div
                                    className="text-primary underline-link"
                                    onClick={() => {
                                      setEditPromotion(x);
                                      setEditPromotionSection();
                                    }}
                                  >
                                    Edit
                                  </div>
                                  <div className="px-2">|</div>
                                  <div
                                    className="text-danger underline-link"
                                    onClick={async () => {
                                      let res = await DeleteMultiplePromotions(
                                        [x._id],
                                        { status: "Deleted" }
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
                                        store.dispatch({
                                          type: "SET_NOTIFICATION",
                                          notification: {
                                            title: "Promotion was deleted",
                                            message:
                                              "Promotion was successfully deleted",
                                            type: "success",
                                          },
                                        });
                                      }
                                      setRefresh(!refresh);
                                    }}
                                  >
                                    Delete
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 0
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.content_type === "Review" ? (
                                  <div style={{ minWidth: "150px" }}>
                                    <div
                                      className="cursor-pointer user-select-none btn-link"
                                      onClick={(e) => {
                                        history.push(
                                          `/movie/${x.movie_id}/${x.content_id}`
                                        );
                                      }}
                                    >
                                      {x.content.review}
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="text-clamp-4 cursor-pointer user-select-none"
                                    onClick={(e) => {
                                      let target = e.currentTarget;
                                      if (
                                        target.classList.contains(
                                          "text-clamp-4"
                                        )
                                      ) {
                                        target.classList.remove("text-clamp-4");
                                      } else {
                                        target.classList.add("text-clamp-4");
                                      }
                                    }}
                                  >
                                    {x.content.comment}
                                  </div>
                                )}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 1
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.content.rating ? (
                                  <div style={{ marginBottom: "-6px" }}>
                                    <Emoji
                                      emoji={
                                        x.content.rating === "excellent_rate"
                                          ? "fire"
                                          : x.content.rating === "good_rate"
                                          ? "heart"
                                          : x.content.rating === "ok_rate"
                                          ? "heavy_division_sign"
                                          : "shit"
                                      }
                                      set="facebook"
                                      size={24}
                                    />
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 2
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                <div style={{ whiteSpace: "nowrap" }}>
                                  <div className="d-inline-block mr-2">
                                    <div>From: </div>
                                    <div>To: </div>
                                  </div>
                                  <div className="d-inline-block">
                                    <div style={{ whiteSpace: "nowrap" }}>
                                      {date.format(
                                        new Date(x.start_date),
                                        "DD/MM/YYYY @ hh:mm A"
                                      )}
                                      <div style={{ whiteSpace: "nowrap" }}>
                                        {date.format(
                                          new Date(x.end_date),
                                          "DD/MM/YYYY @ hh:mm A"
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`${
                                  x.status === "Published"
                                    ? "text-green"
                                    : x.status === "Drafted"
                                    ? "text-orange"
                                    : "text-danger"
                                } ${
                                  lastVisibleColumn === 3
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.status === "Published"
                                  ? "Active"
                                  : x.status === "Drafted"
                                  ? "Inactive"
                                  : x.status}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={6} className=" text-center py-5">
                            0 results found
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {/* <tfoot>
                      <tr>
                        <th className="text-center">
                          <Checkbox
                            color={"primary"}
                            checked={
                              filteredPromotions
                                .slice(boundaries[0], boundaries[1])
                                .filter((x) => x.selected).length ===
                              boundaries[1] - boundaries[0]
                            }
                            onChange={(e) => {
                              setFilteredPromotions((prev) => {
                                let arr = [...prev];
                                for (
                                  let i = boundaries[0];
                                  i < boundaries[1];
                                  i++
                                ) {
                                  arr[i].selected = e.target.checked;
                                }
                                return arr;
                              });
                            }}
                          ></Checkbox>
                        </th>
                        <th className="table-footer text-truncate text-left">
                          Title
                        </th>
                        <th className="d-table-cell d-xl-none table-header text-truncate">
                          {columns[lastVisibleColumn]}
                        </th>
                        {columns.map((c, j) => (
                          <th
                            className="d-none d-xl-table-cell table-header text-truncate"
                            key={`footer-column-${j}`}
                          >
                            <div>{c}</div>
                          </th>
                        ))}
                      </tr>
                    </tfoot> */}
                  </table>
                </div>
              </Swipeable>
            </div>
            <div className="row no-gutters justify-content-center justify-content-sm-end">
              <div className="col-auto">
                <Pagination
                  count={Math.ceil(filteredPromotions.length / 5)}
                  current={page}
                  setCurrent={setPage}
                ></Pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(Promotions);
