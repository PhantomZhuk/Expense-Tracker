import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

interface LoginData {
    email: string;
    password: string;
}

const loginUser = async (data: LoginData): Promise<void> => {
    axios.post('http://localhost:5000/api/login', { email: data.email, password: data.password }, { withCredentials: true })
        .then(res => {
            console.log(res.data);
            window.location.href = '/home';
        })
        .catch(error => console.error(error));
}

function Login({ setIsLogup }: any) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    return (
        <div className="login-container w-[500px] h-full flex flex-col items-center justify-between p-10 py-20">
            <div className="header">
                <h1 className='text-[30px] font-bold'>Login</h1>
            </div>
            <div className="inputContainer w-full flex flex-col gap-10 mb-[50px]">
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className='w-full h-[50px] border-b-2 border-[#fff] p-5 outline-none' />
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className='w-full h-[50px] border-b-2 border-[#fff] p-5 outline-none' />
            </div>
            <p>Don't have an account? <span className='cursor-pointer text-[#8ac0ff]' onClick={() => setIsLogup(false)}>Sign up</span></p>
            <button
                onClick={() => mutation.mutate({ email, password })}
                className='w-[300px] h-[40px] bg-[#fff] text-[#0d1b2a] font-bold rounded-xl cursor-pointer'
            >
                Login
            </button>
        </div>
    );
}

export default Login;