import { combineReducers } from "redux";

import ui from './ui';
import stateMachine from "./state-machine";
import asciimaton from "./asciimaton";

// main reducers
export const reducers = combineReducers({
  asciimaton: asciimaton,
  stateMachine,
  ui,
});
