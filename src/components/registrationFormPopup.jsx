import React, { useState, useEffect } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Import the validation library
import getBasePath from '../utils/getBasePath';
import Cookies from 'js-cookie';
import Modal from 'react-modal';

// Set app element for accessibility
Modal.setAppElement('#root');

const RegistrationPopupForm = ({ isOpen, onRequestClose, RegistrationData }) => {
    const basePath = getBasePath();
    const [formData, setFormData] = useState({
        fullname: '',
        useremain: '',
        contactnumber: '',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultCountry, setDefaultCountry] = useState('AE'); // Default country

    useEffect(() => {
        // Fetch user's location and set default country code
        const fetchGeolocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch location');
                const data = await response.json();
                setDefaultCountry(data.country_code || 'AE'); // Fallback to 'AE' if not found
            } catch (error) {
                console.error('Geolocation error:', error);
                setDefaultCountry('AE'); // Fallback to 'AE' on error
            }
        };

        fetchGeolocation();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhoneChange = (value) => {
        // Update state with phone number value
        setFormData({
            ...formData,
            contactnumber: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.fullname.trim()) {
            setError('Please enter your name.');
            setIsSubmitting(false);
            return;
        }

        if (!formData.useremain.trim() || !/\S+@\S+\.\S+/.test(formData.useremain)) {
            setError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        }

        // Validate phone number
        const phoneNumber = parsePhoneNumberFromString(formData.contactnumber, defaultCountry);
        if (!phoneNumber || !phoneNumber.isValid()) {
            setError('Please enter a valid phone number.');
            setIsSubmitting(false);
            return;
        }

        const formSchema = {
            name: formData.fullname,
            email: formData.useremain,
            mobile: formData.contactnumber,
        };

        localStorage.setItem('formSubmitted', 'true');
        try {
            const response = await fetch("https://connect.leadrat.com/api/v1/integration/GoogleAds", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "API-Key": RegistrationData?.APIKey,
                },
                body: JSON.stringify(formSchema),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            const data = await response.json();

            if (data?.data !== true) {
                setError('Oops! This number is already registered. Try with another number.');
            } else {
                // Reset the form fields
                setFormData({
                    fname: '',
                    lname: '',
                    useremain: '',
                    contactnumber: '',
                });
                Cookies.set('openPopupOnscroll', false, { expires: 1 });
                window.location.href = 'https://hjrealestates.com/expo/thank-you';
            }
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            className="RegistrationFormModel"
            onRequestClose={onRequestClose}
            contentLabel="Registration Modal"
        >
            <button className="close-button" onClick={onRequestClose}>
                <img src={`${basePath}/img/icons/close_btn.svg`} alt="Close Popup" />
            </button>
            <div className="registrationPopupForm">
                <div className="container-fluid">
                    <div className="container">
                        <div className="registration">
                            <div className="row reg_align">
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <div className="registration_img">
                                        <img
                                            src={`${RegistrationData?.deskBanner}`} // Default image (desktop)
                                            alt="Registration"
                                            className="deck_img"
                                            srcSet={`${RegistrationData?.deskBanner} 1x, ${RegistrationData?.deskBanner} 2x`} // For desktop
                                            sizes="(max-width: 767px) 100vw, 50vw" // If viewport is smaller than 768px, use 100% of the viewport width, otherwise 50%
                                        />
                                        <img
                                            src={`${RegistrationData?.mobBanner}`} // Mobile version
                                            alt="Registration"
                                            className="mob_img"
                                            srcSet={`${RegistrationData?.mobBanner} 1x, ${RegistrationData?.mobBanner} 2x`} // Mobile version with srcset
                                            sizes="(max-width: 767px) 100vw, 50vw" // Same sizes, adjusts based on screen size
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-sm-6 col-12">
                                    <form onSubmit={handleSubmit}>
                                        <div className="reg_desc">
                                            <h2>
                                                {RegistrationData?.title}
                                                <span className="dot"></span>
                                            </h2>
                                            <p>
                                                {'Fill out the form, and one of our team members will get in touch with you soon'}
                                            </p>
                                        </div>

                                        {error && <p style={{ color: 'red' }}>{error}</p>}
                                        <input
                                            type="text"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleChange}
                                            placeholder={'Name*'}
                                            required
                                        />
                                        <PhoneInput
                                            defaultCountry={defaultCountry} // Dynamically set country
                                            value={formData.contactnumber}
                                            onChange={handlePhoneChange}
                                            placeholder={'Contact Number*'}
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="useremain"
                                            value={formData.useremain}
                                            onChange={handleChange}
                                            placeholder={'Email'}
                                            required
                                        />
                                        {/* <input type="checkbox" id="agree1" name="agree1" />
                                        <label htmlFor="agree1">
                                            {'Keep me informed about upcoming property launches and exclusive offers.'}
                                        </label> */}
                                        <input
                                            type="submit"
                                            value={isSubmitting ? 'Submitting...' : 'Submit'}
                                            className={isSubmitting ? 'btndisabled formsubmitbtn' : 'formsubmitbtn'}
                                        />
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RegistrationPopupForm;
