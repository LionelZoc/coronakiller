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

import { UPDATE_BEST_SCORE, GET_BEST_SCORE } from "state/redux/actionTypes";
import { setRequestStatus } from "state/redux/actions";
import * as services from "utils/firestoreHelpers";
function* handleUpdateBestCore({ payload }) {
  try {
    //yield put(actions.startLoading());
    //storeAs should be property_list

    //fetch properties

    //const query = {}
    //payload must contain fromChat, limit, isFirebaseConnected, user, storeAs
    yield put(
      setRequestStatus({
        id: payload.storeAs,
        status: "pending",
      })
    );
    const result = yield call(services.updateScore, payload);

    if (result) {
      yield put(
        setRequestStatus({
          id: payload.storeAs,
          status: "error",
        })
      );
    }
  } catch (e) {
    //remove this
    //yield put(actions.fetchPropertiesFail(e));
    //yield put(showError(e.message));
    console.log(e);
    yield put(
      setRequestStatus({
        id: payload.storeAs,
        status: "error",
      })
    );
  }
}
export default function* gameSaga() {
  yield all([yield takeEvery(UPDATE_BEST_SCORE, handleUpdateBestCore)]);
  //yield all([yield takeEvery(GET_BEST_SCORE, handleGetBestScore)]);
}
