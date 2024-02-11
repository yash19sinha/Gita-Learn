import React, { useState, useEffect } from 'react';
import { auth, storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 } from 'uuid';
import Image from 'next/image';

function PublicNotes({ verseId }) {
  const [showNotes, setShowNotes] = useState(false);
  const [image, setImg] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

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
      <button
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
                  <Image key={index} src={url} alt={`Uploaded Image ${index + 1}`} className="max-w-full mt-2" width="200" height="200" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PublicNotes;
