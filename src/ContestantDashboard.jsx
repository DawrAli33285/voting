import React, { useEffect, useState } from 'react';
import { Users, Trophy, CreditCard, Vote, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const ContestantDashboard = () => {
    const [contestant, setContestant] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getContestantData();
    }, [])

    const getContestantData = async () => {
        try {
            let user = JSON.parse(localStorage.getItem('user'))
            let email = user.email
            let response = await axios.post("https://votingfrontend-rho.vercel.app/ContestantData", { email })
           console.log(response.data)
            setContestant(response.data.contestants)
        } catch (e) {
            console.log(e.message)
            if (e?.response?.data?.error) {
                alert(e?.response?.data?.error)
            } else {
                alert("Something went wrong please try again")
            }
        }
    }

    if (!contestant) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-16">
            <div className="container mx-auto px-4">
                <button 
                    onClick={() => navigate('/')}
                    className="text-white mb-6 hover:text-purple-300 transition-colors"
                >
                    ← Back to Home
                </button>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                        <div>
                            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
                                <Award className="w-10 h-10" /> My Dashboard
                            </h2>
                            <p className="text-purple-200">Welcome back, {contestant.name}!</p>
                        </div>
                        <div className="bg-purple-500/20 border border-purple-400 rounded-lg p-4 mt-4 md:mt-0">
                            <p className="text-sm text-purple-300">Your Contestant Code</p>
                            <p className="text-xl font-mono font-bold text-yellow-400">{contestant.code}</p>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
                            <Users className="w-10 h-10 mb-3" />
                            <h3 className="text-2xl font-bold">{contestant?.totalVotes?contestant?.totalVotes?.toString():'0'}</h3>
                            <p className="text-blue-100">Total Votes</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
                            <Vote className="w-10 h-10 mb-3" />
                            <h3 className="text-2xl font-bold">
                               ${contestant?.totalVotes?contestant.totalVotes * 10:'0'} 
                            </h3>
                            <p className="text-green-100">Vote Revenue</p>
                        </div>
                    
                    </div>
                    
                    <div className="bg-white/20 rounded-xl p-6">
                        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-6 h-6" />
                            Your Performance
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-bold text-lg mb-2">Share Your Code</h4>
                                <p className="text-purple-200 mb-3">Share this code with your supporters so they can vote for you:</p>
                                <div className="bg-black/30 rounded-lg p-3">
                                    <code className="text-xl font-mono font-bold text-yellow-400 break-all">
                                        {contestant.code}
                                    </code>
                                </div>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-bold text-lg mb-2">Contact Information</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-purple-200">
                                    <div>
                                        <p className="text-sm text-purple-300">Email</p>
                                        <p>{contestant.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-purple-300">Phone</p>
                                        <p>{contestant.phone}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-bold text-lg mb-2">Your Video</h4>
                                <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center">
                                    <video 
                                        src={contestant.video} 
                                        controls 
                                        className="max-w-full max-h-64 rounded-lg"
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContestantDashboard;