export const workoutReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return {
        ...state,
        workouts: action.payload,
        isLoading: false,
        error: null
      };

    case 'CREATE_WORKOUT':
      return {
        ...state,
        workouts: [action.payload, ...state.workouts]
      };

    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(workout =>
          workout._id === action.payload._id
            ? action.payload
            : workout
        )
      };

    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(
          (workout) => workout._id !== action.payload._id
        )
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
};