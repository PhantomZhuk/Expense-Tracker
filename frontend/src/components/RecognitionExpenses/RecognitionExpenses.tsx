import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from 'axios';

type TExpenseList = {
    _id?: string;
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
        console.error("Error fetching expense list:", error);
        throw error;
    }
};

const deleteExpense = async (id: string): Promise<void> => {
    try {
        const res = await axios.delete(`http://localhost:5000/api/deleteExpense/${id}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
}

const editExpense = async (data: TExpenseList & { id: string }): Promise<void> => {
    try {
        const res = await axios.put(`http://localhost:5000/api/updateExpense/${data.id}`, { name: data.name, amount: data.amount, date: data.date }, { withCredentials: true });
        return res.data;
    } catch (error) {
        console.error("Error editing expense:", error);
        throw error;
    }
}

function RecognitionExpenses() {
    const { data, isLoading, error } = useQuery<TExpensesData, Error>({
        queryKey: ['expenseList'],
        queryFn: getExpenseList,
        refetchInterval: 5000
    })
    const queryClient = useQueryClient();
    const editExpenseMutation = useMutation({
        mutationFn: editExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseList'] });
        }
    })
    const deleteExpenseMutation = useMutation({
        mutationFn: deleteExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['expenseList'] });
        }
    })
    function editContent(id: string) {
        const nameExpense = document.getElementById(`expenseName-${id}`) as HTMLInputElement;
        const amountExpense = document.getElementById(`expenseAmount-${id}`) as HTMLInputElement;
        const dateExpense = document.getElementById(`expenseDate-${id}`) as HTMLInputElement;
        nameExpense.contentEditable = "true";
        amountExpense.contentEditable = "true";
        dateExpense.readOnly = false;
    }

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
                    <div contentEditable={false} suppressContentEditableWarning={true} id={`expenseName-${expense._id}`}>
                        {expense.name}
                    </div>
                    <div contentEditable={false} suppressContentEditableWarning={true} id={`expenseAmount-${expense._id}`}>
                        {expense.amount}
                    </div>
                    <input
                        type="datetime-local"
                        id={`expenseDate-${expense._id}`}
                        defaultValue={new Date(expense.date).toISOString().slice(0, 16)}
                        readOnly
                    />
                    <div className="btnContainer">
                        <button className="btn" onClick={() => editContent(expense._id)}>Edit</button>
                        <button className="btn" onClick={() => editExpenseMutation.mutate({
                            name: document.getElementById(`expenseName-${expense._id}`)?.textContent!,
                            amount: Number(document.getElementById(`expenseAmount-${expense._id}`)?.textContent),
                            date: (document.getElementById(`expenseDate-${expense._id}`) as HTMLInputElement).value!,
                            id: expense._id
                        })}>Save</button>
                        <button className="btn" onClick={() => deleteExpenseMutation.mutate(expense._id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecognitionExpenses;