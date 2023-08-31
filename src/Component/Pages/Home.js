import "./Home.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button} from "@mui/material";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import TablePagination from "@mui/material/TablePagination";
import { Toaster } from "../Re-UsebleComp/Toaster";

// image URL for show image //
export const img_300 = "https://image.tmdb.org/t/p/w300";

// main (parent) function //
export const Home = () => {
  // redux hook use for manage state at aplication lavel//
  const select = useSelector((state) => state);
  const dispatch = useDispatch();

  // navigate use for component navigateion //
  const navigate = useNavigate();

  // API data receive from reducer page ( redux)//
  const takApi = select.ProductReducer.getApi;
  const searchData = select.ProductReducer.searchData;

  // API URL (Link) with key
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=99cf28b7b37e4da598848ee6fcb5555f&page=`;

  //useState hook use for API state manage  and show on UI//
  const [state, setState] = useState([]);
  const [copyState, setCopyState] = useState([]);
  // state manage for item add and remove by using redux//
  const [fevorite, setFevorite] = useState(select.ProductReducer.addFevorite);

  // useState hook use for  pagination state manage //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  // pagination variable //
  const arrayLength = rowsPerPage * page + rowsPerPage;
  const arrayIndex = arrayLength - rowsPerPage;

  // fetch API by using axiox library and disptach data into reducer page (Redux) //
  const fetchAndFilterAllPages = async () => {
    const getApiData = [];
    const page = 10;
    for (let pageNumber = 1; pageNumber <= page; pageNumber++) {
      const response = await axios.get(apiUrl, pageNumber);
      getApiData.push(...response.data.results);
      const allFilteredData = getApiData.filter(
        (item, index, array) =>
          array.findIndex((elem, ind) => elem.id == item.id) === index
      );
  

      dispatch({
        type: "GET_API",
        payload: allFilteredData,
      });
    }

    return getApiData;
  };

  // function for navigate back page //
  const handleNavigateBack = (value) => {
    navigate(value - 1);
  };

  // function for pagination //
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // function for add or remove item from fevorite //
  const handleAddFevorite = (item) => {
    const isFevorite = fevorite.some((elem) => elem.id == item.id);
    if (!isFevorite) {
      setFevorite([...fevorite, item]);
      Toaster(true, "Item Add to Fevorite");
      dispatch({
        type: "ADD_FEVORITE",
        payload: [...fevorite, item],
      });
    }
  };
  const handleRemoveFevorite = (item) => {
    const res = fevorite.filter((elem, index) => elem.id !== item.id);
    setFevorite(res);
    Toaster(false, "Item Remove from Fevorite");
    dispatch({
      type: "ADD_FEVORITE",
      payload: res,
    });
  };

  // useEffect hook for fetch api did update //
  useEffect(() => {
    fetchAndFilterAllPages();
  }, []);

  // useEffect hook for API call, component did update //
  useEffect(() => {
    setState(takApi);
  }, [takApi]);
  useEffect(() => {
    setCopyState(takApi);
  }, [takApi]);

  // useEffect hook for search item filtered and update into state, component did update //
  useEffect(() => {
    const res = copyState.filter((item) =>
      item.title.toUpperCase().includes(searchData.toUpperCase())
    );
    setState(res);
  }, [searchData]);

  return (
    <div className="main_container">
      {state.length <= 0 ? (
        <>
          {" "}
          <h1 className="search_result">
            RESULT NOT FOUND{" "}
            <Button variant="contained" onClick={handleNavigateBack}>
              Go Back
            </Button>
          </h1>
        </>
      ) : (
        <>
          <div className="heading_container">
            <div className="heading">
              <b>Most complete movie information search engine...</b>
            </div>
            <div className="paragraph">
              <p>
                Your Gateway to a Universe of Movies Awaits! Immerse Yourself in
                a Seamless Movie Search Experience that Puts the Magic of Cinema
                at Your Fingertips.
              </p>
              <p>
                Your One-Stop Destination for Movie Exploration and Discovery.
                Dive into a Vast Collection of Films from Every Genretion, Era,
                and Corner of the Globe. Find, Watch, and Enjoy with Our
                Intuitive Movie Searching Website.
              </p>
            </div>
          </div>
          <div className="data_container">
            {state &&
              state.slice(arrayIndex, arrayLength).map((item, ind) => {
                return (
                  <div className="cardContain">
                    <img
                      alt=""
                      src={
                        item.poster_path ? `${img_300}/${item.poster_path}` : ""
                      }
                    />
                    <div className="tital_container">
                      <div className="title">
                        <b>
                          {item.title.substring(0, 18)}
                          {item.title.length > 18 && "..."}
                        </b>
                        {fevorite.some((elem) => elem.id === item.id) ? (
                          <BookmarkOutlinedIcon
                            className="bookmark-icon"
                            onClick={() => handleRemoveFevorite(item)}
                          />
                        ) : (
                          <BookmarkBorderOutlinedIcon
                            className="bookmark-icon"
                            onClick={() => handleAddFevorite(item)}
                          />
                        )}
                      </div>
                      <div className="year_and_rettings">
                        <i>Release Year: {item.release_date.substring(0, 4)}</i>
                        <span className="rating">{item.vote_average}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      {state.length <= 0 ? (
        ""
      ) : (
        <div className="pagination_container">
          <div className="pagination">
            <TablePagination
              rowsPerPageOptions={[2, 4, 6, 10, 20]}
              component="div"
              count={state.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
