import { randomUUID } from "crypto";

import pool from "../config/db.js";

import * as userRepository from "../repositories/userRepository.js";

import {
    hashPassword,
    comparePassword
} from "../utils/password.js";

import { generateToken } from "../utils/jwt.js";

import AppError from "../utils/AppError.js";

export async function register(

    username,

    email,

    password

){

    const exists = await userRepository.findByEmail(email);

    if(exists)

        throw new AppError(

            409,

            "Email already registered."

        );

    const client = await pool.connect();

    try{

        await client.query("BEGIN");

        const hashedPassword =

            await hashPassword(password);

        const user =

            await userRepository.createUser(

                client,

                {

                    id: randomUUID(),

                    username,

                    email,

                    password: hashedPassword,

                    avatarUrl: null

                }

            );

        await client.query("COMMIT");

        return {

            user,

            token: generateToken(user)

        };

    }

    catch(error){

        await client.query("ROLLBACK");

        throw error;

    }

    finally{

        client.release();

    }

}

export async function login(email,password){

    const user =

        await userRepository.findByEmail(email);

    if(!user)

        throw new AppError(

            401,

            "Invalid email or password."

        );

    const valid =

        await comparePassword(

            password,

            user.password

        );

    if(!valid)

        throw new AppError(

            401,

            "Invalid email or password."

        );

    const token =

        generateToken(user);

    delete user.password;

    return {

        user,

        token

    };

}

export async function getCurrentUser(userId){

    const user =

        await userRepository.findById(userId);

    if(!user)

        throw new AppError(

            404,

            "User not found."

        );

    return user;

}

export async function updateProfile(

    userId,

    username,

    avatarUrl

){

    return await userRepository.updateProfile(

        userId,

        username,

        avatarUrl

    );

}

export async function changePassword(

    userId,

    currentPassword,

    newPassword

){

    const user =

        await userRepository.findByIdWithPassword(userId);


    const valid =

        await comparePassword(

            currentPassword,

            user.password

        );

    if(!valid)

        throw new AppError(

            400,

            "Current password is incorrect."

        );

    const hashed =

        await hashPassword(

            newPassword

        );

    await userRepository.updatePassword(

        userId,

        hashed

    );

}