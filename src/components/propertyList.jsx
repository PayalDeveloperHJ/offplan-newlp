import React, { useState, useEffect } from 'react';
import getBasePath from '../utils/getBasePath';

const PropertyList = ({ PropertyData, openRegistrationModal }) => {
    const basePath = getBasePath();
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const propertiesPerPage = 9; // Number of properties per page

    // Sort properties by id
    const sortedProperties = PropertyData?.PropertyList.sort((a, b) => a.id - b.id);

    // Get properties for the current page
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const currentProperties = sortedProperties.slice(startIndex, startIndex + propertiesPerPage);

    // Calculate total pages
    const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // const handleNextPage = () => {
    //     if (currentPage < totalPages) {
    //         setCurrentPage(currentPage + 1);
    //     }
    // };

    // const handlePrevPage = () => {
    //     if (currentPage > 1) {
    //         setCurrentPage(currentPage - 1);
    //     }
    // };

    const handleRegisterClick = () => {
        openRegistrationModal();
    };


    return (
        <div className="container-fluid bg-gray pb-100 po-re singapore_page">
            <div className="container">
                <div className="row">
                    <div className="second_row_section align-cent">
                        <h2>{PropertyData?.title}<span className="dot"></span></h2>
                        <h5>{PropertyData?.subtitle}</h5>
                    </div>
                </div>
                <div className="row">
                    {currentProperties.map((item, index) => (
                        <div className="col-lg-4 col-sm-6 col-xs-12" key={index}>
                            <div className="list_box">
                                <a href={item?.projectLink}>
                                    <img
                                        alt={item?.projectName}
                                        src={`${basePath}/${item?.img}`} // Default image
                                        srcSet={`${basePath}/${item?.img} 1x, ${basePath}/${item?.img} 2x`} // srcset for different pixel densities
                                        loading="lazy"
                                        width={"416px"}
                                        height={"298px"}
                                    />
                                </a>
                                <div className='box_details'>
                                    <div className="row">
                                        <h3><a href={item?.projectLink}>{item?.projectName}</a></h3>
                                        <img alt="" src={`${item?.developerLogo}`} />
                                    </div>
                                    <p className='address'><img loading="lazy" alt="type" src={`${basePath}/img/icons/bedroomtype.svg`} />{item?.appartmentType}</p>
                                    <p className='flate-type'><img loading="lazy" alt="address" src={`${basePath}/img/icons/address.svg`} /> {item?.address}</p>
                                    <span>{PropertyData?.startingFrom}</span>
                                    <p className='price'>{item?.price}</p>
                                    <button onClick={handleRegisterClick}><img alt="" src={`${basePath}/img/icons/talk.svg`} /> {PropertyData?.talkToAgent}</button>
                                </div>
                            </div>
                        </div>
                    )
                    )}
                </div>
                {/* Pagination */}
                <div className="pagination">
                    {/* <button
                            className="page-btn prev_btn"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button> */}
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    {/* <button
                            className="page-btn next_btn"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button> */}
                </div>
            </div>
        </div>
    );
};

export default PropertyList;