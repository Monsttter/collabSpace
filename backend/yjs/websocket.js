// import { WebSocketServer } from "ws";
// import sessionManager from "./SessionManager.js";

// const wss = new WebSocketServer({ port: 1234 });

// wss.on("connection", async (conn, req) => {

//     const documentId = getDocumentId(req);

//     const session =
//         await sessionManager.getOrCreate(documentId);

//     session.addConnection(conn);

//     // Hook Yjs sync here (we'll replace the default getYDoc with session.ydoc)

//     conn.on("close", async () => {

//         session.removeConnection(conn);

//         if (session.connectionCount === 0) {

//             // We'll add compaction here later

//             session.destroy();

//             sessionManager.delete(documentId);

//         }

//     });

// });