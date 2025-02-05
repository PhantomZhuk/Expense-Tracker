import AddExpenses from "../AddExpenses/AddExpenses";
import RecognitionExpenses from "../RecognitionExpenses/RecognitionExpenses";

function Home() {
    return (
        <div className="w-full min-h-screen bg-[#0d1b2a] text-white py-[75px] px-[200px]">
            <div className="addExpensesContainer w-full min-h-[80vh] flex flex-col justify-between items-center bg-[#1b263b] rounded-2xl p-[50px]">
                <AddExpenses />
                <RecognitionExpenses />
            </div>
        </div>
    );
}

export default Home;