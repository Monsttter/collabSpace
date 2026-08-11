import api from "./api";


export const fetchDocuments = async () => {
  return api("/documents/");
};

export const createDocument = async (title) => {
  return api("/documents/", {
        method: "POST",
        body: JSON.stringify({ title }),
    });
};

export const shareDocument = async (id, email, role) => {
  return api("/documents/"+id+"/share", {
        method: "POST",
        body: JSON.stringify({ email, role }),
    });
};

export const fetchDocument = async (docId) => {
  return api("/documents/"+docId);
};

export const updateDocumentTitle = async (docId, title) => {
  return api("/documents/"+docId, {
      method: "PATCH",
      body: JSON.stringify({ title })
  });
};

