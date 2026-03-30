import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const RefundPolicyPage = () => {
  const lastUpdated = 'February 1, 2025';

  const sections = [
    {
      title: '1. Overview',
      content: `This Refund Policy explains how cancellations and refunds work for tours and experiences booked through Orbito. 
Refund eligibility depends on the supplier’s cancellation policy and the time of cancellation.`
    },
    {
      title: '2. Cancellations',
      content: `Each tour listing shows its cancellation window and whether free cancellation is available. 
To cancel, go to your account bookings and submit a cancellation request.`
    },
    {
      title: '3. Refund Timelines',
      content: `If your booking is eligible for a refund, we process it as quickly as possible. 
Banks and payment providers may take additional time to post the refund (typically 5–10 business days).`
    },
    {
      title: '4. Non‑Refundable Bookings',
      content: `Some bookings are marked as non‑refundable by the supplier. These will be clearly labeled before purchase.`
    },
    {
      title: '5. Changes & No‑Shows',
      content: `Changes to bookings are subject to supplier availability and may incur fees. 
No‑show bookings are generally not refundable.`
    },
    {
      title: '6. Contact',
      content: `If you need help with a refund, contact support with your booking reference.`
    }
  ];

  return (
    <>
      <Helmet>
        <title>Refund Policy - Orbito</title>
      </Helmet>
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-[#0B3D91] mb-2">Refund Policy</h1>
            <p className="text-sm text-gray-500 mb-10">Last updated: {lastUpdated}</p>
            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h2>
                  <p className="text-gray-600 whitespace-pre-line">{section.content}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RefundPolicyPage;
