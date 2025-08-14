// app/components/RenewalPopup.js
'use client';
import { useSubscription } from '@/context/SubscriptionContext';
import { useEffect, useState } from 'react';

const RenewalPopup = () => {
    const subscription = useSubscription();
    const [showPopup, setShowPopup] = useState(false);
    useEffect(() => {
        if (subscription) {
            const currentDate = new Date();
            const endDate = new Date(subscription.endDate);
            const daysLeft = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));
            if (daysLeft <= 15 && daysLeft > 0) {
                setShowPopup(true);
            }
        }
    }, [subscription]);
    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-xl font-bold">Renew Your Plan</h2>
                <p className="mt-4">
                    Your subscription ends in{' '}
                    {Math.ceil((new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days.
                </p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => setShowPopup(false)}
                >
                    Dismiss
                </button>
            </div>
        </div>
    );
};

export default RenewalPopup;
