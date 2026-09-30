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
        const { rows } = await pool.query(
            `
            UPDATE documents
            SET
                snapshot = $1,
                updated_at = NOW()
            WHERE id = $2
            RETURNING updated_at
            `,
            [
                Buffer.from(snapshot),
                documentId
            ]
        );

        return rows[0]?.updated_at;
    }

}

export default new DocumentPersistenceRepository();