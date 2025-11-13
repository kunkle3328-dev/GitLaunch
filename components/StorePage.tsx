import React from 'react';
import { GitLaunchIcon } from './icons/GitLaunchIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserIcon } from './icons/UserIcon';


interface StorePageProps {
    onBack: () => void;
}

const testimonials = [
    {
        name: 'Sarah D.',
        role: 'Frontend Developer',
        quote: "GitLaunch saved me hours. I went from a local folder to a live GitHub repo in literally two minutes. The automatic README generation is a brilliant touch!"
    },
    {
        name: 'Alex M.',
        role: 'Full-Stack Engineer',
        quote: "As someone who constantly spins up new projects for prototyping, this tool is a game-changer. The UI is clean, intuitive, and it just works. Highly recommended."
    },
    {
        name: 'Jordan T.',
        role: 'UX Designer',
        quote: "I'm not a git expert, and the command line can be intimidating. GitLaunch makes sharing my design mockups and static sites on GitHub incredibly simple. I love it!"
    }
];

const PricingCard: React.FC<{
    tier: string;
    price: number;
    credits: number;
    description: string;
    cashappLink: string;
    isFeatured?: boolean;
}> = ({ tier, price, credits, description, cashappLink, isFeatured }) => (
    <div className={`relative bg-slate-800 border ${isFeatured ? 'border-blue-500' : 'border-slate-700'} rounded-2xl p-6 flex flex-col`}>
        {isFeatured && (
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1">
                <SparklesIcon className="w-4 h-4" />
                Best Value
            </div>
        )}
        <div className="flex-grow">
            <h3 className="text-2xl font-bold text-white">{tier}</h3>
            <p className="text-slate-400 mt-1">{description}</p>
            <div className="my-6 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-white">${price}</span>
                <span className="text-slate-300">/ {credits} Credits</span>
            </div>
        </div>
        <a
            href={cashappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full text-center px-6 py-3 font-bold rounded-lg transition-colors ${isFeatured ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
        >
            Buy Now
        </a>
    </div>
);


export const StorePage: React.FC<StorePageProps> = ({ onBack }) => {
    return (
        <div className="w-full">
            <header className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 p-3 rounded-full border border-slate-700">
                        <GitLaunchIcon className="h-10 w-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">GitLaunch Store</h1>
                        <p className="text-slate-400">Unlock your full potential.</p>
                    </div>
                </div>
                 <button 
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                     <ArrowLeftIcon className="w-5 h-5"/>
                    Back to App
                </button>
            </header>

            <main className="space-y-12">
                <section className="text-center">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">Power Up Your Deployments</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-300">
                        Choose a credit package that fits your workflow. Our credits never expire.
                    </p>
                </section>

                <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PricingCard 
                        tier="Starter"
                        price={5}
                        credits={10}
                        description="Perfect for personal projects and getting started."
                        cashappLink="https://cash.app/$edcmediadesigns/5"
                    />
                     <PricingCard 
                        tier="Developer"
                        price={20}
                        credits={50}
                        description="For frequent deploys and professional use."
                        cashappLink="https://cash.app/$edcmediadesigns/20"
                        isFeatured
                    />
                     <PricingCard 
                        tier="Agency"
                        price={50}
                        credits={150}
                        description="The ultimate package for power users and teams."
                        cashappLink="https://cash.app/$edcmediadesigns/50"
                    />
                </section>

                <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-center text-white">How It Works</h3>
                    <div className="mt-6 grid sm:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="flex items-center justify-center mx-auto w-16 h-16 bg-slate-700 border border-slate-600 text-blue-400 text-2xl font-bold rounded-full">1</div>
                            <h4 className="mt-4 font-semibold text-white">Choose a Package</h4>
                            <p className="mt-1 text-sm text-slate-400">Select the credit bundle that's right for you from the options above.</p>
                        </div>
                         <div>
                            <div className="flex items-center justify-center mx-auto w-16 h-16 bg-slate-700 border border-slate-600 text-blue-400 text-2xl font-bold rounded-full">2</div>
                            <h4 className="mt-4 font-semibold text-white">Send Payment</h4>
                            <p className="mt-1 text-sm text-slate-400">Click "Buy Now" to pay via Cash App. <strong>Crucially, add your GitHub username</strong> to the payment note so we know which account to credit.</p>
                        </div>
                         <div>
                            <div className="flex items-center justify-center mx-auto w-16 h-16 bg-slate-700 border border-slate-600 text-blue-400 text-2xl font-bold rounded-full">3</div>
                            <h4 className="mt-4 font-semibold text-white">Receive Credits</h4>
                            <p className="mt-1 text-sm text-slate-400">Your credits will be manually added to your account within 24 hours. You can check your balance in the app.</p>
                        </div>
                    </div>
                     <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-sm text-yellow-300 text-center">
                        <strong>Important:</strong> Credit allocation is a manual process. Please ensure you include your GitHub username or another unique identifier in the payment note to avoid delays.
                    </div>
                </section>

                <section>
                    <h3 className="text-2xl font-bold text-center text-white">Loved by Developers Like You</h3>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 flex flex-col items-start">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600">
                                        <UserIcon className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{testimonial.name}</p>
                                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                                    </div>
                                </div>
                                <blockquote className="text-slate-300 italic">
                                    "{testimonial.quote}"
                                </blockquote>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}