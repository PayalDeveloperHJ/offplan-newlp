import React from 'react';
import getBasePath from '../utils/getBasePath';

const Footer = ({ lang }) => {
    const basePath = getBasePath();

    return (
        <div className="container-fluid bg-blue footer_section">
            <div className="container descktop_view">
                <div className='row align-cent'>
                    <div className='footer_left'>
                        <p>©2024 HJ Real Estates LLC. All Rights Reserved. <br></br>
                            HJ Real Estates LLC is a company registered in Dubai, United Arab Emirates</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;