import Cookies from "js-cookie";

export const getUserData = (): any | null => {
  try {
    const userData = Cookies.get("user");
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from cookies:", error);
    return null;
  }
};