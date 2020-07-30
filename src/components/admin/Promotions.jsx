import React, { useState, useEffect } from "react";
import { Promotions as data } from "../../Data";
import Select from "../utility/Select";
import Checkbox from "../utility/Checkbox";
import { Emoji } from "emoji-mart";
import Pagination from "../utility/Paigination";
import { BsSearch } from "react-icons/bs";
import date from "date-and-time";
import { Swipeable } from "react-swipeable";

const Promotions = ({
  setEditPromotion,
  setAddNewPromotionSection,
  setEditPromotionSection,
}) => {
  const [action, setAction] = useState("");
  const [type, setType] = useState("");
  const [searchKey, setSearchKey] = useState("Title");
  const [lastVisibleColumn, setLastVisibleColumn] = useState(0);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");

  const statuses = ["Sent", "Drafted", "Deleted"];

  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);

  useEffect(() => {
    setPromotions(data.map((x) => Object.assign({}, x, { selected: false })));
  }, []);

  useEffect(() => {
    let arr = [...promotions];
    if (promotions.length) {
      if (search) {
        if (searchKey === "Title") {
          arr = arr.filter((x) => x.title.match(new RegExp(search, "i")));
        } else if (searchKey === "Review") {
          arr = arr.filter((x) => x.review.match(new RegExp(search, "i")));
        } else if (searchKey === "Review or Comment") {
          arr = arr.filter((x) =>
            x.type === "review"
              ? x.review.match(new RegExp(search, "i"))
              : x.comment.match(new RegExp(search, "i"))
          );
        } else if (searchKey === "Movie") {
          arr = arr.filter((x) => x.movie_title.match(new RegExp(search, "i")));
        } else if (searchKey === "Status") {
          arr = arr.filter((x) =>
            x.active_status.match(new RegExp(search, "i"))
          );
        }
      }

      if (typeFilter) {
        arr = arr.filter((x) => x.type.match(new RegExp(typeFilter, "i")));
      }

      setFilteredPromotions(arr);
    }
  }, [search, typeFilter, promotions]);

  //boundaries for slicing reviews array. (pagination)
  let boundaries = [(page - 1) * 5, (page - 1) * 5 + 5];
  if (boundaries[1] >= filteredPromotions.length) {
    boundaries[1] = boundaries[1] - (boundaries[1] - filteredPromotions.length);
  }

  const columns = ["Review Or Comment", "Status", "Movie Name", "Duration"];
  const searchOptions = ["Title", "Review or Comment", "Status", "Movie"];

  return (
    <div className="row no-gutters p-md-5 p-4">
      <div className="col-60 border-bottom">
        <div className="row no-gutters justify-content-between">
          <div className="col-auto py-3">
            <div className="row no-gutters h3">Promotions List</div>
            <div className="row no-gutters">Edit, add and delete promtions</div>
          </div>
          <div
            className="col-auto btn-custom btn-custom-primary"
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
              <div className="col-auto">All ({promotions.length})</div>
              {statuses.map((x) => (
                <React.Fragment>
                  <div className="col-auto px-2 text-muted">|</div>
                  <div className="col-auto">
                    {x} ({promotions.filter((y) => y.status === x).length})
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="row no-gutters justify-content-between">
              <div className="col-sm-auto col-60">
                <div className="row no-gutters">
                  <div className="col-60 col-sm-auto pb-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setAction(["Edit", "Delete"][index])
                        }
                        items={["Edit", "Delete"]}
                        btnName={action ? action : "Select Action"}
                        className="input-light px-3 col-auto mr-sm-3"
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
                      }
                    }}
                    className="d-none d-xl-block btn-custom btn-custom-primary col-auto mr-3 btn-xsmall mb-3"
                  >
                    Apply
                  </div>
                  <div className="col-60 col-sm-auto pb-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setType(["Review", "Comment"][index])
                        }
                        items={["Review", "Comment"]}
                        btnName={type ? type : "Select Type"}
                        className="input-light px-3 col-auto mr-sm-3"
                      ></Select>
                    </div>
                  </div>

                  <div
                    className="d-none d-xl-block btn-custom btn-custom-primary col-auto mb-3 mr-3 btn-xsmall"
                    onClick={() => setTypeFilter(type)}
                  >
                    Apply
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
                    className="d-block d-xl-none btn-custom btn-custom-primary col-60 col-sm-auto mb-3 mr-3 btn-xsmall"
                  >
                    Apply All
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
                          Title
                        </th>
                        <th className="d-table-cell d-xl-none table-header text-truncate">
                          {columns[lastVisibleColumn]}
                        </th>
                        {columns.map((c) => (
                          <th className="d-none d-xl-table-cell table-header text-truncate">
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
                                {x.title}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 0
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.type === "review" ? (
                                  <div>
                                    <div className="d-flex">
                                      <div className="mr-3">Rating:</div>
                                      <div style={{ marginBottom: "-6px" }}>
                                        <Emoji
                                          emoji={
                                            x.rating === "Excellent"
                                              ? "fire"
                                              : x.rating === "Good"
                                              ? "heart"
                                              : x.rating === "OK"
                                              ? "heavy_division_sign"
                                              : "shit"
                                          }
                                          set="facebook"
                                          size={24}
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className="text-clamp-4 cursor-pointer user-select-none"
                                      onClick={(e) => {
                                        let target = e.currentTarget;
                                        if (
                                          target.classList.contains(
                                            "text-clamp-4"
                                          )
                                        ) {
                                          target.classList.remove(
                                            "text-clamp-4"
                                          );
                                        } else {
                                          target.classList.add("text-clamp-4");
                                        }
                                      }}
                                    >
                                      {x.review}
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
                                    {x.comment}
                                  </div>
                                )}
                              </td>
                              <td
                                className={`${
                                  x.active_status === "Active"
                                    ? "text-green"
                                    : x.active_status === "Paused"
                                    ? "text-orange"
                                    : "text-danger"
                                } ${
                                  lastVisibleColumn === 1
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.active_status}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 2
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                {x.movie_title}
                              </td>
                              <td
                                className={`${
                                  lastVisibleColumn === 3
                                    ? "d-table-cell"
                                    : "d-none d-xl-table-cell"
                                }`}
                              >
                                <div className="d-flex mb-2">
                                  <div style={{ width: "55px" }}>From:</div>
                                  <div>
                                    <div>
                                      {date.format(
                                        new Date(x.start_date),
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                    <div>
                                      {date.format(
                                        new Date(x.start_date),
                                        "@ hh:mm A"
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex">
                                  <div style={{ width: "55px" }}>To:</div>
                                  <div>
                                    <div>
                                      {date.format(
                                        new Date(x.end_date),
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                    <div>
                                      {date.format(
                                        new Date(x.end_date),
                                        "@ hh:mm A"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={3} className=" text-center py-5">
                            0 results found
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
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
                        {columns.map((c) => (
                          <th className="d-none d-xl-table-cell table-header text-truncate">
                            <div>{c}</div>
                          </th>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </Swipeable>
            </div>
            <div className="row no-gutters justify-content-center justify-content-sm-between">
              <div className="col-60 col-sm-auto">
                <div className="row no-gutters">
                  <div className="col-60 col-sm-auto pb-3">
                    <div className="row no-gutters">
                      <Select
                        popoverClass="col-60 col-sm-auto"
                        onSelect={(index) =>
                          setAction(["Edit", "Delete"][index])
                        }
                        items={["Edit", "Delete"]}
                        btnName={action ? action : "Select Action"}
                        className="input-light px-3 col-auto mr-sm-3"
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
                      }
                    }}
                    className="btn-custom btn-custom-primary col60 col-sm-auto mr-sm-3 btn-xsmall mb-3"
                  >
                    Apply
                  </div>
                </div>
              </div>
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

export default Promotions;
