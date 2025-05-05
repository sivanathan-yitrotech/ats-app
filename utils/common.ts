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

export const getUserToken = (): any | null => {
  try {
    const userData = Cookies.get("token");
    return userData ? userData : null;
  } catch (error) {
    console.error("Error parsing token from cookies:", error);
    return null;
  }
};

export const ucFirst = (val: string): string => {
  if (!val) return "";
  return val.charAt(0).toUpperCase() + val.slice(1);
};