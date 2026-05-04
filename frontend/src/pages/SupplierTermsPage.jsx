import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const SupplierTermsPage = () => {
  const lastUpdated = 'February 1, 2025';

  const sections = [
    {
      title: '1. Supplier Eligibility',
      content: `Suppliers must provide accurate listings, valid licenses/permits where required, and comply with local laws and safety standards.`
    },
    {
      title: '2. Listings & Content',
      content: `Suppliers are responsible for accurate descriptions, pricing, availability, and cancellation terms. Orbito may edit or remove listings that are misleading or outdated.`
    },
    {
      title: '3. Bookings & Fulfillment',
      content: `Suppliers must honor confirmed bookings. Failure to fulfill may result in penalties, refunds, or removal from the platform.`
    },
    {
      title: '4. Cancellations & Refunds',
      content: `Suppliers must follow their stated cancellation policy. Refunds are processed according to the policy shown to the customer at booking.`
    },
    {
      title: '5. Payments & Payouts',
      content: `Payment flows depend on the commercial model (affiliate vs marketplace). Payout schedules, fees, and chargeback handling are defined in supplier onboarding agreements.`
    },
    {
      title: '6. Prohibited Activities',
      content: `Suppliers must not discriminate, engage in unsafe practices, or sell prohibited experiences.`
    },
    {
      title: '7. Contact',
      content: `To become a supplier or update your listings, contact our partnerships team.`
    }
  ];

  return (
    <>
      <Helmet>
        <title>Supplier Terms | Orbito</title>
        <meta name="description" content="Terms and conditions for tour operators and suppliers listing experiences on the Orbito platform." />
        <link rel="canonical" href="https://orbitotrip.com/supplier-terms" />
      </Helmet>
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-bold text-[#0B3D91] mb-2">Supplier Terms</h1>
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

export default SupplierTermsPage;
