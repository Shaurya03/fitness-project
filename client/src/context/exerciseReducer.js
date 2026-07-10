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

    case "UPDATE_EXERCISE":
      return {
        exercises: state.exercises.map((exercise) =>
          exercise._id === action.payload._id
            ? action.payload
            : exercise
        )
      };

    case "DELETE_EXERCISE":
      return {
        exercises: state.exercises.filter(
          exercise => exercise._id !== action.payload
        )
      };

    default:
      return state;
  }
};