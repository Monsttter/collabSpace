import pool from "../config/db.js";

export const updateDocumentTitle = async (req, res) => {
    try {

        const { title } = req.body;

        const result = await pool.query("UPDATE documents SET title=($1) WHERE id=($2) RETURNING *", [title, req.params.id]);

        res.json({
            success: true,
            document: result.rows[0],
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
        });

    }
};