const baseUrl = process.env.REACT_APP_API_URL+"/auth";

export const loginUser = async (email, password) => {
  const response = await fetch(baseUrl + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data;
};

export const registerUser = async (username, email, password) => {
  const response = await fetch(baseUrl + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await response.json();
  return data;
};


export const getUser = async () => {
  const response = await fetch(baseUrl + "/me", {
    method: "GET",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  });
  const data = await response.json();
  return data;
};
