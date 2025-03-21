import { authConstants } from "../actions/constants";

// ✅ Load token & user from localStorage
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const initState = {
  token: token || null,  // Load token from localStorage
  user: user || { user_id: "", name: "", email: "", role: "", mob: "" }, // Load user data
  authenticate: !!token, // If token exists, user is authenticated
  authenticating: false,
  loading: false,
  error: null,
  message: null,
};

export const authReducer = (state = initState, action) => {
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return {
        ...state,
        authenticating: true,
      };

    case authConstants.LOGIN_SUCCESS:
      // ✅ Save token & user to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
      };

    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
      };

    case authConstants.LOGIN_PASS_ERROR:
      return {
        ...state,
        message: action.payload.message,
      };

    case authConstants.LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case authConstants.LOGOUT_SUCCESS:
      // ✅ Clear localStorage on logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return {
        ...initState,
      };

    case authConstants.LOGOUT_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };

    default:
      return state;
  }
};
