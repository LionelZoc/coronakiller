import userSagas from "./userSagas";
import gameSagas from "./gameSagas";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([userSagas(), gameSagas()]);
}
