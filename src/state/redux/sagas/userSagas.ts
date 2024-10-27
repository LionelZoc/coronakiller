import {
  take,
  put,
  call,
  takeEvery,
  all,
  delay,
  select,
  fork,
} from "redux-saga/effects";
import get from "lodash/get";

import { CREATE_PROFILE } from "state/redux/actionTypes";
import { setRequestStatus } from "state/redux/actions";
import services from "utils/firestoreHelpers";

function* handleCreateProfile({ payload }) {
  yield put(
    setRequestStatus({
      id: payload.storeAs,
      status: "pending",
    })
  );

  const result = yield call(services.createProfile, payload);

  if (result) {
    yield put(
      setRequestStatus({
        id: payload.storeAs,
        status: "error",
      })
    );
  }
  yield;
}
export default function* userSaga() {
  yield all([yield takeEvery(CREATE_PROFILE, handleCreateProfile)]);
}
