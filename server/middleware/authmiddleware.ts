import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authmiddleware = (req : Request, res : Response, next : NextFunction) => {
    const authHeader = req.headers.authorization || req.cookies.token;
    if (!authHeader) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    if (!token || token !== "your_secret_token") {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const decoded = jwt.verify(token, "your_jwt_secret");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden" });
    }
};
