import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateWebSocket(req) {
    try {
        const url = new URL(
            req.url,
            "http://localhost"
        );

        const token =
            url.searchParams.get("token");

        if (!token) {
            return null;
        }

        return jwt.verify(
            token,
            JWT_SECRET
        );

    } catch (error) {

        console.error(
            "WebSocket authentication failed:",
            error.message
        );

        return null;
    }
}