import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import RegistrationPage from './RegistrationPage.jsx'
import Navigation from './Navigation.jsx'
import VotingPage from './VotingPage.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import LoginPage from './Login.jsx'
import ResetCodePage from './ResetCode.jsx'
import ContestantDashboard from './ContestantDashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path='/register' element={<RegistrationPage/>}/>
        <Route path='/vote' element={<VotingPage/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/forgot-code' element={<ResetCodePage/>}/>
        <Route path='/contestant' element={<ContestantDashboard/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)