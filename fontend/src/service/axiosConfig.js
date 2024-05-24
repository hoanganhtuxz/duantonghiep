import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/`,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

const refreshToken = () => {
  return axiosClient.get("/v1/refresh", { withCredentials: true });
};

const getUserInfo = async () => {
  try {
    const response = await axiosClient.get("/v1/user", {
      withCredentials: true,
    });
    if (response.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      }
    }
  } catch (error) {
    console.error("Failed to fetch user information:", error);
  }
};

const redirectToLogin = () => {
  if (!isRedirecting) {
    isRedirecting = true;
    window.location.href = "/login";
  }
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 400 &&
      error.response.data.message?.includes("Json web token is expired") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshToken();
        await getUserInfo();
        return axiosClient(originalRequest);
      } catch (refreshError) {
        if (
          error.response.status === 400 &&
          error.response.data.message?.includes("Please login to access")
        ) {
          redirectToLogin();
          return Promise.reject(error);
        }
        return Promise.reject(refreshError);
      }
    }
    if (
      error.response.status === 400 &&
      error.response.data.message?.includes("Please login to access")
    ) {
      redirectToLogin();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
