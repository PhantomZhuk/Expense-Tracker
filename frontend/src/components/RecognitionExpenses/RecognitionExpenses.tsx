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
    });
    function editContent(id: string) {
        const nameExpense = document.getElementById(`expenseName-${id}`) as HTMLInputElement;
        const amountExpense = document.getElementById(`expenseAmount-${id}`) as HTMLInputElement;
        const dateExpense = document.getElementById(`expenseDate-${id}`) as HTMLInputElement;
        const editExpense = document.getElementById(`editExpense-${id}`) as HTMLButtonElement;
        const editContent = document.getElementById(`editContent-${id}`) as HTMLButtonElement;
        nameExpense.contentEditable = "true";
        amountExpense.contentEditable = "true";
        dateExpense.readOnly = false;
        editExpense.style.display = "block";
        editContent.style.display = "none";
    }

    function saveContent(id: string) {
        const nameExpense = document.getElementById(`expenseName-${id}`) as HTMLInputElement;
        const amountExpense = document.getElementById(`expenseAmount-${id}`) as HTMLInputElement;
        const dateExpense = document.getElementById(`expenseDate-${id}`) as HTMLInputElement;
        const editExpense = document.getElementById(`editExpense-${id}`) as HTMLButtonElement;
        const editContent = document.getElementById(`editContent-${id}`) as HTMLButtonElement;
        nameExpense.contentEditable = "false";
        amountExpense.contentEditable = "false";
        dateExpense.readOnly = true;
        editExpense.style.display = "none";
        editContent.style.display = "block";
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="w-full min-h-[55vh] flex flex-wrap items-start text-[#333] gap-2.5">
            {data?.expenseList.map((expense: any) => (
                <div key={expense._id} className="w-[300px] min-h-[200px] bg-[#e0e1dd] rounded-2xl flex flex-col justify-between p-5">
                    <div className="font-bold">
                        Name: <span contentEditable={false}
                            suppressContentEditableWarning={true}
                            id={`expenseName-${expense._id}`}>{expense.name}</span>
                    </div>
                    <div className="font-medium">
                        Price: <span contentEditable={false}
                            suppressContentEditableWarning={true}
                            id={`expenseAmount-${expense._id}`}>{expense.amount}</span>
                    </div>
                    <input
                        type="datetime-local"
                        id={`expenseDate-${expense._id}`}
                        defaultValue={new Date(expense.date).toISOString().slice(0, 16)}
                        readOnly
                    />
                    <div className="btnContainer w-full flex gap-5">
                        <button className="px-[20px] py-[5px] bg-[#0d1b2a] text-[#e0e1dd] rounded-[5px] cursor-pointer shadow-[0_1px_5px_#e0e1dd]"
                            onClick={() => editContent(expense._id)}
                            id={`editContent-${expense._id}`}>
                            Edit</button>
                        <button className="px-[20px] py-[5px] bg-[#004d00] text-[#e0e1dd] rounded-[5px] cursor-pointer shadow-[0_1px_5px_#e0e1dd] hover:bg-[#009900] hidden" onClick={() => {
                            editExpenseMutation.mutate({
                                name: document.getElementById(`expenseName-${expense._id}`)?.textContent!,
                                amount: Number(document.getElementById(`expenseAmount-${expense._id}`)?.textContent),
                                date: (document.getElementById(`expenseDate-${expense._id}`) as HTMLInputElement).value!,
                                id: expense._id
                            })
                            saveContent(expense._id)
                        }}
                            id={`editExpense-${expense._id}`}>Save</button>
                        <button className="px-[20px] py-[5px] bg-[#990000] text-[#e0e1dd] rounded-[5px] cursor-pointer shadow-[0_1px_5px_#e0e1dd] hover:bg-[#ff0000]"
                            onClick={() => deleteExpenseMutation.mutate(expense._id)}>
                            Delete</button>
                    </div>
                </div>
            ))
            }
        </div >
    );
}

export default RecognitionExpenses;