
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute';
import MockInterviewPage from './pages/MockInterviewPage';

function App() {

return(
<div>
    <Routes>
       <Route path='/signup' element={<UserSignup/>} />
       <Route path='/login' element={<UserLogin/>} />
        <Route path='/dashboard' element={
            <ProtectedRoute>
                     <Dashboard/>
            </ProtectedRoute>
           } />


 <Route path="/mock-interview" element={<MockInterviewPage />} /> 
    </Routes>

</div>
)
}

export default App
