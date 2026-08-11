import pool from "../config/db.js";

class CommentRepository {

    async createComment({
        documentId,
        authorId,
        message,
        type,
        anchorRelative,
        headRelative,
        quotedText,
    }) {

        const { rows } = await pool.query(
            `
            INSERT INTO document_comments
            (
                document_id,
                author_id,
                message,
                type,
                anchor_relative,
                head_relative,
                quoted_text
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING id
            `,
            [
                documentId,
                authorId,
                message,
                type,
                anchorRelative,
                headRelative,
                quotedText,
            ]
        );

        return this.getCommentById(rows[0].id);

    }

    async getCommentById(commentId) {

        const { rows } = await pool.query(
            `
            SELECT

                dc.id,
                dc.document_id,
                dc.message,
                dc.quoted_text,
                dc.type,
                dc.anchor_relative,
                dc.head_relative,
                dc.created_at,
                dc.updated_at,
                dc.resolved,
                dc.edited,

                json_build_object(

                    'id', u.id,
                    'username', u.username,
                    'avatar', u.avatar_url

                ) AS author,

                (
                    SELECT COUNT(*)
                    FROM comment_replies cr
                    WHERE cr.comment_id = dc.id
                )::int AS reply_count

            FROM document_comments dc

            JOIN users u
            ON u.id = dc.author_id

            WHERE dc.id = $1
            `,
            [commentId]
        );

        return rows[0];

    }

    async getCommentsByDocument(documentId) {

        const { rows } = await pool.query(
            `
            SELECT

                dc.id,
                dc.document_id,
                dc.message,
                dc.quoted_text,
                dc.type,
                dc.anchor_relative,
                dc.head_relative,
                dc.created_at,
                dc.updated_at,
                dc.resolved,
                dc.edited,

                json_build_object(

                    'id', u.id,
                    'username', u.username,
                    'avatar', u.avatar_url

                ) AS author,

                (
                    SELECT COUNT(*)
                    FROM comment_replies cr
                    WHERE cr.comment_id = dc.id
                )::int AS reply_count

            FROM document_comments dc

            JOIN users u
            ON u.id = dc.author_id

            WHERE dc.document_id = $1

            ORDER BY dc.created_at ASC
            `,
            [documentId]
        );

        return rows;

    }

    async createReply({

        commentId,
        authorId,
        message,

    }) {

        const { rows } = await pool.query(
            `
            INSERT INTO comment_replies
            (
                comment_id,
                author_id,
                message
            )
            VALUES ($1,$2,$3)
            RETURNING id
            `,
            [
                commentId,
                authorId,
                message,
            ]
        );

        return this.getReplyById(rows[0].id);

    }

    async getReplyById(replyId) {

        const { rows } = await pool.query(
            `
            SELECT

                cr.id,
                cr.comment_id,
                cr.message,
                cr.created_at,
                cr.updated_at,
                cr.edited,

                json_build_object(

                    'id', u.id,
                    'username', u.username,
                    'avatar', u.avatar_url

                ) AS author

            FROM comment_replies cr

            JOIN users u
            ON u.id = cr.author_id

            WHERE cr.id = $1
            `,
            [replyId]
        );

        return rows[0];

    }

    async getReplies(commentId) {

        const { rows } = await pool.query(
            `
            SELECT

                cr.id,
                cr.comment_id,
                cr.message,
                cr.created_at,
                cr.updated_at,
                cr.edited,

                json_build_object(

                    'id', u.id,
                    'username', u.username,
                    'avatar', u.avatar_url

                ) AS author

            FROM comment_replies cr

            JOIN users u
            ON u.id = cr.author_id

            WHERE cr.comment_id = $1

            ORDER BY cr.created_at ASC
            `,
            [commentId]
        );

        return rows;

    }

    async setCommentResolved(commentId, resolved) {
        console.log(commentId, resolved);

        const { rows } = await pool.query(
            `
            UPDATE document_comments

            SET
                resolved = $1

            WHERE id = $2
            `,
            [
                resolved,
                commentId,
            ]
        );

        return this.getCommentById(commentId);

    }

    async deleteComment(commentId) {

        const { rows } = await pool.query(
            `
            DELETE FROM document_comments
            WHERE id = $1
            RETURNING *
            `,
            [commentId]
        );

        return rows[0];

    }

    async deleteReply(replyId) {

        const { rows } = await pool.query(
            `
            DELETE FROM comment_replies
            WHERE id = $1
            RETURNING *
            `,
            [replyId]
        );

        return rows[0];
    }

    async updateComment({
        commentId,
        message,
    }) {

        const { rows } = await pool.query(
            `
            UPDATE document_comments

            SET
                message = $1,
                updated_at = NOW(),
                edited = TRUE

            WHERE id = $2

            RETURNING id
            `,
            [
                message,
                commentId,
            ]
        );

        return this.getCommentById(rows[0].id);

    }
    

    async updateReply({
        replyId,
        message,
    }) {

        const { rows } = await pool.query(
            `
            UPDATE comment_replies

            SET
                message = $1,
                updated_at = NOW(),
                edited = TRUE

            WHERE id = $2

            RETURNING id
            `,
            [
                message,
                replyId,
            ]
        );

        return this.getReplyById(rows[0].id);

    }

}

export default new CommentRepository();