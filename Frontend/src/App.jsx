import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import Home from './pages/Home'

import ResumeBuilder from './pages/ResumeBuilder'
import ProtectedRoute from './components/ProtectedRoute';
import MockInterview from "./pages/MockInterview";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFound from './pages/NotFound'
import ResumeForm from './components/ResumeForm'
import UserLogout from './pages/UserLogout'
import GoogleSuccess from './pages/GoogleSuccess'

const queryClient = new QueryClient();

function App() {

    useEffect(() => {           
  document.documentElement.classList.add("dark")
}, [])

return(
<div>
    <Routes>
      <Route path='/google-success' element={<GoogleSuccess/>}/>
       <Route path='/signup' element={<UserSignup/>} />
       <Route path='/login' element={<UserLogin/>} />
       <Route
        path="/"
        element={
          <ProtectedRoute>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster/>
                <Sonner />
                <Home />
              </TooltipProvider>
            </QueryClientProvider>
          </ProtectedRoute>
        }
      />
        <Route path='/resume-builder' element={
            <ProtectedRoute>
                     <ResumeBuilder/>
            </ProtectedRoute>
           } />

 <Route path='/resume-form' element={
            <ProtectedRoute>
                     <ResumeForm/>
            </ProtectedRoute>
           } />

      <Route
        path="/mock-interview"
        element={
          <ProtectedRoute>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster/>
                <Sonner />
                <MockInterview />
              </TooltipProvider>
            </QueryClientProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        d element={
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster/>
              <Sonner />
              <NotFound />
            </TooltipProvider>
          </QueryClientProvider>
        }
      />

      <Route
      path='/logout' element={<UserLogout/>}/>
       
    </Routes>
    

</div>
)
}

export default App
