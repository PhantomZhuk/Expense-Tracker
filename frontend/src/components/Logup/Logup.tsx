import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface LogupData {
    userName: string;
    email: string;
    password: string;
}

const LogupUser = async (data: LogupData): Promise<void> => {
    console.log(data);
    axios.post('http://localhost:5000/api/createUser', { userName: data.userName, email: data.email, password: data.password }, { withCredentials: true })
        .then(res => {
            console.log(res.data);
            window.location.href = '/home';
        })
        .catch(error => console.error(error));
}

function Logup({ setIsLogup }: any) {
    const [userName, setuserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: LogupUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    })

    return (
        <div className="login-container w-[500px] h-full flex flex-col items-center justify-between p-10 py-20">
            <div className="header">
                <h1 className='text-[30px] font-bold'>Logup</h1>
            </div>
            <div className="inputContainer w-full flex flex-col gap-10 mb-[50px]">
                <input type="text" placeholder="Login" onChange={(e) => setuserName(e.target.value)} className='w-full h-[50px] border-b-2 border-[#fff] p-5 outline-none' />
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className='w-full h-[50px] border-b-2 border-[#fff] p-5 outline-none' />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className='w-full h-[50px] border-b-2 border-[#fff] p-5 outline-none' />
            </div>
            <p>Already have an account? <span className='cursor-pointer text-[#8ac0ff]' onClick={() => setIsLogup(true)}>Sign in</span></p>
            <button
                onClick={() => mutation.mutate({ userName, email, password })}
                className='w-[300px] h-[40px] bg-[#fff] text-[#0d1b2a] font-bold rounded-xl cursor-pointer'
            >
                Logup
            </button>
        </div>
    );
}

export default Logup;