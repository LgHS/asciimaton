import * as actions from "../actions/actions";

const initialState = {
  godMode: false,
  isSettingsModalOpened: false,
  isSocketConnected: false,
  socketServer: {
    url: 'localhost',
    port: '54321'
  },
  webcam: {
    width: 768,
    height: 1024,
    horizontal_crop: 30,
    vertical_crop: 30,
  },
};

const ui = (state = initialState, action) => {
  switch(action.type) {
    case actions.OPEN_SETTINGS:
      return {
        ...state,
        isSettingsModalOpened: true
      };
      break;
    case actions.CLOSE_SETTINGS:
      return {
        ...state,
        isSettingsModalOpened: false
      };
      break;
    case actions.ENTER_GOD_MODE:
      return {
          ...state,
        godMode: true
      };
      break;
    case actions.EXIT_GOD_MODE:
      return {
          ...state,
        godMode: false
      };
      break;
    case actions.SET_SOCKET_CONNECTED:
      return {
          ...state,
        isSocketConnected: action.isSocketConnected
      };
      break;
    case actions.UPDATE_SOCKET_SETTINGS:
      return {
        ...state,
        socketServer: action.serverData
      };
      break;
    case actions.UPDATE_WEBCAM_SETTINGS:
      return {
        ...state,
        webcam: action.webcamData
      };
      break;
  }
  return state;
};

export default ui;