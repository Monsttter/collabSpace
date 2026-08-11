import api from "./api";

export const loginUser = async (email, password) => {
  return api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
};

export const registerUser = async (username, email, password) => {
  return api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
};


export const getUser = async () => {
  return api("/auth/me");
};
