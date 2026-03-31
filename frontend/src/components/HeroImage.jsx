import React from 'react';

const HeroImage = () => {
  return (
    <div className='flex justify-center items-center'>
      <img 
        src='https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2000&auto=format&fit=crop' 
        alt='London Skyline' 
        className='w-full h-full object-cover'
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop'; }}
      />
    </div>
  );
};

export default HeroImage;
