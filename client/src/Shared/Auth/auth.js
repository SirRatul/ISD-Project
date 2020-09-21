import { Cookies } from "react-cookie";

export default {
  authMessage: "",
  tempToken: "",
  isLoggedIn: new Cookies().get("isLoggedIn") || false,
  userId: new Cookies().get("userId") || null,
  token: new Cookies().get("token") || null,
  firstName: new Cookies().get("firstName") || null,
  userRole: new Cookies().get("userRole") || null,
  googleSignedIn: new Cookies().get("googleSignedIn") || false,
};
