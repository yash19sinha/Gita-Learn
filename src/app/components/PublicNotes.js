import React, { useState, useEffect } from 'react';
import { auth, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 } from 'uuid';
import Image from 'next/image';

function PublicNotes({ verseId }) {
  const [showNotes, setShowNotes] = useState(false);
  const [image, setImg] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [accordionNames] = useState(['Images']);
  // const [accordionNames] = useState(['Images', 'Prabupadas Imaportant Lecture', 'Accordion Three']);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, `publicNotes/${verseId}/images`);
        const imagesList = await listAll(storageRef);

        const urls = await Promise.all(
          imagesList.items.map(async (item) => {
            return await getDownloadURL(item);
          })
        );

        setImageUrls(urls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [verseId]); // Fetch the image URLs when verseId changes

  const handleImageUpload = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;

        if (image !== null) {
          // Upload image to Firebase Storage
          const storageRef = ref(storage, `publicNotes/${verseId}/images/${v4()}`);
          await uploadBytes(storageRef, image).then(async (value) => {
            const imageUrl = await getDownloadURL(value.ref);
            setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
          });
        }

        // Clear the image state
        setImg(null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    
    <div className="container p-4 mx-auto font-normal text-justify">
    <div className="w-full">
      {[1].map((index) => (
        <div key={index} className="mb-2 border border-gray-300 rounded-md">
          <button
            onClick={() => handleClick(index)}
            className="w-full p-4 text-xl text-left bg-gray-200"
          >
            {accordionNames[index - 1]} {/* Use the corresponding name for each accordion */}
          </button>
          {activeIndex === index && (
            <div className="p-4 bg-white">
              {/* Content for Accordion {index} */}
              {index === 1 && (
                <div>
                  {imageUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Uploaded Image ${index + 1}`} className="max-w-full mt-2 h-180 w-180" />
                  ))}
                </div>
              )}
              {/* {index === 2 && <p>This is content for Accordion 2</p>}
              {index === 3 && <p>This is content for Accordion 3</p>} */}
            </div>
          )}
        </div>
      ))}
    </div>
  
      {/* <button
        onClick={() => setShowNotes(!showNotes)}
        className="mb-4 btn"
      >
        {showNotes ? 'Hide Public Notes' : 'Show Public Notes'}
      </button>

      {showNotes && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
            className="mt-4"
          />
          <button
            onClick={handleImageUpload}
            className="justify-center mt-4 btn btn-primary"
          >
            Upload Image
          </button>

          {imageUrls.length > 0 && (
            <div>
              <p>Uploaded Images:</p>
              <div>
                {imageUrls.map((url, index) => (
                  <img key={index} src={url} alt={`Uploaded Image ${index + 1}`} className="max-w-full mt-2 h-180 w-180"  />
                ))}
              </div>
            </div>
          )}
        </div>
      )} */}
    </div>
  );
}

export default PublicNotes;
