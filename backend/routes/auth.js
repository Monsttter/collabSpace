import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

const saltRounds = 10;
const JWT_SECRET= process.env.JWT_SECRET;

router.post("/signup", async (req, res) => {

    let success= false;
    try {
        const { email, password } = req.body;
      
        let user = await pool.query(
          "SELECT email FROM users WHERE email= $1",
          [email]
        );
        if(user.rows.length !== 0){
          return res.status(400).json({ success, errror: "Sorry! a user with this email already exist."});
        }
        const hashed = await bcrypt.hash(password, saltRounds);
      
        user = await pool.query(
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
          [email, hashed]
        );
      
          const preload= {
              user: {
                  id: user.rows[0].id
              }
          }
          const token= jwt.sign(preload, JWT_SECRET);
          success= true;
        res.json({success, token});
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error:"Internal Error Occured"});
    }
});

router.post("/login", async (req, res) => {
    let success= false;
    try {
        const { email, password } = req.body;
      
        const user = await pool.query(
          "SELECT * FROM users WHERE email=$1",
          [email]
        );
      
        if (!user.rows.length) return res.status(400).json({success, error:"User not found"});
      
        const valid = await bcrypt.compare(password, user.rows[0].password);
        if (!valid) return res.status(400).json({success, error: "Invalid credentials"});
      
        const preload= {
            user: {
                id: user.rows[0].id
            }
        }
        const token= jwt.sign(preload, JWT_SECRET);
        success= true;
        res.json({ success,  token });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success, error:"Internal Error Occured"});
    }
});

export default router;