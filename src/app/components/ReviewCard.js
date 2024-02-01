// components/ReviewCard.js

import React from 'react';

const ReviewCard = () => {
  const reviews = [
    {
      name: 'Mahatma Gandhi',
      title: 'Father of Nation ',
      imageUrl: 'https://assets.editorial.aetnd.com/uploads/2010/07/mahatma-gandhi-gettyimages-102701091-2048x2048-1.jpg', // Replace with the actual path to your image
      comment: '"When doubts haunt me, when disappointments stare me in the face, and I see not one ray of hope on the horizon, I turn to Bhagavad-Gita and find a verse to comfort me;and I immediately begin to smile in the midst of overwhelming sorrow. Those who meditate on the Gita will derive fresh joy and new meanings from it every day"',
    },
    {
        name: 'Aldous Huxley',
        title: 'English Writer',
        imageUrl: 'https://campuspress.yale.edu/modernismlab/files/2017/07/Aldous_Huxley.jpg', // Replace with the actual path to your image
        comment: '"The Gita is most systematic statement of spiritual evolution of endowing value to mankind. It is also one of the most clear and comprehensive summaries of perennial philosophy ever revealed; hence its enduring value is subject not only to India but to all of humanity."',
      },
      {
        name: 'Henry David Thoreau',
        title: 'American Poet & Philospher',
        imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/gettyimages-3264616.jpg', // Replace with the actual path to your image
        comment: '"In the morning I bathe my intellect in the stupendous and cosmogonal philosophy of the Bhagavad Gita in comparison with which our modern world and itsliterature seem puny and trivial."',
      },
      {
        name: 'Annie Besant',
        title: 'English Socialist & Theosophist',
        imageUrl: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2017/10/07/Photos/Processed/AnnieBesant-k8eE--621x414@LiveMint.jpg', // Replace with the actual path to your image
        comment: '"That the spiritual man need not be a recluse, that union with the divine Life may be achieved and maintained in the midst of worldly affairs, that the obstacles to that union lie not outside us but within us-such is the central lesson of the Bhagavad-Gitā."',
      },
  ];

  return (
    <div className="flex items-center justify-center p-3 m-3">
    <div className="grid grid-cols-2 gap-10 m-5 md:grid-cols-3 justify-items-center xl:grid-cols-4 xl:max-w-screen-xl lg:max-w-screen-lg">
      {reviews.map((review, index) => (
        <div key={index} className="max-w-xs p-6 transition-transform transform bg-white rounded-lg shadow-2xl hover:scale-105 hover:shadow-lg">
          <img
            src={review.imageUrl}
            alt={`Profile of ${review.name}`}
            className="object-cover w-32 h-32 mx-auto mb-4 transition-opacity rounded-full hover:opacity-75"
          />
          <h3 className="mb-2 text-xl font-semibold">{review.name}</h3>
          <p className="mb-2 font-medium text-gray-800">{review.title}</p>
          <p className="text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default ReviewCard;
