import React from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useState } from "react"
import { UserDataContext } from '../context/UserContext'
import axios from "axios"

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')


  const navigate = useNavigate()

    const {user, setUser} = React.useContext(UserDataContext)

    const submitHandler = async (e)=>{
    e.preventDefault();
    const newUser ={
      fullname:{
        firstname: firstName,
        lastname: lastName,
      },
        email: email,
        password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser)
    if (response?.data?.token) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/login')   
    }

    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')  
    
  }

  return (
    <div className='h-screen w-screen bg-gray-800'>
      <div className="flex bg-gray-900 text-white flex-col h-145 w-130 rounded-xl item-center absolute left-35 mt-9 ">
        <h2 className='flex ml-8  mt-4 mb-3 text-3xl font-semibold'>Hello, Welcome to Ai Resume Builder</h2>

        <div className="w-118 bg-gray-900 text-gray-100 h-120 ml-5 pl-25 rounded-xl">
       <form onSubmit={(e)=>{
        submitHandler(e)
      }}>
        
        <h3 className='text-xl font-medium ml-2 mt-4'>Enter your name</h3>
       <div className='flex gap-4 mt-3 ml-2'>
        <input className='bg-[#eeeeee2d] w-30 px-1 py-1 pl-2 mb-4 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43b3c7] text-base placeholder:text-[12px]'
        type="text" required 
          value={firstName}
          onChange={(e)=>{
          setFirstName(e.target.value)
        }}
        placeholder='Firstname'/>
        <input className='bg-[#eeeeee2d] w-30 px-1 py-1 pl-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43b3c7] mb-4 text-base placeholder:text-[12px]'
         type="text" required 
           value={lastName}
          onChange={(e)=>{
          setLastName(e.target.value)
        }}
         placeholder='Lastname'/>
       </div>
       <h3 className='text-xl font-medium ml-2 mt-2'>Enter your email</h3>
        <input className='bg-[#eeeeee2d] w-63 px-1 py-1  pl-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43b3c7] ml-2 mt-2  text-base placeholder:text-[12px]'
         type="text" required
           value={email}
          onChange={(e)=>{
          setEmail(e.target.value)
        }}
         placeholder='Email'/>
       
       <h3 className='text-xl font-medium ml-2 mt-6'>Create new password</h3>
        <input className='bg-[#eeeeee2d] w-63 px-1 py-1 pl-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#43b3c7] ml-2 mt-2 text-base placeholder:text-[12px]'
         type="text" required 
           value={password}
          onChange={(e)=>{
          setPassword(e.target.value)
        }}
         placeholder='Password'/>

        <button className="mt-7 h-9 w-63 ml-2 flex justify-center items-center text-[13px] bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
  sign up
</button>
</form> 
  <a
  href="http://localhost:3000/auth/google"
  className="ml-6 mt-5 w-55 cursor-pointer text-black flex gap-2 items-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
>
  <img src="https://developers.google.com/identity/images/g-logo.png" alt="google" className="w-5 h-5" />
  Continue with Google
</a>
 

          <p className='text-center text-sm mr-26 mt-3'>Already have an account?<Link to={'/login'} className='text-blue-500'>Login</Link></p>
      </div>
      </div>
        <div className="flex flex-col mt-4 rounded-lg absolute right-3 items-center justify-center h-154 w-140">
          <img className='w-screen rounded-2xl h-screen object-cover' src='/images/resumeImage.webp'></img>
        </div>
    </div>


  )
}

export default UserSignup