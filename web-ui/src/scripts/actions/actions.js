export const OPEN_SETTINGS = "OPEN_SETTINGS";
export const CLOSE_SETTINGS = "CLOSE_SETTINGS";
export const ENTER_GOD_MODE = "ENTER_GOD_MODE";
export const EXIT_GOD_MODE = "EXIT_GOD_MODE";
export const SET_SOCKET_CONNECTED = "SET_SOCKET_CONNECTED";
export const CHANGE_STATE = "CHANGE_STATE";
export const UPDATE_SOCKET_SETTINGS = "UPDATE_SOCKET_SETTINGS";

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

export function changeState(nextState) {
  return {
    type: CHANGE_STATE,
    state: nextState
  }
}

export function updateSocketSettings(serverData) {
  return {
    type: UPDATE_SOCKET_SETTINGS,
    serverData
  }
}