import React, { useState } from 'react';
import { Upload, Users, Trophy, CreditCard, Vote, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import Navigation from './Navigation'
import { useNavigate } from 'react-router-dom';
function HomePage() {
  const [currentView, setCurrentView] = useState('home');
  const [contestants] = useState([]); 
const navigate=useNavigate();
  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Contestant Registration</h2>
          <p className="mb-4">Registration form will be displayed here.</p>
          <button 
            onClick={() => setCurrentView('home')}
            className="bg-white text-purple-900 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'vote') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Vote for Your Favorite</h2>
          <p className="mb-4">Voting interface will be displayed here.</p>
          <button 
            onClick={() => setCurrentView('home')}
            className="bg-white text-purple-900 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white mb-16">
          <Trophy className="w-20 h-20 mx-auto mb-6 text-yellow-400" />
      
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-pink-400">
            Star Contest 2025
          </h1>
          <p className="text-2xl mb-8 text-purple-200">
            Showcase Your Talent. Win Amazing Prizes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Register as Contestant <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/vote' )}
              className="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Vote Now <Vote className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white hover:bg-white/20 transition-all">
            <Upload className="w-12 h-12 mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-3">Easy Registration</h3>
            <p className="text-purple-200">Sign up in minutes, upload your video, and get your unique contestant code instantly.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white hover:bg-white/20 transition-all">
            <Shield className="w-12 h-12 mb-4 text-green-400" />
            <h3 className="text-2xl font-bold mb-3">Secure Payments</h3>
            <p className="text-purple-200">All transactions are protected with industry-standard encryption and security protocols.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white hover:bg-white/20 transition-all">
            <Trophy className="w-12 h-12 mb-4 text-pink-400" />
            <h3 className="text-2xl font-bold mb-3">Fair Voting</h3>
            <p className="text-purple-200">Every vote counts. Real-time tracking ensures complete transparency in the contest.</p>
          </div>
        </div>

        {/* Current Contestants */}
        {contestants.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <Users className="w-8 h-8" /> Current Contestants
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contestants.map((contestant, idx) => (
                <div key={idx} className="bg-white/20 rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{contestant.name}</h3>
                  <p className="text-purple-200 mb-3">Code: {contestant.code}</p>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold text-2xl">{contestant.votes}</span>
                    <span className="text-purple-200">votes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;