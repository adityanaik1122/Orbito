import React from 'react';

const HeroImage = () => {
  return (
    <div className='flex justify-center items-center'>
      <img 
        src='https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop' 
        alt='London Skyline' 
        className='w-full h-full object-cover'
      />
    </div>
  );
};

export default HeroImage;