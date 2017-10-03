import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import ui from './ui';
import stateMachine from "./state-machine";

// main reducers
export const reducers = combineReducers({
  form: formReducer,
  ui,
  stateMachine
});
