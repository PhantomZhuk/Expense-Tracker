import { useQuery } from "@tanstack/react-query";
import axios from 'axios';

type TExpenseList = {
    _id: string;
    name: string;
    amount: number;
    date: string;
}

type TExpensesData = {
    expenseList: TExpenseList[];
};

const getExpenseList = async (): Promise<TExpensesData> => {
    try {
        const res = await axios.get(`http://localhost:5000/api/getExpenseList`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("Помилка отримання списку витрат:", error);
        throw error; 
    }
};


function RecognitionExpenses() {
    const { data, isLoading, error } = useQuery<TExpensesData, Error>({
        queryKey: ['expenseList'],
        queryFn: getExpenseList,
        refetchInterval: 5000
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            {data?.expenseList.map((expense: any) => (
                <div key={expense._id}>
                    <p>{expense.name}</p>
                    <p>{expense.amount}</p>
                    <p>{expense.date}</p>
                    <div className="btnContainer">
                        <button className="btn">Edit</button>
                        <button className="btn">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecognitionExpenses;