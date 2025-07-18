import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserSignup from './pages/UserSignup'
import UserLogin from './pages/UserLogin'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute';
import MockInterview from "./pages/MockInterview";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {

    useEffect(() => {           
  document.documentElement.classList.add("dark")
}, [])

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

      <Route
        path="/mock-interview"
        d element={
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster/>
              <Sonner />
              <MockInterview />
            </TooltipProvider>
          </QueryClientProvider>
        }
      />
    </Routes>

</div>
)
}

export default App
