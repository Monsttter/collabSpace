import pool from "../config/db.js";

class DocumentPersistenceRepository {

    async getSnapshot(documentId) {

    const { rows } = await pool.query(

        `
        SELECT snapshot
        FROM documents
        WHERE id = $1
        `,

        [documentId]

    );

    if (!rows.length)

        throw new Error("Document not found");

    return rows[0].snapshot;

}

    async saveSnapshot(documentId, snapshot) {

    await pool.query(

        `
        UPDATE documents
        SET snapshot = $1
        WHERE id = $2
        `,

        [

            Buffer.from(snapshot),

            documentId

        ]

    );

}

}

export default new DocumentPersistenceRepository();