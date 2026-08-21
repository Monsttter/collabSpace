import pool from "../config/db.js";
import { randomUUID } from "crypto";

/*
|--------------------------------------------------------------------------
| Create Version
|--------------------------------------------------------------------------
*/

export async function createVersion({
    documentId,
    createdBy,
    snapshot,
    description = null
}) {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const result = await client.query(
            `
            SELECT COALESCE(MAX(version_number), 0) + 1
            AS version_number

            FROM document_versions

            WHERE document_id = $1
            `,
            [documentId]
        );

        const versionNumber =
            result.rows[0].version_number;

        const insertResult = await client.query(
            `
            INSERT INTO document_versions (
                id,
                document_id,
                version_number,
                created_by,
                snapshot,
                description
            )

            VALUES ($1, $2, $3, $4, $5, $6)

            RETURNING
                id
            `,
            [
                randomUUID(),
                documentId,
                versionNumber,
                createdBy,
                snapshot,
                description
            ]
        );

        await client.query("COMMIT");

        const finalResult = await pool.query(
        `
        SELECT
            dv.id,
            dv.document_id,
            dv.version_number,
            dv.created_by,
            dv.description,
            dv.created_at,

            u.username,
            u.email

        FROM document_versions dv

        JOIN users u
            ON u.id = dv.created_by

        WHERE dv.id = $1
        `,
        [insertResult.rows[0].id]
    );

    return finalResult.rows[0];

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
}


/*
|--------------------------------------------------------------------------
| Get Versions
|--------------------------------------------------------------------------
|
| Returns metadata only.
|
| We deliberately DON'T return snapshot here because snapshots can
| be relatively large and the history drawer doesn't need them.
|
*/

export async function getVersions(documentId) {

    const result = await pool.query(
        `
        SELECT
            dv.id,
            dv.document_id,
            dv.version_number,
            dv.created_by,
            dv.description,
            dv.created_at,

            u.username,
            u.email

        FROM document_versions dv

        JOIN users u
            ON u.id = dv.created_by

        WHERE dv.document_id = $1

        ORDER BY dv.version_number DESC
        `,
        [documentId]
    );

    return result.rows;
}


/*
|--------------------------------------------------------------------------
| Get Version By Number
|--------------------------------------------------------------------------
|
| Used when previewing/restoring a particular version.
|
*/

export async function getVersionByNumber(
    documentId,
    versionNumber
) {

    const result = await pool.query(
        `
        SELECT
            dv.id,
            dv.document_id,
            dv.version_number,
            dv.created_by,
            dv.snapshot,
            dv.description,
            dv.created_at,

            u.username,
            u.email

        FROM document_versions dv

        JOIN users u
            ON u.id = dv.created_by

        WHERE
            dv.document_id = $1
            AND dv.version_number = $2

        LIMIT 1
        `,
        [
            documentId,
            versionNumber
        ]
    );

    return result.rows[0] || null;
}


/*
|--------------------------------------------------------------------------
| Get Latest Version Number
|--------------------------------------------------------------------------
*/

export async function getLatestVersionNumber(
    documentId
) {

    const result = await pool.query(
        `
        SELECT
            COALESCE(
                MAX(version_number),
                0
            ) AS version_number

        FROM document_versions

        WHERE document_id = $1
        `,
        [documentId]
    );

    return result.rows[0].version_number;
}