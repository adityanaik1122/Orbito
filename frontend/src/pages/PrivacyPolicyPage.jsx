import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
    const lastUpdated = 'February 1, 2025';

    const sections = [
        {
            title: '1. Information We Collect',
            content: `We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This includes:
            
• Account information (name, email, password)
• Profile information (travel preferences, interests)
• Itinerary data (destinations, dates, activities)
• Payment information (processed securely through our payment providers)
• Communications with our support team`
        },
        {
            title: '2. How We Use Your Information',
            content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Create personalized travel itineraries using AI
• Process transactions and send related information
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Analyze usage patterns to enhance user experience
• Protect against fraudulent or unauthorized activity`
        },
        {
            title: '3. Information Sharing',
            content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With your consent or at your direction
• With service providers who assist in our operations
• To comply with legal obligations
• To protect the rights and safety of Orbito and our users
• In connection with a merger, acquisition, or sale of assets`
        },
        {
            title: '4. Data Security',
            content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

• Encryption of data in transit and at rest
• Regular security assessments and audits
• Access controls and authentication measures
• Secure data storage on encrypted servers`
        },
        {
            title: '5. Your Rights and Choices',
            content: `You have the right to:

• Access and receive a copy of your personal data
• Request correction of inaccurate data
• Request deletion of your data
• Opt-out of marketing communications
• Export your itineraries and travel data
• Close your account at any time

To exercise these rights, please contact us at privacy@orbito.com.`
        },
        {
            title: '6. Cookies and Tracking',
            content: `We use cookies and similar tracking technologies to:

• Remember your preferences and settings
• Understand how you use our services
• Improve performance and user experience
• Provide personalized content

You can control cookies through your browser settings. Note that disabling cookies may affect some features of our service.`
        },
        {
            title: '7. International Data Transfers',
            content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this privacy policy and applicable laws.`
        },
        {
            title: '8. Children\'s Privacy',
            content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn we have collected such information, we will take steps to delete it.`
        },
        {
            title: '9. Changes to This Policy',
            content: `We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`
        },
        {
            title: '10. Contact Us',
            content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:

Email: privacy@orbito.com
Address: 123 Travel Street, Suite 100, San Francisco, CA 94102`
        }
    ];

    return (
        <>
            <Helmet>
                <title>Privacy Policy - Orbito</title>
                <meta name="description" content="Learn how Orbito collects, uses, and protects your personal information." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0B3D91]">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-500">Last updated: {lastUpdated}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            At Orbito, we take your privacy seriously. This Privacy Policy explains how we collect, 
                            use, disclose, and safeguard your information when you use our website and services. 
                            Please read this policy carefully to understand our practices regarding your personal data.
                        </p>

                        <div className="space-y-8">
                            {sections.map((section, index) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                    <h2 className="text-xl font-bold text-[#0B3D91] mb-4">{section.title}</h2>
                                    <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                                        {section.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default PrivacyPolicyPage;
