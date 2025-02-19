import React from 'react';
import getBasePath from '../utils/getBasePath';

const BannerSection = ({ BannerAlt }) => {
    const basePath = getBasePath();
    const [isLoading, setIsLoading] = React.useState(true);
    return (
        <div className='banner_img'>
            {isLoading && <div className="skeleton-banner"></div>}
            <img
                src={`${basePath}/img/main-banner.webp`}  // Default image
                alt={BannerAlt}
                loading="lazy"
                srcSet={`${basePath}/img/main-banner.webp 1x, ${basePath}/img/main-banner.webp 2x`}
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 100vw, 100vw"
                onLoad={() => setIsLoading(false)}
            />
            <div className="container">
                <div className="row">
                    <div className='main_logo'>
                        <img src={`${basePath}/img/HJLogowhite.svg`} alt='HJ Real Estates' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BannerSection;
