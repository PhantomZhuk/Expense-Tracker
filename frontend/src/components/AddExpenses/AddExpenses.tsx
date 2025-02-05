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
        <div className="w-full flex gap-5">
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-[500px] h-[40px] border-b-2 border-[#fff] p-2 outline-none" />
            <input type="number" value={amount} min="0" onChange={(e) => setAmount(Number(e.target.value))} className="w-[250px] h-[40px] border-b-2 border-[#fff] p-2 outline-none" />
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="w-[200px] h-[40px] border-b-2 border-[#fff] p-2 outline-none" />
            <button onClick={() => {
                mutation.mutate({ name, amount, date });
                setName('');
                setAmount(0);
            }}
                className="w-[150px] h-[40px] bg-[#e0e1dd] text-[#0d1b2a] font-bold rounded-xl cursor-pointer shadow-[0_1px_5px_#e0e1dd]">
                Add
            </button>
        </div>
    );
}

export default AddExpenses;