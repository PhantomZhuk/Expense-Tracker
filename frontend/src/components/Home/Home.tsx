import AddExpenses from "../AddExpenses/AddExpenses";
import RecognitionExpenses from "../RecognitionExpenses/RecognitionExpenses";

function Home() {
    return (
        <div className="w-full h-screen bg-[#0d1b2a] text-white">
            <AddExpenses />
            <RecognitionExpenses />
        </div>
    );
}

export default Home;