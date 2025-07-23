import React from 'react'
import { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const UserLogin = () => {

   const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
   const [error, setError] = useState("");

   const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()


  const submitHandler = async (e) => {
  e.preventDefault();
  setError("");

  const userData = {
    email: email,
    password: password
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/login`,
      userData,
      { withCredentials: true }
    );

    if (response?.data?.token) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/');
    }

    // Clear form fields
    setEmail('');
    setPassword('');
    
  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Invalid Email or Password");
  }
};



  return (
    <div className='login-up-page h-screen w-screen bg-gray-800'>

      <div className="login-form-container flex w-120 bg-gray-900 text-white flex-col rounded-xl mx-auto mt-4 md:mt-9 max-w-sm md:max-w-md lg:max-w-lg px-4 md:px-0 md:absolute md:left-8 lg:left-35 glassmorphic card-glow transition-smooth hover:scale-102 animate-fade-in">

        <h2 className='text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left px-4 md:px-15 mt-8 bg-gradient-to-r from-blue-200 to-indigo-500 text-transparent bg-clip-text '>Hello, Welcome back :)</h2>

        <div className="login-form-2 w-110 pt-20 bg-gray-900 text-gray-100 h-120 pl-25 mb-5 rounded-xl">

          <form onSubmit={(e)=>{
        submitHandler(e)
      }}>
       <h3 className='text-xl text-gray-300 font-medium ml-2'>Enter your email</h3>
        <input className='bg-[#eeeeee2d] pl-2 w-63 px-1 py-1 ml-2 mt-2 rounded text-base placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300'
         type="text" required
        value={email}
        onChange={(e)=>{
          setEmail(e.target.value)  
        }}
         placeholder='Email'/>
       
       <h3 className='text-xl text-gray-300 font-medium ml-2 mt-6'>Enter your password</h3>
        <input className='bg-[#eeeeee2d] w-63 pl-2 px-1 py-1 ml-2 mt-2 rounded text-base placeholder:text-[12px] focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300'
         type="text" required 
        value={password}
        onChange={(e)=>{
          setPassword(e.target.value)  
        }}
         placeholder='Password'/>

          {error && <p className="text-red-500 text-sm mt-2 ml-2">{error}</p>} {/* 👈 show error */}


        <button className="mt-8 h-9 w-64 ml-2 flex justify-center items-center text-[13px] bg-gradient-to-r from-purple-300 to-purple-600 hover:from-purple-600 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
 Login
</button> 
</form>

<a
  href="https://jobify-ai-pe2b.onrender.com/auth/google"
  className="ml-6 mt-5 w-55 cursor-pointer text-black flex gap-2 items-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
>
  <img src="https://developers.google.com/identity/images/g-logo.png" alt="google" className="w-5 h-5" />
  Continue with Google
</a>
          <p className='text-center text-sm mr-20 mt-4'>New here? <Link to={'/signup'} className='text-blue-500'>Create new account</Link></p>
        </div>
               
      </div>
        <div className="image-container
 flex flex-col mt-4 mr-1 rounded-lg absolute right-2 items-center justify-center h-155 w-140">
          <img className='w-screen rounded-2xl h-screen object-cover' src='/images/loginImage.webp'></img>
        </div>
    </div>
  )
}

export default UserLogin