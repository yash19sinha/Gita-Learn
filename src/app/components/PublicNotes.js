"use client"
import React, { useState, useEffect, useRef } from "react";
import { auth, storage, db } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { FaTrash } from "react-icons/fa"; // Import the trash icon

function PublicNotes({ verseId }) {
  const [showNotes, setShowNotes] = useState(false);
  const [showAccordions, setShowAccordions] = useState(false);
  const [image, setImg] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageRefs, setImageRefs] = useState([]); // Store references for deletion
  const [activeIndex, setActiveIndex] = useState(null);
  const [podbean, setPodbean] = useState([]);
  const [link, setLink] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [videoId, setVideoId] = useState("");
  const [accordionNames] = useState(["Mindmap", "Audio Lecture", "Video Lecture"]);
  const searchParams = useSearchParams();
  const chapterVerse = searchParams.get("chapterVerse");
  const accordionRef = useRef(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists() || userDoc.data().role !== 'admin') {
        setUserRole(null);
        return;
      }

      setUserRole('admin');
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const handleClickOutsideAccordion = (event) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target)) {
        setActiveIndex(null);
      }
    };

    document.body.addEventListener("click", handleClickOutsideAccordion);
    return () => {
      document.body.removeEventListener("click", handleClickOutsideAccordion);
    };
  }, [activeIndex]);

  async function fetchLink() {
    try {
      setLoading(true);
      const response = await axios.get(`https://gita-learn-api.vercel.app/api/links/${chapterVerse}`);
      const links = [];
      if (response.data && response.data.links) {
        for (const key in response.data.links) {
          if (Object.hasOwnProperty.call(response.data.links, key)) {
            const linkObj = response.data.links[key];
            if (Array.isArray(linkObj)) {
              for (let i = 0; i < linkObj.length; i++) {
                if (linkObj[i].link) {
                  links.push({ link: linkObj[i].link, title: linkObj[i].title });
                }
              }
            } else {
              if (linkObj.link) {
                links.push({ link: linkObj.link, title: linkObj.title });
              }
            }
          }
        }
        setLink(links);
      }
    } catch (error) {
      setError("Error fetching link");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPodbeanLink() {
    try {
      setLoading(true);
      const response = await axios.get(`https://gita-learn-api.vercel.app/api/podbeans/${chapterVerse}`);
      const links = [];
      if (response.data && response.data.podbeans) {
        for (const key in response.data.podbeans) {
          if (Object.hasOwnProperty.call(response.data.podbeans, key)) {
            const linkObj = response.data.podbeans[key];
            if (Array.isArray(linkObj)) {
              for (let i = 0; i < linkObj.length; i++) {
                if (linkObj[i].link) {
                  links.push({ link: linkObj[i].link, title: linkObj[i].title });
                }
              }
            } else {
              if (linkObj.link) {
                links.push({ link: linkObj.link, title: linkObj.title });
              }
            }
          }
        }
        setPodbean(links);
      }
    } catch (error) {
      setError("Error fetching link");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTimestamp() {
    try {
      setLoading(true);
      const response = await axios.get(`https://gita-learn-api.vercel.app/api/timestamp/${chapterVerse}`);
      setStartTime(response.data["start-time"]);
      setEndTime(response.data["end-time"]);
      setVideoId(response.data["video-id"]);
    } catch (error) {
      setError("Error fetching timestamp");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (chapterVerse) {
      fetchLink();
      fetchPodbeanLink();
      fetchTimestamp();
    }
  }, [chapterVerse]);

  const handleClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, `publicNotes/${verseId}/images`);
        const imagesList = await listAll(storageRef);

        const urls = await Promise.all(
          imagesList.items.map(async (item) => {
            const imageUrl = await getDownloadURL(item);
            return { url: imageUrl, ref: item.fullPath };
          })
        );

        setImageUrls(urls.map((item) => item.url));
        setImageRefs(urls.map((item) => item.ref));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [verseId]);

  const handleImageUpload = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;

        if (image !== null) {
          const storageRef = ref(storage, `publicNotes/${verseId}/images/${v4()}`);
          await uploadBytes(storageRef, image).then(async (value) => {
            const imageUrl = await getDownloadURL(value.ref);
            setImageUrls((prevUrls) => [...prevUrls, imageUrl]);
            setImageRefs((prevRefs) => [...prevRefs, value.ref.fullPath]);
          });
        }

        setImg(null);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleImageDelete = async (index) => {
    try {
      const imageRef = ref(storage, imageRefs[index]);
      await deleteObject(imageRef);

      setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
      setImageRefs((prevRefs) => prevRefs.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleMindmapClick = () => {
    setShowAccordions((prevShowAccordions) => !prevShowAccordions);
  };

  const hasContent = [1, 2, 3].some((index) => {
    return (
      (index === 1 && imageUrls.length > 0) ||
      (index === 2 && link && link.length > 0) ||
      (index === 2 && podbean && podbean.length > 0) ||
      (index === 3 && startTime !== "" && endTime !== "")
    );
  });

  useEffect(() => {
    const handleAuthStateChange = auth.onAuthStateChanged((user) => {
      if (!user) {
        setUserRole(null);
      }
    });

    return () => handleAuthStateChange();
  }, []);

  return (
    <div>
      <div className="p-4">
        {userRole === "admin" && (
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
          </div>
        )}
      </div>
      {hasContent && (
        <div className="w-full mb-2 border border-orange-600 rounded-lg">
          <div className="p-4">
            {[1, 2, 3].map((index) => {
              const isActive = activeIndex === index;
              const accordionClass = isActive
                ? "bg-orange-200 border-orange-500 dark:bg-coolGray-700"
                : "bg-orange-100 hover:bg-orange-200 border-orange-300 hover:border-orange-500";
              const contentClass = isActive
                ? "p-4 bg-orange-100 border border-orange-500 flex justify-center items-center"
                : "p-4 bg-orange-100 border border-orange-300 flex justify-center items-center";
              const buttonClass = isActive
                ? "w-full p-4 text-xl text-center"
                : "w-full p-4 text-xl text-left";

              const hasContent =
                (index === 1 && imageUrls.length > 0) ||
                (index === 2 && link && link.length > 0) ||
                (index === 2 && podbean && podbean.length > 0) ||
                (index === 3 && startTime !== "" && endTime !== "");

              return hasContent ? (
                <div
                  key={index}
                  ref={accordionRef}
                  className={`mb-2 border rounded-md dark:text-black ${accordionClass} `}
                >
                  <button
                    onClick={(event) => {
                      handleClick(index);
                    }}
                    className={buttonClass}
                  >
                    {accordionNames[index - 1]}
                  </button>
                  {isActive && (
                    <div className={contentClass}>
                      {index === 1 && (
                        <div>
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative inline-block m-2">
                              <img
                                src={url}
                                alt={`Uploaded Image ${index + 1}`}
                                className="max-w-full h-180 w-180"
                              />
                              {userRole === "admin" && (
                                <button
                                  onClick={() => handleImageDelete(index)}
                                  className="absolute top-0 right-0 p-2 text-white bg-red-600 rounded-full"
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {index === 2 && (
                        <div>
                          {link || podbean ? (
                            <ul className="list-decimal">
                              {link.map((link, index) => (
                                <li key={index} className="text-justify">
                                  <a
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 hover:underline"
                                  >
                                    {link.title}
                                  </a>
                                </li>
                              ))}
                              {podbean.map((link, index) => (
                                <li key={index} className="text-justify">
                                  <a
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 hover:underline"
                                  >
                                    {link.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>No link found</p>
                          )}
                        </div>
                      )}
                      {index === 3 && (
                        <div>
                          <iframe
                            className="md:h-[400px] md:w-[600px] h-4/5 m-4/5"
                            src={`https://www.youtube-nocookie.com/embed/${videoId};controls=0&amp;modestbranding=1&amp;start=${startTime}&&end=${endTime}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
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
