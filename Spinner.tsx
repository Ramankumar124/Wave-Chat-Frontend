// import React from 'react';
import './spinner.css'

export const Spinner: React.FC = () => {
  return (

<div className='fixed w-full h-full inset-0 flex justify-center items-center bg-black bg-opacity-30 z-20'><div className="dot-spinner">
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
    <div className="dot-spinner__dot"></div>
</div></div>

  );
};