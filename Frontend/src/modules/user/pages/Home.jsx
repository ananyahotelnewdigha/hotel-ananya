import React from 'react';
import HomeHeader from '../components/home/HomeHeader';
import HeroBanner from '../components/home/HeroBanner';
import CategorySelector from '../components/home/CategorySelector';
import QuickNav from '../components/home/QuickNav';
import InterstitialBanner from '../components/home/InterstitialBanner';
import FeaturedStays from '../components/home/FeaturedStays';
import GuestFeedback from '../components/home/GuestFeedback';
import SupportGrid from '../components/home/SupportGrid';
import FeedbackModule from '../components/home/FeedbackModule';
import RecentActivity from '../components/home/RecentActivity';

const Home = () => {
    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-24 md:pb-0 relative select-none">
            {/* Subtle Texture for App Background */}
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none"></div>

            <HomeHeader />

            <HeroBanner />

            <CategorySelector />

            <QuickNav />

            {/* Interstitial: Dining */}
            <InterstitialBanner
                tag="Chef's Special"
                title="Coastal"
                italicTitle="Spirits & Culinary Art"
                subtext="Book a table at our signature waterfront restaurant."
                btnText="Reserve Now"
                img="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"
                path="/contact"
            />

            <FeaturedStays />

            {/* Interstitial: Events */}
            <InterstitialBanner
                tag="Unforgettable moments"
                title="Grand"
                italicTitle="Ballrooms & Galas"
                subtext="Host your dream wedding or corporate milestone in our elite venues."
                btnText="Request Quote"
                img="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
                path="/contact"
                type="vertical"
            />

            <GuestFeedback />

            <SupportGrid />

            <FeedbackModule />

            <RecentActivity />
        </div>
    );
};

export default Home;

