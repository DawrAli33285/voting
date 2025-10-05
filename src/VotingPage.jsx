import { useState } from 'react';
import { Vote, CreditCard, Lock, Shield } from 'lucide-react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51OwuO4LcfLzcwwOYdssgGfUSfOgWT1LwO6ewi3CEPewY7WEL9ATqH6WJm3oAcLDA3IgUvVYLVEBMIEu0d8fUwhlw009JwzEYmV');


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
};

const VotingForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [votingCode, setVotingCode] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const [touched, setTouched] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false
  });

  const handleBlur = (field) => (event) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (field) => (event) => {
    if (event.error) {
      setCardErrors(prev => ({ ...prev, [field]: event.error.message }));
    } else {
      setCardErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getFieldError = (field) => {
    return touched[field] && cardErrors[field] ? cardErrors[field] : '';
  };

  const handleVote = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh the page.');
      return;
    }

  
    if (cardErrors.cardNumber || cardErrors.cardExpiry || cardErrors.cardCvc) {
      setError('Please fix the card information errors before submitting.');
      return;
    }

    setTouched({
      cardNumber: true,
      cardExpiry: true,
      cardCvc: true
    });

    
    if (cardErrors.cardNumber || cardErrors.cardExpiry || cardErrors.cardCvc) {
      setError('Please fix the card information errors before submitting.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
    
      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      
      if (!cardNumberElement._complete || !cardExpiryElement._complete || !cardCvcElement._complete) {
        setError('Please complete all card details.');
        setProcessing(false);
        return;
      }

   
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
      });

      if (pmError) {
        setError(pmError.message);
        setProcessing(false);
        return;
      }

      console.log('PaymentMethod created:', paymentMethod.id);

      
      const response = await axios.post("https://votingfrontend-rho.vercel.app/vote", {
        code: votingCode,
        paymentMethod: paymentMethod.id
      });

      alert(`Vote submitted for contestant: ${votingCode}`);
      window.location.href='/'
      
    } catch (e) {
      console.error('Voting error:', e);
      if (e?.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("Error occurred while voting");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
          <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
            <Vote className="w-10 h-10" /> Cast Your Vote
          </h2>
          
          <form onSubmit={handleVote} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Enter Contestant Code</label>
              <input
                type="text"
                value={votingCode}
                onChange={(e) => setVotingCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:border-purple-400 text-white placeholder-purple-300 font-mono text-xl"
                placeholder="CONT123ABC456"
                required
              />
              <p className="text-sm text-purple-200 mt-2">Ask your favorite contestant for their unique code</p>
            </div>

      
            <div className="bg-white/10 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Payment Information
              </h3>
              
           
              <div>
                <label className="block mb-2 text-sm font-medium text-purple-200">
                  Card Number
                </label>
                <div className={`px-4 py-3 rounded-lg bg-white/20 border transition-colors ${
                  getFieldError('cardNumber') 
                    ? 'border-red-400 bg-red-500/20' 
                    : 'border-white/30 focus-within:border-purple-400'
                }`}>
                  <CardNumberElement 
                    options={ELEMENT_OPTIONS}
                    onBlur={handleBlur('cardNumber')}
                    onChange={handleChange('cardNumber')}
                  />
                </div>
                {getFieldError('cardNumber') && (
                  <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                    <span>⚠</span> {getFieldError('cardNumber')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
             
                <div>
                  <label className="block mb-2 text-sm font-medium text-purple-200">
                    Expiry Date
                  </label>
                  <div className={`px-4 py-3 rounded-lg bg-white/20 border transition-colors ${
                    getFieldError('cardExpiry') 
                      ? 'border-red-400 bg-red-500/20' 
                      : 'border-white/30 focus-within:border-purple-400'
                  }`}>
                    <CardExpiryElement 
                      options={ELEMENT_OPTIONS}
                      onBlur={handleBlur('cardExpiry')}
                      onChange={handleChange('cardExpiry')}
                    />
                  </div>
                  {getFieldError('cardExpiry') && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <span>⚠</span> {getFieldError('cardExpiry')}
                    </p>
                  )}
                </div>

            
                <div>
                  <label className="block mb-2 text-sm font-medium text-purple-200">
                    CVC
                  </label>
                  <div className={`px-4 py-3 rounded-lg bg-white/20 border transition-colors ${
                    getFieldError('cardCvc') 
                      ? 'border-red-400 bg-red-500/20' 
                      : 'border-white/30 focus-within:border-purple-400'
                  }`}>
                    <CardCvcElement 
                      options={ELEMENT_OPTIONS}
                      onBlur={handleBlur('cardCvc')}
                      onChange={handleChange('cardCvc')}
                    />
                  </div>
                  {getFieldError('cardCvc') && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <span>⚠</span> {getFieldError('cardCvc')}
                    </p>
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">⚠</span>
                  <span className="font-semibold">Error</span>
                </div>
                {error}
              </div>
            )}

            <div className="bg-white/20 rounded-lg p-6">
              <h3 className="font-semibold mb-4 text-xl">How Voting Works</h3>
              <ul className="space-y-2 text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">1.</span>
                  <span>Get the unique code from your favorite contestant</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">2.</span>
                  <span>Enter the code above</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">3.</span>
                  <span>Complete the $10 payment to cast your vote</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">4.</span>
                  <span>Your vote will be counted immediately</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Voting Fee: $10 per vote</span>
              </div>
              <p className="text-sm text-purple-200">Secure payment required to complete voting</p>
            </div>
            
            <button
              type="submit"
              disabled={!stripe || processing}
              className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                processing
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:shadow-2xl hover:scale-105'
              }`}
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Vote className="w-6 h-6" />
                  Pay $10 & Cast Vote
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


const VotingPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <VotingForm />
    </Elements>
  );
};

export default VotingPage;