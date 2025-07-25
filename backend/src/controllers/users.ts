import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModal from "../models/user";
import bcrypt from "bcrypt";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModal.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

interface SignUpBody {
    username?: string,
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username =  req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw){
            throw createHttpError(400, "Parameters Missing");
        }
        const existingUsername = await UserModal.findOne({username: username}).exec();
        if (existingUsername) {
            throw createHttpError(409, " Username Already taken please choose  different Username or log in instead");
        }
        const existingEmail = await UserModal.findOne({email: email}). exec();
        if (existingEmail) {
            throw createHttpError(409, "A user with this email address ia already exist. Please log in instead");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser =  await UserModal.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
        
    } catch (error) {
        next(error);
    }
}

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Parameters missing");
        }
        const user = await UserModal.findOne({username: username}).select("+password +email").exec();

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch =  await bcrypt.compare(password, user.password);
        if (!passwordMatch){
            throw createHttpError(401, "Invalid credentials");
        }
        req.session.userId = user._id;
        res.status(201).json(user);
        
    } catch (error) {
        next(error);
    }
}

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};