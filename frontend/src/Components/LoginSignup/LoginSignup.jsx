import React, { useState } from 'react'
import { baseUrl } from '../../../Url';

const LoginSignup = () => {
    const [state,setState] = useState("Login");
    const [formData,setFormData] = useState({ username:"", password:"", email:"",});

    const changeHandler = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
    }

    const login =  async () => {
        console.log("Login function executed");
        let responseData;
        await fetch(`${baseUrl}/login`,{
            method:"POST",
            headers:{
                Accept:"application/form-data",
                'Content-Type':"application/json"
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData=data);

        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");
        }
        else{
            alert(responseData.errors);
        }
    }

    const signup =  async  () => {
        console.log("Signup function executed");
        let responseData;
        await fetch(`${baseUrl}/signup`,{
            method:"POST",
            headers:{
                Accept:"application/form-data",
                'Content-Type':"application/json"
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData=data);

        if(responseData.success){
            localStorage.setItem('auth-token',responseData.token);
            window.location.replace("/");
        }
        else{
            alert(responseData.errors);
        }
    }

    return (
            <div className="w-full h-[100vh] flex flex-col justify-start items-center bg-slate-400 p-10 gap-4">
                <h1 className="flex justify-center items-center font-bold text-4xl">{state}</h1>
                <div className="flex flex-col gap-6">
                    {state==="Sign Up"?<input name="username" className='md:w-[450px] md:h-5 border rounded-md md:p-5 w-72 p-3' value={formData.username} onChange={changeHandler} type="text" placeholder="Your Name"/>:<></>}
                    <input name="email" className='md:w-[450px] md:h-5 border rounded-md md:p-5 w-72 p-3' value={formData.email} onChange={changeHandler} type="email" placeholder="Email Address"/>
                    <input name="password" className='md:w-[450px] md:h-5 border rounded-md md:p-5 w-72 p-3' value={formData.password} onChange={changeHandler} type="password" placeholder="Password"/>
                </div>
                <button className='md:w-[450px] bg-red-900 text-white border rounded-md p-3 w-72' onClick={() => {state==="Login"?login():signup()}}>Continue</button>
                {state==="Sign Up"
                ?<p className="cursor-pointer">Already have an account? <span onClick={()=>{setState("Login")}}>Login here</span></p>
                :<p className="cursor-pointer">Create an account? <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>}
        </div>
        
    )
}

export default LoginSignup;