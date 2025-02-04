import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

type TAddExpensesData = {
    name: string;
    amount: number;
    date: string
}

const createExpenses = async (data: TAddExpensesData) => {
    const res = await axios
        .post(`http://localhost:5000/api/addExpense`, { name: data.name, amount: data.amount, date: data.date }, { withCredentials: true })
        .then(res => res.data)
        .catch(error => {
            console.error(error);
            throw error;
        });
    return res;
}

function AddExpenses() {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState(new Date().toISOString());

    const mutation = useMutation({
        mutationFn: createExpenses,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseList'] });
        }
    })

    return (
        <div>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            <button onClick={() => {
                mutation.mutate({ name, amount, date });
                setName('');
                setAmount(0);
            }}>
                Add
            </button>
        </div>
    );
}

export default AddExpenses;