import mongoose from 'mongoose';

const expenseListSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    }
})

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    expenseList: {
        type: [expenseListSchema],
        default: [],
    }
});

const User = mongoose.model('User', userSchema);
export default User;