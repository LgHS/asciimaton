import * as actions from "../actions/actions";

const initialState = {
  asciimatonOutput: null,
  webcamOutput: null,

};

const picture = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_WEBCAM_OUTPUT:
      return {
        ...state,
        webcamOutput: action.picture
      };
      break;
    case actions.REMOVE_WEBCAM_OUTPUT:
      return {
        ...state,
        webcamOutput: null
      };
      break;
    case actions.SET_ASCIIMATON_OUTPUT:
      return {
        ...state,
        asciimatonOutput: action.picture
      }
      break;
  }
  return state;
};

export default picture;