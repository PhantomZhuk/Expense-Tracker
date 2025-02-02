import Login from "../Login/Login";
import Logup from "../Logup/Logup";
import { useState } from "react";
import authPhoto from "../../assets/authPhoto.jpg";

function Auth() {
    const [isLogup, setIsLogup] = useState<boolean>(false);

    return (
        <div className="w-full h-screen flex items-center justify-center bg-[#0d1b2a]">
            <div className="authContainer w-[1000px] h-[70vh] bg-[#415a77] rounded-2xl text-white flex justify-between items-center">
                <div className={`topBlock w-[500px] h-[70vh] absolute bg-cover bg-center rounded-2xl ease-in-out duration-300 ${isLogup ? "translate-x-[100%]" : "translate-x-0"}`}
                    style={{ backgroundImage: `url(${authPhoto})` }}></div>
                <Login setIsLogup={setIsLogup} />
                <Logup setIsLogup={setIsLogup} />
            </div>
        </div>
    );
}

export default Auth;