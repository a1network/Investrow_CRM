import axios from "../helpers/axios";
import { authConstants } from "./constants";
import { leadConstants } from "./constants";

export const login = (user) => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGIN_REQUEST });
    await axios
      .post("/login", { ...user })
      .then((response) => {
        console.log("This is response from Login", response);
        if (response.status === 200) {
          const { token, user } = response.data;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          dispatch({
            type: authConstants.LOGIN_SUCCESS,
            payload: { token, user },
          });
        }
      })
      .catch(function (error) {
        alert(error.response.data);
        console.log("Error from Login", error.response.data);
        /* dispatch({
          type: authConstants.LOGIN_PASS_ERROR,
          payload: { message: error.response.data.message },
        }); */
      });
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });
    /* const res = await axios.post("/logout");

    if (res.status === 200) { */
    localStorage.clear();
    dispatch({
      type: authConstants.LOGOUT_SUCCESS,
    });
    dispatch({
      type: leadConstants.LOGOUT_LEAD_SUCCESS,
    });
    /* } else {
      dispatch({
        type: authConstants.LOGOUT_FAILURE,
        payload: { error: res.data.error },
      });
    } */
  };
};
