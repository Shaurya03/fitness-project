export const exerciseReducer = (state, action) => {
  switch (action.type) {

    case "SET_EXERCISES":
      return {
        exercises: action.payload
      };

    case "CREATE_EXERCISE":
      return {
        exercises: [action.payload, ...state.exercises]
      };

    default:
      return state;
  }
};