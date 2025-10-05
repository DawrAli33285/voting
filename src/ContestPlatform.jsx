import React, { useState } from 'react';
import { Upload, Users, Trophy, CreditCard, Vote, Shield, CheckCircle, ArrowRight } from 'lucide-react';

const ContestPlatform = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [contestants, setContestants] = useState([]);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    video: null
  });
  const [votingCode, setVotingCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userCode, setUserCode] = useState('');


  const processPayment = (amount, type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, transactionId: `TXN${Date.now()}` });
      }, 1500);
    });
  };

 
  const generateUniqueCode = () => {
    return `CONT${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

 
  const handleRegistration = async (e) => {
    e.preventDefault();
    
    if (!registrationData.name || !registrationData.email || !registrationData.video) {
      alert('Please fill all fields and upload a video');
      return;
    }

    
    const payment = await processPayment(50, 'registration');
    
    if (payment.success) {
      const code = generateUniqueCode();
      const newContestant = {
        ...registrationData,
        code,
        votes: 0,
        registeredAt: new Date().toISOString()
      };
      
      setContestants([...contestants, newContestant]);
      setUserCode(code);
      setShowSuccess(true);
      setRegistrationData({ name: '', email: '', phone: '', video: null });
      
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('home');
      }, 5000);
    }
  };


  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes('video')) {
      setRegistrationData({ ...registrationData, video: file });
    } else {
      alert('Please upload a valid video file');
    }
  };

 
  const handleVote = async (e) => {
    e.preventDefault();
    
    const contestant = contestants.find(c => c.code === votingCode);
    
    if (!contestant) {
      alert('Invalid contestant code');
      return;
    }

    const payment = await processPayment(10, 'voting');
    
    if (payment.success) {
      const updatedContestants = contestants.map(c => 
        c.code === votingCode ? { ...c, votes: c.votes + 1 } : c
      );
      setContestants(updatedContestants);
      alert(`Vote successfully cast for ${contestant.name}!`);
      setVotingCode('');
    }
  };

  
  const HomePage = () => (
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
              onClick={() => setActiveTab('register')}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Register as Contestant <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab('vote')}
              className="bg-white text-purple-900 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Vote Now <Vote className="w-5 h-5" />
            </button>
          </div>
        </div>

       
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

  
  const RegistrationPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <button 
          onClick={() => setActiveTab('home')}
          className="text-white mb-6 hover:text-purple-300 transition-colors"
        >
          ← Back to Home
        </button>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-10 h-10" /> Contestant Registration
          </h2>
          
          {showSuccess ? (
            <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-2xl font-bold mb-4">Registration Successful!</h3>
              <p className="text-xl mb-2">Your unique contestant code is:</p>
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <code className="text-3xl font-mono font-bold text-yellow-400">{userCode}</code>
              </div>
              <p className="text-purple-200">Share this code with your supporters so they can vote for you!</p>
            </div>
          ) : (
            <form onSubmit={handleRegistration} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold">Email Address</label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold">Phone Number</label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-semibold">Upload Your Video</label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    required
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    {registrationData.video ? (
                      <span className="text-green-400">✓ {registrationData.video.name}</span>
                    ) : (
                      <span className="text-purple-200">Click to upload video (MP4, MOV, AVI)</span>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Registration Fee: $50</span>
                </div>
                <p className="text-sm text-purple-200">Secure payment will be processed upon submission</p>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Complete Registration & Pay $50
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

}
