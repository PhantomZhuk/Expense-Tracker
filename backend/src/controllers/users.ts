import User from "./../models/users";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
cookieParser();

const JWT_SECRET = process.env.JWT_SECRET!;
export interface AuthRequest extends Request {
    user?: any;
}

async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.cookies?.token) {
            res.status(401).json({ message: "Access token required" });
            return;
        }

        const token: string = req.cookies.token;
        jwt.verify(token, JWT_SECRET, async (err, decodedUser: any) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            const userInfo = await User.findOne({ _id: decodedUser._id });
            if (!userInfo) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = userInfo;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Authentication error", error });
        return;
    }
}

async function createUser(req: Request, res: Response): Promise<void> {
    try {
        const { userName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ userName, email, password: hashedPassword });

        const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: "1d" });

        res.status(201)
            .cookie("token", token)
            .json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
}
async function protectedUser(req: AuthRequest, res: Response): Promise<void> {
    res.json({ message: "This is a secure route", user: req.user });
}

async function login(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1d" });

        res.cookie('token', token)
            .status(200)
            .json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to login" });
    }
}

async function logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("token").status(200).json({ message: "Logout successful" });
}

async function addNewExpense(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { name, amount, date } = req.body;
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: "Access token required" });
            return;
        }

        const decodedUser = jwt.verify(token, JWT_SECRET) as any;
        const userId = decodedUser._id;

        const user = await User.findById(userId);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        user.expenseList.push({ name, amount, date });
        await user.save();

        res.status(200).json({ message: "Expense added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add expense" });
    }
}

async function getExpenseList(req: AuthRequest, res: Response): Promise<void> {
    try {
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: "Access token required" });
            return;
        }

        const decodedUser = jwt.verify(token, JWT_SECRET) as any;
        const user = await User.findById(decodedUser._id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({ expenseList: user.expenseList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get expense list" });
    }
}

async function deleteExpense(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: "Acess token required" });
            return;
        }

        const decodedUser = jwt.verify(token, JWT_SECRET) as any;
        const user = await User.findById(decodedUser._id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        user.expenseList.pull({ _id: id });
        await user.save();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete expense" });
    }
}

async function updateExpense(req: AuthRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name, amount, date } = req.body;
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: "Acess token required" });
            return;
        }

        const decodedUser = jwt.verify(token, JWT_SECRET) as any;
        const user = await User.findById(decodedUser._id);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const expenseToUpdate = user.expenseList.id(id);

        if (!expenseToUpdate) {
            res.status(404).json({ error: "Expense not found" });
            return;
        }

        expenseToUpdate.set({
            name,
            amount,
            date
        });
        await user.save();

        res.status(200).json({ message: "Expense updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update expense" })
    }
}

export { authenticateToken, createUser, protectedUser, login, logout, addNewExpense, getExpenseList, deleteExpense, updateExpense };
