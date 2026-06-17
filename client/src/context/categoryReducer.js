export const categoryReducer = (state, action) => {
  switch (action.type) {

    case "SET_CATEGORIES":
      return {
        categories: action.payload
      };

    case "CREATE_CATEGORY":
      return {
        categories: [action.payload, ...state.categories]
      };

    case "UPDATE_CATEGORY":
      return {
        categories: state.categories.map((category) =>
          category._id === action.payload._id
            ? action.payload
            : category
        )
      };

    case "DELETE_CATEGORY":
      return {
        categories: state.categories.filter(
          (category) =>
            category._id !== action.payload._id
        )
      };

    default:
      return state;
  }
};