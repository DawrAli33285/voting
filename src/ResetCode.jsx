import React, { useState } from 'react';
import { LogIn, Mail, Key, ArrowRight, Copy, CheckCircle, X } from 'lucide-react';
import axios from 'axios';

export default function ResetCodePage() {
  const [loginData, setLoginData] = useState({
    email: ''
  });

  const [code, setCode] = useState("");
  const [showCodePopup, setShowCodePopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let response = await axios.patch("https://votingfrontend-rho.vercel.app/resetCode", loginData);

      console.log('Reset code response:', response.data);
      setIsLoading(false);
      setCode(response.data.code);
      setShowCodePopup(true);
    } catch (e) {
      console.log(e.message);
      setIsLoading(false);
      if (e?.response?.data?.error) {
        alert(e?.response?.data?.error);
      } else {
        alert("Something went wrong please try again");
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const closePopup = () => {
    setShowCodePopup(false);
    setLoginData({ email: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center py-16 px-4">
      <div className="container mx-auto max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/30 rounded-full mb-4">
              <Key className="w-8 h-8 text-purple-300" />
            </div>
            <h2 className="text-4xl font-bold mb-2">Reset Your Code</h2>
            <p className="text-purple-200">Enter your email to get a new code</p>
          </div>

          {!showCodePopup ? (
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
                    Resetting Code...
                  </>
                ) : (
                  <>
                    Reset Code
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-2xl font-bold mb-2">Code Reset Successful!</h3>
                <p className="text-purple-200 mb-4">Your new contestant code has been generated</p>
                
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <p className="text-sm text-purple-300 mb-2">Your new code:</p>
                  <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                    <code className="text-xl font-mono font-bold text-yellow-400 break-all">
                      {code}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="ml-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-purple-300" />
                      )}
                    </button>
                  </div>
                </div>
                
                {copied && (
                  <p className="text-green-400 text-sm flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Code copied to clipboard!
                  </p>
                )}
                
                <p className="text-sm text-purple-300 mt-4">
                  Save this code securely. You'll need it to log in and track your votes.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={closePopup}
                  className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-semibold"
                >
                  Reset Another Code
                </button>
                <a
                  href="/login"
                  className="flex-1 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors font-semibold text-center"
                >
                  Go to Login
                </a>
              </div>
            </div>
          )}

          {!showCodePopup && (
            <div className="mt-6 text-center">
              <p className="text-purple-300 text-sm">
                Remember your code?{' '}
                <a href="/login" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Login here
                </a>
              </p>
            </div>
          )}
        </div>
      </div>

    
      {showCodePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white shadow-2xl max-w-md w-full">
            <div className="text-center space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Code Reset Successful!</h3>
                <button
                  onClick={closePopup}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <CheckCircle className="w-16 h-16 mx-auto text-green-400" />
              
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm text-purple-300 mb-2">Your new contestant code:</p>
                <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                  <code className="text-xl font-mono font-bold text-yellow-400 break-all">
                    {code}
                  </code>
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-300" />
                    )}
                  </button>
                </div>
              </div>
              
              {copied && (
                <p className="text-green-400 text-sm flex items-center justify-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Code copied to clipboard!
                </p>
              )}
              
              <p className="text-sm text-purple-300">
                Save this code securely. You'll need it to log in and track your votes.
              </p>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={closePopup}
                  className="flex-1 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors font-semibold"
                >
                  Close
                </button>
                <a
                  href="/login"
                  className="flex-1 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 transition-colors font-semibold text-center"
                >
                  Login Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}