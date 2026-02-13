import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const TermsOfServicePage = () => {
    const lastUpdated = 'February 1, 2025';

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: `By accessing or using Orbito's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.`
        },
        {
            title: '2. Description of Service',
            content: `Orbito provides an AI-powered travel planning platform that helps users create personalized travel itineraries. Our services include:

• AI-generated travel itineraries
• Destination recommendations
• Trip planning tools
• Itinerary sharing and collaboration features
• Travel resource guides and articles

We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.`
        },
        {
            title: '3. User Accounts',
            content: `To access certain features, you must register for an account. You agree to:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Promptly update any changes to your information
• Accept responsibility for all activities under your account
• Notify us immediately of any unauthorized access

We reserve the right to suspend or terminate accounts that violate these terms.`
        },
        {
            title: '4. User Content',
            content: `You retain ownership of content you create or upload to Orbito. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content for the purpose of operating and improving our services.

You agree not to submit content that:
• Is illegal, harmful, or offensive
• Infringes on intellectual property rights
• Contains viruses or malicious code
• Violates the privacy of others`
        },
        {
            title: '5. Prohibited Uses',
            content: `You agree not to use our services to:

• Violate any applicable laws or regulations
• Infringe on the rights of others
• Transmit spam or unsolicited communications
• Attempt to gain unauthorized access to our systems
• Interfere with the proper functioning of our services
• Scrape or collect user data without permission
• Use automated systems to access our services without authorization
• Engage in any activity that could damage our reputation`
        },
        {
            title: '6. Intellectual Property',
            content: `All content, features, and functionality of Orbito, including but not limited to text, graphics, logos, icons, images, audio, video, software, and the overall design, are owned by Orbito and protected by intellectual property laws.

You may not reproduce, distribute, modify, create derivative works of, publicly display, or exploit any of our content without prior written permission.`
        },
        {
            title: '7. Third-Party Services',
            content: `Our services may contain links to or integrate with third-party websites and services. We are not responsible for the content, privacy policies, or practices of any third-party services. Your interactions with third-party services are governed by their respective terms and policies.`
        },
        {
            title: '8. Payment Terms',
            content: `Paid subscriptions are billed in advance on a monthly or annual basis. All payments are non-refundable except as required by law or as explicitly stated in our refund policy.

We reserve the right to change our pricing at any time. Price changes will be communicated in advance and will apply to subsequent billing periods.`
        },
        {
            title: '9. Disclaimers',
            content: `OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT:

• Our services will be uninterrupted or error-free
• Travel recommendations will meet your expectations
• Information provided is accurate or complete
• Results from AI-generated itineraries will be suitable for your needs

Travel involves inherent risks. You are responsible for verifying all travel information and making informed decisions about your trips.`
        },
        {
            title: '10. Limitation of Liability',
            content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ORBITO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF OUR SERVICES.

Our total liability for any claims arising from these terms or your use of our services shall not exceed the amount you paid us in the twelve months preceding the claim.`
        },
        {
            title: '11. Indemnification',
            content: `You agree to indemnify and hold harmless Orbito, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services, violation of these terms, or infringement of any rights of third parties.`
        },
        {
            title: '12. Governing Law',
            content: `These Terms of Service shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these terms shall be resolved in the courts of San Francisco County, California.`
        },
        {
            title: '13. Changes to Terms',
            content: `We reserve the right to modify these terms at any time. We will notify users of material changes by posting the updated terms on our website and updating the "Last Updated" date. Continued use of our services after changes constitutes acceptance of the modified terms.`
        },
        {
            title: '14. Contact Information',
            content: `If you have any questions about these Terms of Service, please contact us at:

Email: legal@orbito.com
Address: 123 Travel Street, Suite 100, San Francisco, CA 94102`
        }
    ];

    return (
        <>
            <Helmet>
                <title>Terms of Service - Orbito</title>
                <meta name="description" content="Read Orbito's Terms of Service to understand the rules and guidelines for using our platform." />
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
                            Terms of Service
                        </h1>
                        <p className="text-gray-500">Last updated: {lastUpdated}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Welcome to Orbito! These Terms of Service govern your use of our website and services. 
                            By using Orbito, you agree to these terms. Please read them carefully before using our platform.
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

export default TermsOfServicePage;
