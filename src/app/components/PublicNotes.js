import React, { useState, useEffect } from "react";
import { auth, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import axios from "axios";

function PublicNotes({ verseId }) {
  const [showNotes, setShowNotes] = useState(false);
  const [showAccordions, setShowAccordions] = useState(false);
  const [image, setImg] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [podbean, setPodbean] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [accordionNames] = useState(['Images']);
  const [accordionNames] = useState([
    "Mindmap",
    "Prabupada Lecture",
    "Senior Devotees Lectures",
  ]);
  const searchParams = useSearchParams();
  const chapterVerse = searchParams.get("chapterVerse");
  //to fetch links
  async function fetchLink() {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://gita-learn-api.vercel.app/api/links/${chapterVerse}`
      );
      setLink(response.data.links);
      setPodbean(response.data.podbean);
    } catch (error) {
      setError("Error fetching link");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chapterVerse) {
      fetchLink();
    }
  }, [chapterVerse]);
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
        console.error("Error fetching images:", error);
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
          const storageRef = ref(
            storage,
            `publicNotes/${verseId}/images/${v4()}`
          );
          await uploadBytes(storageRef, image).then(async (value) => {
            const imageUrl = await getDownloadURL(value.ref);
            setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
          });
        }

        // Clear the image state
        setImg(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleMindmapClick = () => {
    setShowAccordions((prevShowAccordions) => !prevShowAccordions);
  };
  const hasContent = [1, 2, 3].some((index) => {
    return (
      (index === 1 && imageUrls.length > 0) ||
      (index === 2 && link && link.link1) ||
      (index === 3 && link && link.podbean)
    );
  });

  return (
    <div>
      {hasContent && (
        <div className="w-full mb-2 border border-gray-300 rounded-lg">
          <div className="p-4 bg-white">
            {[1, 2, 3].map((index) => {
              const isActive = activeIndex === index;
              const accordionClass = isActive
                ? "bg-orange-200 border-orange-500"
                : "bg-orange-100 hover:bg-orange-200 border-orange-300 hover:border-orange-500";
              const contentClass = isActive
                ? "p-4 bg-orange-50 border border-orange-500 flex justify-center items-center"
                : "p-4 bg-orange-50 border border-orange-300 flex justify-center items-center";
              const buttonClass = isActive
                ? "w-full p-4 text-xl text-center"
                : "w-full p-4 text-xl text-left";

              const hasContent =
                (index === 1 && imageUrls.length > 0) ||
                (index === 2 && link && link.link1) ||
                (index === 3 && link && link.podbean);

              return hasContent ? (
                <div
                  key={index}
                  className={`mb-2 border rounded-md ${accordionClass}`}
                >
                  <button
                    onClick={() => handleClick(index)}
                    className={buttonClass}
                  >
                    {accordionNames[index - 1]}
                  </button>
                  {isActive && (
                    <div className={contentClass}>
                      {index === 1 && (
                        <div>
                          {imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Uploaded Image ${index + 1}`}
                              className="max-w-full mt-2 h-180 w-180"
                            />
                          ))}
                        </div>
                      )}
                      {index === 2 && (
                        <div>
                          {link ? (
                            <a
                              href={link.link1}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.link1}
                            </a>
                          ) : (
                            <p>No link found</p>
                          )}
                        </div>
                      )}
                      {index === 3 && (
                        <div>
                          {link ? (
                            <a
                              href={link.podbean}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {link.podbean}
                            </a>
                          ) : (
                            <p>No link found</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PublicNotes;

{
  /* <button
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
      )} */
}
