import React from 'react';

const Spinner = ({ size = "md", color = "primary", fullScreen = false }) => {
    return (
        <div className={`d-flex justify-content-center ${fullScreen ? 'vh-100 align-items-center' : ''}`}>
            <div className={`spinner-border text-${color} spinner-${size}`} role='status'>
                <span className='visually-hidden'>Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;
