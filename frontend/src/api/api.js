const API_URL = process.env.REACT_APP_API_URL;

async function api(url, options = {}) {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}${url}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",

                ...(token && {
                    "auth-token": token,
                }),

                ...options.headers,
            },
        }
    );

    if (response.status === 401) {

        localStorage.removeItem("token");

        window.location.href = "/login";

        return;
    }

    return response.json();
}

export default api;