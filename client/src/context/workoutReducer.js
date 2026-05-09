export const workoutReducer = (state, action) => {
  switch (action.type) {
    case 'SET_WORKOUTS':
      return {
        workouts: action.payload
      };

    case 'CREATE_WORKOUT':
      return {
        workouts: [action.payload, ...state.workouts]
      };

    case 'UPDATE_WORKOUT':
      return {
        workouts: state.workouts.map(workout =>
          workout._id === action.payload._id
            ? action.payload
            : workout
        )
      };

    case 'DELETE_WORKOUT':
      return {
        workouts: state.workouts.filter(
          (workout) => workout._id !== action.payload._id
        )
      };

    default:
      return state;
  }
};