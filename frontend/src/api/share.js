import api from "./api";

export const getCollaborators = async (documentId) => {
  const res = await api("/documents/" + documentId + "/members");

  return res.data;
};

export const shareDocument = async (id, email, role) => {
  const res= await api("/documents/" + id + "/share", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
  return res.data;
};

export async function updateCollaboratorRole(documentId, userId, role) {

  const result = await api(`/documents/${documentId}/members/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({
      role,
    }),
  });

  return result.data;
}

export async function removeCollaborator(documentId, userId) {
  const result = await api(`/documents/${documentId}/members/${userId}`, {
    method: "DELETE",
  });

  return {
    userId,
    ...result,
  };
}
