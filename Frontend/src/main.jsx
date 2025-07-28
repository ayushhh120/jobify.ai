import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css';
import './index.css'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import {BrowserRouter} from 'react-router-dom'
import { UserContextProvider } from './context/UserContext';
import { ThemeProvider } from '@/context/ThemeContext'
import 'remixicon/fonts/remixicon.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
    <BrowserRouter>
    <ThemeProvider>
    <App />
    </ThemeProvider>
    </BrowserRouter>
    </UserContextProvider>
    
  </StrictMode>
)
