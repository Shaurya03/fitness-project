export const settingsReducer = (state, action) => {
  switch (action.type) {

    case "SET_SETTINGS":
      return {
        settings: action.payload
      };

    case "UPDATE_SETTINGS":
      return {
        settings: action.payload
      };

    default:
      return state;
  }
};