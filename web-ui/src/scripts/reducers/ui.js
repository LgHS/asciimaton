import * as actions from "../actions/actions";

const initialState = {
  godMode: false,
  settingsModalOpened: false,
  isSocketConnected: false
};

const ui = (state = initialState, action) => {
  switch(action.type) {
    case actions.OPEN_SETTINGS:
      return {
        ...state,
        settingsModalOpened: true
      };
      break;
    case actions.CLOSE_SETTINGS:
      return {
        ...state,
        settingsModalOpened: false
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
  }
  return state;
};

export default ui;