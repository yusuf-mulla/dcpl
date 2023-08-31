import "./MyFevorite.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { img_300 } from "./Home";
import { Button, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TablePagination from "@mui/material/TablePagination";
import { Toaster } from "../Re-UsebleComp/Toaster";

// main (parent) function //
export const MyFevorite = () => {

  // redux hook use for manage state at aplication lavel//
  const select = useSelector((state) => state);
  const dispatch = useDispatch();

  // navigate use for component navigateion //
  const navigate = useNavigate();

  // fevorite API data receive from reducer page (redux)//
  const fevoriteData = select.ProductReducer.addFevorite;
  const searchData = select.ProductReducer.searchData;

  //useState hook use for fevorite item show on UI state manage //
  const [fevorite, setFevorite] = useState(fevoriteData);

  //useState hook use for pagination state manage //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // varibale for pagination //
  const arrayLength = rowsPerPage * page + rowsPerPage;
  const arrayIndex = arrayLength - rowsPerPage;

  // function for pagination //
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // function for remove item from fevorite, data stored in reducer page //
  const handleRemoveFevorite = (item) => {
    const res = fevoriteData.filter((elem, index) => elem.id !== item.id);
    Toaster(false, "Item Remove From Fevorite");
    dispatch({
      type: "ADD_FEVORITE",
      payload: res,
    });
    setFevorite(res);
  };
  // useEffect hook for fevorite API data , component did update //
  useEffect(() => {
    setFevorite(fevoriteData);
  }, []);

  // useEffect hook for search item filtered and update into state, component did update //
  useEffect(() => {
    const searchItem = fevoriteData.filter((item) =>
      item.title.toUpperCase().includes(searchData.toUpperCase())
    );
    setFevorite(searchItem);
  }, [searchData]);

  return (
    <div className="fevorite_container">
      {/* <div className="fevorite_data_container"> */}
        {fevoriteData.length <= 0 ? (
          <div className="empty_error">
          <h1 className="Fevorite_Empty">
            EMPTY
            <Button variant="contained" onClick={() => navigate("/")}>
              Go Back
            </Button>
          </h1>
          </div>
        ) : fevorite.length <= 0 ? (
          <>
            {" "}
            <div className="error_container">
            <h1 className="search_result2">
              RESULT NOT FOUND{" "}
              <Button
                variant="contained"
                onClick={() => setFevorite(fevoriteData)}
              >
                Go Back
              </Button>
            </h1>
            </div>
          </>
        ) : (
          <div className="data_container2">
            {/* <Grid container spacing={3}> */}
              {fevorite &&
                fevorite.slice(arrayIndex, arrayLength).map((item, ind) => {
                  return (
                    // <div className="card2">
                      <div className="cardContain2">
                        <div className="image-container">
                          <img
                            alt=""
                            src={
                              item.poster_path
                                ? `${img_300}/${item.poster_path}`
                                : "unavailable"
                            }
                          />
                          <i className="icon">
                            <CloseIcon
                              className="close_icon"
                              onClick={() => handleRemoveFevorite(item)}
                            />
                          </i>
                        </div>
                        <div className="tital_container2">
                          <div className="title2">
                            <b>
                              {item.title.substring(0, 18)}
                              {item.title.length > 18 && "..."}
                            </b>
                          </div>
                          <div className="year_and_rettings2">
                            <i>
                              Release Year: {item.release_date.substring(0, 4)}
                            </i>
                            <span className="rating">{item.vote_average}</span>
                          </div>
                        </div>
                       </div>
                    // </div>
                  );
                })}
            {/* </Grid> */}
          </div>
        )}
         {fevoriteData.length <= 0 || fevorite.length <= 0 ? (
          ""
        ) : (
          <div className="pagination_container">
            <div className="pagination">
              <TablePagination
                rowsPerPageOptions={[2, 5, 10, 20, 30]}
                component="div"
                count={fevorite.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        )} 
      {/* </div> */}
    </div>
  );
};
