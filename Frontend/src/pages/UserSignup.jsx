import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext'
import axios from "axios"

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const navigate = useNavigate();
  const {user, setUser} = React.useContext(UserDataContext)
  

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password
    };

    try {
      
      console.log('Submitting:', newUser);
       const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, newUser)
       if (response?.data?.token) {
         const data = response.data
         setUser(data.user)
         localStorage.setItem('token', data.token)
         navigate('/login')   
       }
    } catch (error) {
      console.error('Registration error:', error);
    }

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='sign-up-page h-screen w-screen bg-gray-800'>
      <div className="signup-form-container flex bg-gray-900 text-white flex-col rounded-xl mx-auto mt-4 md:mt-9 max-w-sm md:max-w-md lg:max-w-lg px-4 md:px-0 md:absolute md:left-8 lg:left-35 glassmorphic card-glow transition-smooth hover:scale-102">
        <h2 className='text-gray-400 text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left px-4 md:px-15 mt-6 mb-6'>
          Hello, Welcome to  <span className='ml-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-600 animate-fade-in'>jobify.ai</span>
        </h2>

        <div className="bg-gray-900 text-gray-100 px-6 md:px-25 pb-6 rounded-xl">
          <form onSubmit={submitHandler}>
            <h3 className='text-lg md:text-xl text-gray-300 font-medium mt-4'>Enter your name</h3>
            <div className='flex gap-4 mt-3'>
              <input 
                className='bg-gray-700 bg-opacity-30 backdrop-blur-sm w-full sm:w-32 md:w-30 px-3 py-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-base placeholder:text-xs'
                type="text" 
                required 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Firstname'
              />
              <input 
                className='bg-gray-700 bg-opacity-30 backdrop-blur-sm w-full sm:w-32 md:w-30 px-3 py-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 text-base placeholder:text-xs'
                type="text" 
                required 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Lastname'
              />
            </div>
            
            <h3 className='text-lg md:text-xl text-gray-300 font-medium mt-6'>Enter your email</h3>
            <input 
              className='bg-gray-700 bg-opacity-30 backdrop-blur-sm w-full md:w-63 px-3 py-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 mt-2 text-base placeholder:text-xs'
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
            />
           
            <h3 className='text-lg md:text-xl text-gray-300 font-medium mt-6'>Create new password</h3>
            <input 
              className='bg-gray-700 bg-opacity-30 backdrop-blur-sm w-full md:w-63 px-3 py-2 h-9 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300 mt-2 text-base placeholder:text-xs'
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />

            <button className="mt-7 h-9 w-full md:w-63 flex justify-center items-center text-sm bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-600 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce">
              sign up
            </button>
          </form> 
          
          <a
            href="http://localhost:3000/auth/google"
            className="mt-5 w-full md:w-55 cursor-pointer text-black flex gap-2 items-center justify-center bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-zinc-300 transition-all ease-in duration-200"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="google" className="w-5 h-5" />
            Continue with Google
          </a>
 
          <p className='text-center text-sm mt-3'>
            Already have an account?
            <Link to={'/login'} className='text-blue-500 ml-1'>Login</Link>
          </p>
        </div>
      </div>
      
      {/* Right image - hidden on mobile and tablet */}
      <div className="image-container mt-4 rounded-lg absolute right-3 items-center justify-center h-154 w-140">
        <img className='w-full rounded-2xl h-full object-cover' src='/images/resumeImage.webp' alt="Resume" />
      </div>
    </div>
  );
};

export default UserSignup;