import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Upload, Users, Trophy, CreditCard, Vote, Shield, CheckCircle, ArrowRight, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'


const stripePromise = loadStripe('pk_test_51OwuO4LcfLzcwwOYdssgGfUSfOgWT1LwO6ewi3CEPewY7WEL9ATqH6WJm3oAcLDA3IgUvVYLVEBMIEu0d8fUwhlw009JwzEYmV')


const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      letterSpacing: '0.025em',
      fontFamily: 'Source Code Pro, monospace',
      '::placeholder': {
        color: '#c4b5fd',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
}

const CheckoutForm = ({ registrationData, onSuccess,setUserCode}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  })

  const handleCardChange = (elementType) => (event) => {
    if (event.error) {
      setCardErrors(prev => ({ ...prev, [elementType]: event.error.message }))
    } else {
      setCardErrors(prev => ({ ...prev, [elementType]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }
    if (cardErrors.cardNumber || cardErrors.cardExpiry || cardErrors.cardCvc) {
      setError('Please fix the card information errors before submitting.')
      return
    }

    setProcessing(true)
    setError(null)

  
    const cardNumberElement = elements.getElement(CardNumberElement)

    try{

      
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: registrationData.name,
          email: registrationData.email,
          phone: registrationData.phone,
        },
      })
      let formdata=new FormData();
      formdata.append('name',registrationData.name)
      formdata.append('email',registrationData.email)
      formdata.append('phone',registrationData.phone)
      formdata.append('video',registrationData.video)
      formdata.append('paymentMethod',paymentMethod.id)

      let response=await axios.post(`https://votingfrontend-rho.vercel.app/registerContestant`,formdata)
      alert(response.data.message)
    
        setSucceeded(true)
        setProcessing(false)
        
console.log("contestantCode")
        console.log(response.data)
        console.log(response.data.contestantCode)
        const code = response.data.contestantCode
        setUserCode(code)
        onSuccess(code)
  
    }catch(e){
      console.log(e.message)
      setProcessing(false)
        
      if(e?.response?.data?.error){
        alert(e?.response?.data?.error)
      }else{
        alert("Something went wrong please try again")
      }
      setProcessing(false)
    }
  
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/10 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Payment Information
        </h3>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-purple-200">
            Card Number
          </label>
          <div className={`px-4 py-3 rounded-lg bg-white/20 border ${cardErrors.cardNumber ? 'border-red-400' : 'border-white/30'} focus-within:border-purple-400 transition-colors`}>
            <CardNumberElement 
              options={ELEMENT_OPTIONS}
              onChange={handleCardChange('cardNumber')}
            />
          </div>
          {cardErrors.cardNumber && (
            <p className="mt-1 text-sm text-red-400">{cardErrors.cardNumber}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-purple-200">
              Expiry Date
            </label>
            <div className={`px-4 py-3 rounded-lg bg-white/20 border ${cardErrors.cardExpiry ? 'border-red-400' : 'border-white/30'} focus-within:border-purple-400 transition-colors`}>
              <CardExpiryElement 
                options={ELEMENT_OPTIONS}
                onChange={handleCardChange('cardExpiry')}
              />
            </div>
            {cardErrors.cardExpiry && (
              <p className="mt-1 text-sm text-red-400">{cardErrors.cardExpiry}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-purple-200">
              CVC
            </label>
            <div className={`px-4 py-3 rounded-lg bg-white/20 border ${cardErrors.cardCvc ? 'border-red-400' : 'border-white/30'} focus-within:border-purple-400 transition-colors`}>
              <CardCvcElement 
                options={ELEMENT_OPTIONS}
                onChange={handleCardChange('cardCvc')}
              />
            </div>
            {cardErrors.cardCvc && (
              <p className="mt-1 text-sm text-red-400">{cardErrors.cardCvc}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4">
          <Shield className="w-4 h-4 text-green-400 mt-0.5" />
          <p className="text-xs text-purple-200">
            Your payment information is encrypted and secure. We use Stripe to process payments.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-400 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}

      <div className="bg-yellow-500/20 border border-yellow-400 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold">Registration Fee</span>
          </div>
          <span className="text-2xl font-bold">$50.00</span>
        </div>
        <p className="text-sm text-purple-200">One-time payment for contest registration</p>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-300 ${
          processing || succeeded
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-2xl hover:scale-105'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </span>
        ) : succeeded ? (
          'Payment Successful!'
        ) : (
          'Complete Registration & Pay $50'
        )}
      </button>
    </form>
  )
}

const RegistrationPage = () => {
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    video: null
  })
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [fileError, setFileError] = useState("")
  const navigate = useNavigate()
  const MAX_FILE_SIZE = 50 * 1024 * 1024

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    setFileError('') 
    setRegistrationData({ ...registrationData, video: null })

    if (!file) {
      return
    }

   
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Please upload a valid video file (MP4, MOV, AVI, or WebM).')
      e.target.value = ''
      return
    }

   
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2)
      const maxSizeInMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(2)
      setFileError(`File size (${fileSizeInMB}MB) exceeds the maximum allowed size of ${maxSizeInMB}MB.`)
      e.target.value = ''
      return
    }

   
    setRegistrationData({ ...registrationData, video: file })
  }

  const handleInitialSubmit = (e) => {
    e.preventDefault()
    
    if (fileError) {
      alert('Please fix the file upload errors before continuing.')
      return
    }
    
    if (!registrationData.video) {
      alert('Please upload a video file.')
      return
    }
    
    setShowPayment(true)
  }

  const handlePaymentSuccess = (code) => {
    setUserCode(code)
    setShowSuccess(true)
    setShowPayment(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={() => navigate('/')}
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
          ) : !showPayment ? (
            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData({ ...registrationData, name: e.target.value })}
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
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
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
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Upload Your Video</label>
                <div className={`border-2 border-dashed ${fileError ? 'border-red-400' : 'border-white/30'} rounded-lg p-8 text-center hover:border-purple-400 transition-colors`}>
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
                {fileError && (
                  <p className="mt-2 text-sm text-red-400">{fileError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={fileError || !registrationData.video}
                className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  fileError || !registrationData.video
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-2xl hover:scale-105'
                }`}
              >
                Continue to Payment
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <Elements stripe={stripePromise}>
              <div className="space-y-6">
                <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-400">
                  <h3 className="font-semibold mb-2">Registration Details</h3>
                  <div className="text-sm space-y-1 text-purple-200">
                    <p>Name: {registrationData.name}</p>
                    <p>Email: {registrationData.email}</p>
                    <p>Video: {registrationData.video?.name}</p>
                  </div>
                </div>
                
                <CheckoutForm 
                  registrationData={registrationData} 
                  onSuccess={handlePaymentSuccess}
                  setUserCode={setUserCode}
                />
                
                <button
                  onClick={() => window.location.href='/register'}
                  className="text-purple-300 hover:text-white transition-colors text-sm"
                >
                  ← Back to registration details
                </button>
              </div>
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegistrationPage