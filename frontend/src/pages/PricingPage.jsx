import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Star, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const PricingPage = () => {
    const { toast } = useToast();

    const handleJoinWaitlist = (e) => {
        e.preventDefault();
        const email = e.target.elements.email.value;
        if (email) {
            toast({
                title: "You're on the waitlist! 🎉",
                description: `We'll notify ${email} as soon as our paid plans launch.`,
            });
            e.target.reset();
        } else {
            toast({
                title: "Whoops!",
                description: `Please enter a valid email address.`,
                variant: 'destructive',
            });
        }
    };

    const handleChoosePlan = (plan) => {
        toast({
            title: `You've selected the ${plan} plan!`,
            description: "This feature isn't implemented yet, but great choice! 🚀",
        });
    };

    const tiers = [
        {
            name: 'Free',
            price: '$0',
            frequency: '/ month',
            description: 'For casual travelers to get a taste of AI-powered planning.',
            features: [
                '2 AI-Generated Itineraries / month',
                'Standard AI Suggestions',
                'Share itineraries with friends',
                'Save up to 3 itineraries'
            ],
            cta: 'Start for Free',
            highlight: false,
            isComingSoon: false,
        },
        {
            name: 'Standard',
            price: '$4.99',
            priceOptions: [
                { price: '$4.99', label: '/ month' },
                { price: '$49.99', label: ' lifetime' },
            ],
            description: 'For frequent travelers who want more power and personalization.',
            features: [
                '10 AI-Generated Itineraries / month',
                'Advanced AI Suggestions',
                'Save Unlimited Itineraries',
                'Real-time Flight & Hotel Info (Coming Soon)',
                'Real-time travel expert to help plan your trip'
            ],
            cta: 'Join Waitlist',
            highlight: true,
            isComingSoon: true,
        },
        {
            name: 'Premium',
            price: '$9.99',
             priceOptions: [
                { price: '$9.99', label: '/ month' },
                { price: '$99.99', label: ' lifetime' },
            ],
            description: 'For the ultimate globetrotter needing pro-level features.',
            features: [
                'Unlimited AI-Generated Itineraries',
                'Advanced + personal personalisation',
                'Real-time travel expert to help plan your trip',
                'Exclusive Partner Deals',
                'Priority Support',
            ],
            cta: 'Join Waitlist',
            highlight: false,
            isComingSoon: true,
        },
    ];

    const WaitlistForm = () => (
        <form onSubmit={handleJoinWaitlist} className="mt-auto space-y-4">
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0B3D91]/50" />
                <Input name="email" type="email" placeholder="Enter your email" className="h-11 pl-10 bg-white border-gray-200 placeholder:text-gray-400 text-[#0B3D91]" required />
            </div>
            <Button type="submit" className={'w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white'}>
                Join Waitlist
            </Button>
        </form>
    );

    return (
        <>
            <Helmet>
                <title>Pricing Plans - Orbito</title>
                <meta name="description" content="Choose the perfect plan for your travel needs, from free basic access to unlimited premium features." />
            </Helmet>
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#0B3D91]">
                        Find the Perfect Plan
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether you're planning a single getaway or you're a full-time nomad, we have a plan that fits your journey.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
                    {tiers.map((tier, index) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative bg-white rounded-2xl border ${tier.highlight ? 'border-[#0B3D91] shadow-lg' : 'border-gray-200'} p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow`}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B3D91] text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3"/>
                                    MOST POPULAR
                                </div>
                            )}
                             {tier.isComingSoon && (
                                <div className="absolute top-4 right-4 bg-[#1E5BA8] text-white text-xs font-bold px-3 py-1 rounded-full">
                                    COMING SOON
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-[#0B3D91]">{tier.name}</h2>
                            <p className="text-gray-500 mt-2">{tier.description}</p>
                            <div className="my-8">
                                {tier.priceOptions ? (
                                    <div>
                                        <span className="text-5xl font-extrabold text-[#0B3D91]">{tier.priceOptions[0].price}</span>
                                        <span className="text-gray-500">{tier.priceOptions[0].label}</span>
                                        <p className="text-lg font-semibold text-[#0B3D91]/80 mt-2">or {tier.priceOptions[1].price} lifetime</p>
                                    </div>
                                ) : (
                                     <div>
                                        <span className="text-5xl font-extrabold text-[#0B3D91]">{tier.price}</span>
                                        <span className="text-gray-500">{tier.frequency}</span>
                                    </div>
                                )}
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className="w-5 h-5 flex-shrink-0 bg-[#0B3D91]/10 text-[#0B3D91] rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            {tier.isComingSoon ? (
                                <WaitlistForm />
                            ) : (
                                <Button
                                    onClick={() => handleChoosePlan(tier.name)}
                                    className={'w-full bg-[#0B3D91] hover:bg-[#092C6B] text-white'}
                                >
                                    {tier.cta}
                                </Button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PricingPage;