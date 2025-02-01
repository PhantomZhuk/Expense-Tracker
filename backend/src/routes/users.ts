import express from "express";
import { createUser, protectedUser, authenticateToken, login, logout, addNewExpense, getExpenseList, deleteExpense, updateExpense } from "../controllers/users";

const router = express.Router()
    .post(`/createUser`, createUser)
    .get(`/protected`, authenticateToken, protectedUser)
    .post(`/login`, login)
    .post(`/logout`, logout)
    .post(`/addExpense`, authenticateToken, addNewExpense)
    .get(`/getExpenseList`, authenticateToken, getExpenseList)
    .delete(`/deleteExpense/:id`, authenticateToken, deleteExpense)
    .put(`/updateExpense/:id`, authenticateToken, updateExpense);

export default router