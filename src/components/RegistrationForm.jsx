import React, { useState, useEffect } from 'react';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
// import ReCAPTCHA from 'react-google-recaptcha';
import { parsePhoneNumberFromString } from 'libphonenumber-js'; // Import the validation library

const RegistrationSection = ({ RegistrationData, lang }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        useremain: '',
        contactnumber: '',
        countrycode: '',
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const [captchaResponse, setCaptchaResponse] = useState(null);
    const [defaultCountry, setDefaultCountry] = useState('AE'); // Default country

    useEffect(() => {
        // Fetch user's location and set default country code
        const fetchGeolocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error(`Failed to fetch location: ${response.statusText}`);
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
            [name]: value
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
            // captchaResponse, // Send CAPTCHA response to LeadRat CRM
        }
        // console.log("formSchema :: ", formSchema);
        // return;
        fetch("https://connect.leadrat.com/api/v1/integration/GoogleAds", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "API-Key": RegistrationData?.APIKey,
            },
            body: JSON.stringify(formSchema),
        }).then((response) => {
            if (!response.ok) {
                throw new Error("Failed to submit form");
            }
            return response.json();
        }).then((data) => {
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
                window.location.href = 'https://hjrealestates.com/expo/thank-you';
            }
            setIsSubmitting(false);
        }).catch((error) => {
            console.error("Error:", error);
        });
    };

    return (
        <div className='registrationSection'>
            <div className='container-fluid'>
                <div className='container'>
                    <div className='locationHeading'>
                        <h2>{'Quick Registration'}<span className='dot'></span></h2>
                        <form onSubmit={handleSubmit}>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className='row'>
                                <div className='col-lg-6 col-sm-6 col-12'>
                                    <input
                                        type="text"
                                        name="fullname"
                                        value={formData.fullname}
                                        onChange={handleChange}
                                        placeholder={'Name*'}
                                        required
                                    />
                                </div>
                                <div className='col-lg-6 col-sm-6 col-12'>
                                    <PhoneInput
                                        defaultCountry={defaultCountry}
                                        value={formData.contactnumber}
                                        onChange={handlePhoneChange}
                                        placeholder={'Contact Number*'}
                                        required
                                    />
                                </div>
                                <div className='col-lg-6 col-sm-6 col-12'>
                                    <input
                                        type="email"
                                        name="useremain"
                                        value={formData.useremain}
                                        onChange={handleChange}
                                        placeholder={'Email'}
                                        required
                                    />
                                </div>
                                {/* <div className='col-lg-6 col-sm-6 col-12 man_algin'>
                                    <input type="checkbox" id="agree1" name="agree1" value="yesno" />
                                    <label htmlFor="agree1"> {'Keep me informed about upcoming property launches and exclusive offers.'}</label>
                                </div> */}
                                {/* <div className='col-lg-12 col-sm-12 col-12'>
                                    <ReCAPTCHA
                                        sitekey="6LeSi6kqAAAAAIGjlzAXVdLp4nWBrZgfLufriwbm" // Replace with your actual Site Key
                                        onChange={(value) => setCaptchaResponse(value)} // Store the CAPTCHA response
                                        className='registration-captcha'
                                    />
                                </div> */}
                                <div className='col-lg-12 col-sm-6 col-12'>
                                    <input type="submit" value={'Submit'} className={isSubmitting ? 'btndisabled formsubmitbtn' : 'formsubmitbtn'} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegistrationSection;