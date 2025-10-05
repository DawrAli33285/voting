

import HomePage from './App'
 import RegistrationPage from './RegistrationPage'
 import VotingPage from './VotingPage'
 import AdminDashboard from './AdminDashboard'
import { Link } from 'react-router-dom'
import { Upload, Users, Trophy, CreditCard, Vote, Shield, CheckCircle, ArrowRight } from 'lucide-react'

 const Navigation = () => {
    return (
      <nav className="bg-purple-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Star Contest
          </Link>
          <div className="flex gap-4">
            <Link to="/" className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10">
              Home
            </Link>
           {localStorage.getItem('user')?<p onClick={()=>{
            localStorage.removeItem('user')
            window.location.href='/'
           }} className="px-4 py-2 cursor-pointer rounded-lg transition-colors text-white hover:bg-white/10">
              Logout
            </p>: <Link to="/login" className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10">
              Login
            </Link>}
           {localStorage.getItem('user')?'': <Link to="/register" className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10">
              Register
            </Link>}
            <Link to="/vote" className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10">
              Vote
            </Link>
            <Link to="/admin" className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10">
              Admin
            </Link>
            {localStorage.getItem('user')?<Link to="/contestant" className="px-4 py-2 rounded-lg transition-colors text-white hover:bg-white/10">
              Contestant Dashboard
            </Link>:''}
          </div>
        </div>
      </nav>
    );
  };
  export default Navigation