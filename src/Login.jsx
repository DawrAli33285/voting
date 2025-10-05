import React, { useState } from 'react';
import { LogIn, Mail, Key, ArrowRight } from 'lucide-react';

import axios from 'axios'
export default function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
  try{
    setIsLoading(true);
   let response=await axios.post("https://votingfrontend-rho.vercel.app/login",loginData)

    
      console.log('Login attempt:', loginData);
      setIsLoading(false);
      alert(response.data.message);
localStorage.setItem("user",JSON.stringify(response.data.contestant))

window.location.href='/'
  }catch(e){
    console.log(e.message)
    setIsLoading(false);
if(e?.response?.data?.error){
alert(e?.response?.data?.error)
}else{
alert("Something went wrong please try again")
}
  }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/30 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
            <p className="text-purple-200">Login to access your contestant dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-white placeholder-purple-300 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold flex items-center gap-2">
                <Key className="w-4 h-4" />
                Contestant Code
              </label>
              <input
                type="text"
                value={loginData.code}
                onChange={(e) => setLoginData({ ...loginData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-white placeholder-purple-300 font-mono text-lg transition-all"
                placeholder="CONT-XXXX"
                required
              />
              <p className="mt-2 text-sm text-purple-300">
                Enter the unique code you received after registration
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-2xl hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-purple-300 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                Register here
              </a>
            </p>
          </div>

          <div className="mt-4 text-center">
            <a href="/forgot-code" className="text-purple-300 hover:text-white text-sm transition-colors">
              Forgot your code?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}