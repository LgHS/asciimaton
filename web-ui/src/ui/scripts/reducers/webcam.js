import * as actions from "../actions/actions";
import * as webcamActions from "../actions/webcamActions";
import {INCREASE_BRIGHTNESS} from "../actions/webcamActions";

const initialState = {
  // width: 1024 / 1.414, // A4
  width: 768,
  height: 1024,
  horizontal_crop: 30,
  vertical_crop: 30,
  brightnessModifier: 8,
  contrastModifier: -2,
};

const webcam = (state = initialState, action) => {
  switch(action.type) {
    case actions.UPDATE_WEBCAM_SETTINGS:
      return {
        ...state,
        ...action.webcamData
      };
      break;
    case webcamActions.INCREASE_BRIGHTNESS:
      return {
        ...state,
        brightnessModifier: state.brightnessModifier + 1
      };
      break;
    case webcamActions.DECREASE_BRIGHTNESS:
      return {
        ...state,
        brightnessModifier: state.brightnessModifier - 1
      };
      break;
    case webcamActions.INCREASE_CONTRAST:
      return {
        ...state,
        contrastModifier: state.contrastModifier + 1
      };
      break;
    case webcamActions.DECREASE_CONTRAST:
      return {
        ...state,
        contrastModifier: state.contrastModifier - 1
      };
      break;
  }
  return state;
};

export default webcam;
