import express from "express";
import pool from "../db.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

// Get all documents for logged-in user
router.get("/", fetchUser, async (req, res) => {
  // const docs = await pool.query(
  //   "SELECT * FROM documents WHERE user_id=$1 ORDER BY id DESC",
  //   [req.user.id]
  // );

  const docs = await pool.query(
  `
    SELECT d.* FROM documents d
    JOIN document_users du ON d.id = du.document_id
    WHERE du.user_id = $1
    ORDER BY d.id DESC
    `,
    [req.user.id]
  );

  res.json(docs.rows);
});

router.post("/", fetchUser, async (req, res) => {
  const { title, content } = req.body;

  const doc = await pool.query(
    "INSERT INTO documents (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, req.user.id]
  );

  await pool.query(
    "INSERT INTO document_users (document_id, user_id) VALUES ($1, $2)",
    [doc.rows[0].id, req.user.id]
  );

  res.json(doc.rows[0]);
});

router.get("/:id", fetchUser, async (req, res) => {
  const doc = await pool.query(
    "SELECT * FROM documents WHERE id=$1",
    [req.params.id]
  );

  // console.log(doc);

  res.json(doc.rows[0]);
});

router.put("/:id", fetchUser, async (req, res) => {
  const { content } = req.body;
  console.log(content);

  await pool.query(
    "UPDATE documents SET content=$1 WHERE id=$2",
    [content, req.params.id]
  );

  res.send("Updated");
});

router.post("/share", fetchUser, async (req, res) => {
  const { document_id, email } = req.body;

  // find user
  const user = await pool.query(
    "SELECT id FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length) {
    return res.status(404).send("User not found");
  }

  await pool.query(
    "INSERT INTO document_users (document_id, user_id) VALUES ($1, $2)",
    [document_id, user.rows[0].id]
  );

  res.send("Shared successfully");
});

export default router;