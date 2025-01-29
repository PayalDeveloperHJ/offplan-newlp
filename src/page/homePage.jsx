import React, { useState, lazy, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

// Lazy load components
const Footer = lazy(() => import("../components/footer"));
const RegistrationPopupForm = lazy(() => import("../components/registrationFormPopup"));
const RegistrationSection = lazy(() => import("../components/RegistrationForm"));
const BannerSection = lazy(() => import("../components/banner"));
const PropertyList = lazy(() => import("../components/propertyList"));

// Throttle function for scroll events
const throttle = (func, delay) => {
    let timeout;
    return function (...args) {
        if (!timeout) {
            timeout = setTimeout(() => {
                func.apply(this, args);
                timeout = null;
            }, delay);
        }
    };
};

const HomePage = () => {
    const { lpName } = useParams(); // Get the eventName from the URL
    const [lpData, setLpData] = useState(null); // State to store JSON data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [stopPopupOnScroll, setStopPopupOnScroll] = useState(true);

    // Load event data dynamically
    useEffect(() => {
        const loadEventData = async () => {
            try {
                // Try loading from cache first
                const cachedData = localStorage.getItem(lpName);
                if (cachedData) {
                    setLpData(JSON.parse(cachedData)); // Load from cache
                    setLoading(false);
                } else {
                    // Dynamically import the JSON file
                    const data = await import(`../content/${lpName}.json`);
                    setLpData(data);
                    localStorage.setItem(lpName, JSON.stringify(data)); // Cache the data
                    setLoading(false);
                }
            } catch (err) {
                setError("Failed to load event data.");
                setLoading(false);
                console.error(err);
                window.location.href = 'https://hjrealestates.com/not-found'; // Redirect to external URL
            }
        };

        loadEventData();
    }, [lpName]);

    const closeModals = () => {
        setIsRegistrationModalOpen(false);
    };

    const openRegistrationModal = () => {
        if (!isRegistrationModalOpen) {
            setIsRegistrationModalOpen(true); // Open registration modal
        }
    };

    // Scroll event listener with throttle
    useEffect(() => {
        const handleScroll = throttle(() => {
            const scrollTop = window.scrollY; // Current scroll position
            const documentHeight = document.documentElement.scrollHeight; // Total height of the document
            const scrollThreshold = documentHeight * 0.25;
            if (!hasScrolled && scrollTop > scrollThreshold) {
                setHasScrolled(true); // Mark as scrolled
                openRegistrationModal(); // Open registration modal on first scroll past 25%
            }
        }, 200); // Trigger every 200ms

        if (stopPopupOnScroll) {
            window.addEventListener('scroll', handleScroll);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasScrolled, stopPopupOnScroll]);

    if (loading) return <div>Loading event data...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='lpMain_page'>
            <Helmet>
                <link
                    rel="preload"
                    href="https://res.cloudinary.com/dftmldklw/image/upload/v1738070072/9_k0ftmj.webp"
                    as="image"
                    type="image/webp"
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 100vw, 100vw"
                />
                <title>{lpData?.MetaDataSEO?.metaTitle}</title>
                <meta name="description" content={lpData?.MetaDataSEO?.metaDescription} />
                <meta name="keywords" content={lpData?.MetaDataSEO?.metaKeywords} />
            </Helmet>
            <React.Suspense fallback={<div></div>}>
                <BannerSection BannerAlt={lpData?.propertySection?.title} />
            </React.Suspense>
            <React.Suspense fallback={<div></div>}>
                <PropertyList
                    PropertyData={lpData?.propertySection}
                    openRegistrationModal={openRegistrationModal}
                />
            </React.Suspense>
            <React.Suspense fallback={<div></div>}>
                <RegistrationSection
                    RegistrationData={lpData?.RegistrationFormDetail}
                />
            </React.Suspense>
            <React.Suspense fallback={<div></div>}>
                <Footer />
            </React.Suspense>
            <React.Suspense fallback={<div></div>}>
                <RegistrationPopupForm
                    isOpen={isRegistrationModalOpen}
                    onRequestClose={closeModals}
                    RegistrationData={lpData?.RegistrationFormDetail}
                />
            </React.Suspense>
        </div>
    );
};

export default HomePage;
