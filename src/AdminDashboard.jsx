import React, { useEffect, useState } from 'react';
import { Upload, Users, Trophy, CreditCard, Vote, Shield, CheckCircle, ArrowRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("home");
    const [contestants, setContestants] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const adminAuth = localStorage.getItem('adminAuth');
        if (adminAuth === 'true') {
            setIsAuthenticated(true);
            getAdminData();
        }
    }, [])

    const getAdminData = async () => {
        try {
            let response = await axios.get("https://votingfrontend-rho.vercel.app/getContestantData")
            setContestants(response.data.contestants || [])
        } catch (e) {
            console.log(e.message)
            if (e?.response?.data?.error) {
                alert(e?.response?.data?.error)
            } else {
                alert("Something went wrong please try again")
            }
        }
    }

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginData.email === 'voteadmin@gmail.com' && loginData.password === 'admin') {
            setIsAuthenticated(true);
            localStorage.setItem('adminAuth', 'true');
            getAdminData();
        } else {
            alert('Invalid admin credentials');
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('adminAuth');
        setLoginData({ email: '', password: '' });
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center py-16 px-4">
                <div className="container mx-auto max-w-md">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/30 rounded-full mb-4">
                                <Shield className="w-8 h-8 text-purple-300" />
                            </div>
                            <h2 className="text-4xl font-bold mb-2">Admin Login</h2>
                            <p className="text-purple-200">Enter admin credentials to access dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block mb-2 font-semibold flex items-center gap-2">
                                    <LogIn className="w-4 h-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300"
                                    placeholder="voteadmin@gmail.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-lg text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Login as Admin
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <button 
                                onClick={() => navigate('/')}
                                className="text-purple-300 hover:text-white transition-colors text-sm"
                            >
                                ← Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalVotes = contestants.reduce((sum, contestant) => sum + (contestant.totalVotes || 0), 0);
    const totalRevenue = (contestants.length * 50) + (totalVotes * 10);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-16">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-white hover:text-purple-300 transition-colors"
                    >
                        ← Back to Home
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
                    <h2 className="text-4xl font-bold mb-8 flex items-center gap-3">
                        <Shield className="w-10 h-10" /> Admin Dashboard
                    </h2>
                    
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6">
                            <Users className="w-10 h-10 mb-3" />
                            <h3 className="text-2xl font-bold">{contestants.length}</h3>
                            <p className="text-blue-100">Total Contestants</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6">
                            <Vote className="w-10 h-10 mb-3" />
                            <h3 className="text-2xl font-bold">{totalVotes}</h3>
                            <p className="text-green-100">Total Votes Cast</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6">
                            <CreditCard className="w-10 h-10 mb-3" />
                            <h3 className="text-2xl font-bold">${totalRevenue}</h3>
                            <p className="text-yellow-100">Total Revenue</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6">
                            <Trophy className="w-10 h-10 mb-3" />
                            <h3 className="text-2xl font-bold">
                                {contestants.length > 0 ? contestants.sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))[0].name : 'N/A'}
                            </h3>
                            <p className="text-purple-100">Leading Contestant</p>
                        </div>
                    </div>
                    
                    <div className="bg-white/20 rounded-xl p-6">
                        <h3 className="text-2xl font-bold mb-4">Contestant Leaderboard</h3>
                        <div className="space-y-4">
                            {contestants.length === 0 ? (
                                <p className="text-purple-200 text-center py-8">No contestants registered yet</p>
                            ) : (
                                contestants
                                    .sort((a, b) => (b.totalVotes || 0) - (a.totalVotes || 0))
                                    .map((contestant, idx) => (
                                        <div key={contestant._id} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="text-3xl font-bold text-yellow-400">#{idx + 1}</div>
                                                <div>
                                                    <h4 className="font-bold text-lg">{contestant.name}</h4>
                                                    <p className="text-sm text-purple-200">{contestant.email}</p>
                                                    <p className="text-xs text-purple-300">Phone: {contestant.phone}</p>
                                                    <p className="text-xs text-purple-300">Code: {contestant.code}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-green-400">{contestant.totalVotes || 0}</div>
                                                <p className="text-sm text-purple-200">votes</p>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                    <div className="bg-white/20 rounded-xl p-6 mt-6">
                        <h3 className="text-2xl font-bold mb-4">Payment Reports</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">Registration Revenue</h4>
                                <p className="text-2xl font-bold">${contestants.length * 50}</p>
                                <p className="text-sm text-green-200">{contestants.length} contestants × $50</p>
                            </div>
                            <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
                                <h4 className="font-semibold mb-2">Voting Revenue</h4>
                                <p className="text-2xl font-bold">${totalVotes * 10}</p>
                                <p className="text-sm text-blue-200">{totalVotes} votes × $10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;