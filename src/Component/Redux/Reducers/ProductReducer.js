const initialState = {
  getApi: [],
  searchData: "",
  addFevorite: [],
  userInfo: {},
  isActive: null,
};
export const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_API":
      return {
        ...state,
        getApi: action.payload,
      };
      break;
    case "TAKE_SEARCH_DATA":
      return {
        ...state,
        searchData: action.payload,
      };
      break;
    case "ADD_FEVORITE":
      return {
        ...state,
        addFevorite: action.payload,
      };
      break;
    case "USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
      };
      break;
    case "USER_ACTIVE":
      return {
        ...state,
        isActive: action.payload,
      };
      break;
  }

  return state;
};
