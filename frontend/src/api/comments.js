import api from "./api";

export async function createComment(documentId, data) {
  const res = await api(`/documents/${documentId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  return res;
}

export async function fetchComments(documentId) {
  const res = await api(`/documents/${documentId}/comments`);

  return res;
}

export async function createReply(commentId, message) {
  const res = await api(
    `/comments/${commentId}/replies`,

    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );

  return res;
}
export async function fetchReplies(commentId) {
  const res = await api(
    `/comments/${commentId}/replies`,
  );
  
  return res;
}

export async function setCommentResolved(commentId, resolved) {
  const res = await api(`/comments/${commentId}/resolve`, {
    method: "PATCH",
    body: JSON.stringify({ resolved }),
  });

  return res;
}

export async function deleteComment(commentId) {
  const res= await api(`/comments/${commentId}`, {
    method: "DELETE",
  });
  return res;
}

export async function deleteReply(replyId) {
  const res= await api(`/comments/replies/${replyId}`, {
    method: "DELETE",
  });
  return res;
}

export async function updateComment(commentId, message) {
  const res = await api(
    `/comments/${commentId}`,

    {
      method: "PATCH",
      body: JSON.stringify({ message }),
    },
  );

  return res;
}
export async function updateReply(replyId, message) {
  const res = await api(
    `/comments/replies/${replyId}`,

    {
      method: "PATCH",
      body: JSON.stringify({ message }),
    },
  );

  return res;
}