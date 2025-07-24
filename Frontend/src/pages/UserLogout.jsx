import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UserLogout = () => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    }).finally(() => {
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, []);

  return (
    <div>Logging out...</div>
  )
}

export default UserLogout
