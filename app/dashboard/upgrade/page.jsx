'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { createStripeCheckoutSession } from './stripe_action';
import { toast, Toaster } from 'sonner';
import { CheckCircle2 } from 'lucide-react'; // A nice icon for the feature list

// Initialize Stripe.js with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Define your pro features in an array for easy management
const proFeatures = [
  "Unlimited Mock Interviews",
  "Detailed AI Feedback on Every Answer",
  "In-depth Performance Analytics",
  "Access to All Question Banks",
  "Priority Email Support"
];

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);

  const handleUpgradeClick = async () => {
    setLoading(true);
    toast.info("Redirecting to secure checkout...");

    try {
      const { sessionId, error } = await createStripeCheckoutSession();
      if (error) throw new Error(error);

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe.js has not loaded yet.");

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) throw new Error(stripeError.message);

    } catch (err) {
      console.error("Upgrade Error:", err.message);
      toast.error(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 bg-gray-50">
      <Toaster richColors />
      <div className="max-w-md w-full text-center p-8 bg-white border rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Upgrade to Pro</h1>
        <p className="mt-2 text-gray-600">
          Supercharge your interview preparation with our premium features.
        </p>
        
        {/* Pricing Display */}
        <div className="my-8">
          <p className="text-5xl font-extrabold text-blue-600">
            $3<span className="text-2xl font-medium text-gray-500"> AUD/month</span>
          </p>
        </div>

        {/* Feature List */}
        <div className="text-left space-y-3 my-8">
          {proFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Upgrade Button */}
        <button
          onClick={handleUpgradeClick}
          disabled={loading}
          className="w-full px-8 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Upgrade Now"}
        </button>
      </div>
    </div>
  );
}