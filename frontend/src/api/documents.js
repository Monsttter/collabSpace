const baseUrl = process.env.REACT_APP_API_URL+"/docs";

export const fetchDocuments = async () => {
  const response = await fetch(baseUrl + "/", {
    headers: { "auth-token": localStorage.getItem("token") },
  });
  const data = await response.json();
  return data;
};

export const createDocument = async (title) => {
  const response = await fetch(baseUrl + "/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({ title, content: "" }),
  });
  const data = await response.json();
  return data;
};

export const shareDocument = async (id, email) => {
  await fetch(baseUrl + "/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({ document_id: id, email }),
  });
};

export const fetchDocument = async (docId) => {
  const response = await fetch(`${baseUrl}/${docId}`, {
    method: "GET",
    headers: {
      "auth-token": localStorage.getItem("token"),
    },
  });
  const data = await response.json();
  return data;
};

export const updateDocument = async (docId, html) => {
  await fetch(`${baseUrl}/${docId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
    body: JSON.stringify({ content: html }),
  });
};
