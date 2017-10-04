export const OPEN_SETTINGS = "OPEN_SETTINGS";
export const CLOSE_SETTINGS = "CLOSE_SETTINGS";
export const ENTER_GOD_MODE = "ENTER_GOD_MODE";
export const EXIT_GOD_MODE = "EXIT_GOD_MODE";
export const SET_SOCKET_CONNECTED = "SET_SOCKET_CONNECTED";
export const CHANGE_STATE = "CHANGE_STATE";
export const UPDATE_SOCKET_SETTINGS = "UPDATE_SOCKET_SETTINGS";
export const UPDATE_WEBCAM_SETTINGS = "UPDATE_WEBCAM_SETTINGS";
export const SET_WEBCAM_OUTPUT = "SET_WEBCAM_OUTPUT";
export const REMOVE_WEBCAM_OUTPUT = "REMOVE_WEBCAM_OUTPUT";
export const SET_ASCIIMATON_OUTPUT = "SET_ASCIIMATON_OUTPUT";

export function openSettings() {
  return { type: OPEN_SETTINGS };
}

export function closeSettings() {
  return { type: CLOSE_SETTINGS };
}

export function enterGodMode() {
  return { type: ENTER_GOD_MODE };
}

export function exitGodMode() {
  return { type: EXIT_GOD_MODE };
}

export function setSocketConnected(isSocketConnected) {
  return { type: SET_SOCKET_CONNECTED, isSocketConnected };
}

export function changeState(nextState, payload) {
  return {
    type: CHANGE_STATE,
    state: nextState,
    payload: payload ? payload : {}
  }
}

export function updateSocketSettings(serverData) {
  return {
    type: UPDATE_SOCKET_SETTINGS,
    serverData
  }
}

export function updateWebcamSettings(webcamData) {
  return {
    type: UPDATE_WEBCAM_SETTINGS,
    webcamData
  }
}

export function setWebcamOutput(picture) {
  return {
    type: SET_WEBCAM_OUTPUT,
    picture
  }
}

export function removeWebcamOutput() {
  return {
    type: REMOVE_WEBCAM_OUTPUT
  };
}

export function setAsciimatonOutput(picture) {
  return {
    type: SET_ASCIIMATON_OUTPUT,
    picture
  };
}