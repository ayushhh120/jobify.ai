import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './index.css';
import 'remixicon/fonts/remixicon.css'
import {BrowserRouter} from 'react-router-dom'
import { UserContextProvider } from './context/UserContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </UserContextProvider>
    
  </StrictMode>
)
