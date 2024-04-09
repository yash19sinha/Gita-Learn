// pages/VerseDetail.js
"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Footer } from "../components/Footer";
import RenderPurport from "../components/RenderPurport";
import { useRouter } from "next/navigation";
import NotesSidebar from "../components/NotesSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPenSquare } from "react-icons/fa";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import PublicNotes from "../components/PublicNotes";
import { useAuth } from "../hooks/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../icon/comment.png";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { getFirestore } from "firebase/firestore";
import ScrollDepth from "../components/ScrollDepth";

function VerseDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterVerse = searchParams.get("chapterVerse");
  const [verseDetails, setVerseDetails] = useState({});
  const [audioData, setAudioData] = useState({});
  const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);
  const [communityId, setCommunityId] = useState("");
  const [isCreatingCommunityId, setIsCreatingCommunityId] = useState(false);
  const [generatedCommunityId, setGeneratedCommunityId] = useState("");
  const [questionsExist, setQuestionsExist] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showTextBox, setShowTextBox] = useState(false);
  const [textBoxPosition, setTextBoxPosition] = useState({ top: 0, left: 0 });
  const [Notes, setNotes] = useState("");
  const boxRef = useRef(null);
  const chapter = 0;
  const verse = 0;
  const [communityNames, setCommunityNames] = useState({});
  const currentUser = auth.currentUser;
  // const [selectedCommunity, setSelectedCommunity] = useState('');
  // const [yourCommunities, setYourCommunities] = useState([]);
  const [yourIds, setYourIds] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState("");

  useEffect(() => {
    const fetchYourIds = async () => {
      try {
        if (!currentUser) return;
  
        const userId = currentUser.uid;
        const yourIdsDoc = await getDoc(doc(db, 'YourIds', userId));
        const ids = yourIdsDoc.exists() ? yourIdsDoc.data().yourIds : [];
        setYourIds(ids);
      } catch (error) {
        console.error('Error fetching your IDs:', error);
      }
    };
  
    fetchYourIds();
  }, [currentUser]);
  
  
  
  
  
  
  
  

  const fetchCommunityData = async () => {
    try {
      const communityData = {};
      const communityIdsSnapshot = await getDocs(collection(db, 'communityIds'));
      communityIdsSnapshot.forEach(doc => {
        const data = doc.data();
        communityData[doc.id] = data.communityName;
      });
      setCommunityNames(communityData);
    } catch (error) {
      console.error('Error fetching community data:', error);
    }
  };
  
  useEffect(() => {
    fetchCommunityData();
  }, []);
  

  const handleEnterCommunityId = async () => {
    if (!communityId) {
      alert("Please enter a Community ID.");
      return;
    }

    try {
      // Check if the entered community ID exists in the collection
      const communityPinRef = collection(db, "communityIds");
      const communityPinQuery = query(
        communityPinRef,
        where("communityId", "==", parseInt(communityId))
      );
      const communityPinSnapshot = await getDocs(communityPinQuery);

      if (!communityPinSnapshot.empty) {
        // The entered community ID exists in the collection
        const currentVerseId = chapterVerse;

        // Send request to the owner of the community ID
        const requestData = {
          communityId: parseInt(communityId),
          status: 'pending',
          createdAt: new Date()
        };

        // Create communityIdRequests collection if it doesn't exist
        const communityIdRequestsRef = collection(db, "communityIdRequests");
        await addDoc(communityIdRequestsRef, { sampleField: "sampleValue" }); // Add a sample field to ensure the collection is created

        // Add request document to communityIdRequests collection
        await addDoc(collection(db, 'communityIdRequests'), requestData);

        // Redirect user to the quiz page
        window.location.href = `/Quiz?verseId=${currentVerseId}&communityId=${communityId}`;
      } else {
        // The entered community ID does not exist in the collection
        alert("Community ID does not exist. Please enter a valid ID.");
      }
    } catch (error) {
      console.error('Error entering community ID:', error);
      // Handle error here
    }
  };


  function handleTextSelection() {
    const text = window.getSelection().toString();
    const selection = window.getSelection();

    if (text && !showTextBox) {
      // Check if text is selected and menu is not already open
      setSelectedText(text);
      setShowTextBox(false); // Close the text box initially

      let menu = document.querySelector("#selectionMenu"); // Check if a menu already exists

      if (!menu) {
        // Create the menu only if it doesn't exist
        menu = document.createElement("div");
        menu.id = "selectionMenu";
        menu.innerHTML = `
          <div class="menu-content">
            <button id="openNotesBtn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="28" height="22">
                <circle fill="white"/>
                <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c-4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" fill="black"/>
              </svg>
            </button>
          </div>
        `;

        menu.className = "menu-container"; // Add a class for styling
        menu.style.position = "absolute";
        menu.style.backgroundColor = "rgba(245, 243, 242)";
        menu.style.border = "1px solid black";
        menu.style.padding = "5px";
        menu.style.zIndex = "9999";
        menu.style.borderRadius = "5px"; // Rounded corners

        // Handle click on the "Open Notes" button
        const openNotesBtn = menu.querySelector("#openNotesBtn");
        openNotesBtn.addEventListener("click", () => {
          if (!user) {
            // Assuming you have a function to check if the user is logged in
            toast.error("Please sign in to use the notes section", {});
          } else {
            setShowTextBox(true); // Show the text box
            menu.remove(); // Remove the menu immediately
          }
        });

        // Create arrow element
        const arrow = document.createElement("div");
        arrow.className = "arrow";
        arrow.style.position = "absolute";
        arrow.style.bottom = "-10px"; // Adjust to position the arrow correctly
        arrow.style.left = "calc(50% - 10px)"; // Adjust to position the arrow correctly
        arrow.style.borderLeft = "10px solid transparent";
        arrow.style.borderRight = "10px solid transparent";
        arrow.style.borderTop = "10px solid black";
        menu.appendChild(arrow);

        document.body.appendChild(menu);

        // Add event listener to remove the menu when clicking outside of it
        document.addEventListener("mousedown", handleOutsideClick(menu));
      }

      // Highlight the selected text
      document.execCommand("hiliteColor", false, "yellow");

      // Calculate position based on the selection
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft;
      const top = rect.top + scrollTop + 30;
      const left = rect.left + scrollLeft + rect.width / 2; // Adjusted left position
      setTextBoxPosition({ top, left });
      // Update menu position
      menu.style.top = `${top - 80}px`;
      menu.style.left = `${left - 15}px`;
    } else {
      setSelectedText("");
      setShowTextBox(false);
    }
  }

  // Function to handle clicks outside of the menu
  function handleOutsideClick(menu) {
    return function (event) {
      if (!menu.contains(event.target)) {
        // Click is outside of the menu
        menu.remove(); // Remove the menu
        document.removeEventListener("mousedown", handleOutsideClick); // Remove the event listener
      }
    };
  }

  const handleTextBoxChange = (e) => {
    setNotes(e.target.value);
  };

  const handleSaveText = async () => {
    if (user) {
      try {
        const ref = collection(db, "users", user.uid, chapterVerse); // Reference the collection with chapterVerse name
        const docRef = await addDoc(ref, {
          content: selectedText,
          notes: Notes,
        });

        console.log("Document written with ID: ", docRef.id);

        setSelectedText("");
        setNotes("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const handleToggleNotesSidebar = () => {
    if (!user) {
      // User is not signed in, show toast notification
      toast.error("Please sign in to use the notes section", {});
    } else {
      // User is signed in, toggle notes sidebar
      setIsNotesSidebarOpen((prev) => !prev);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowTextBox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchVerseDetails() {
      try {
        const chapterVerse = searchParams.get("chapterVerse");
        const response = await fetch(
          `https://gita-learn-api.vercel.app/api/verse/${chapterVerse}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        setVerseDetails(data.verseDetails);
      } catch (error) {
        console.error("Error fetching verse details:", error);
        // Handle error here
      }
    }

    async function fetchAudioData() {
      try {
        const response = await fetch(
          `https://gita-learn-api.vercel.app/api/audio/${chapterVerse}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setAudioData(data.audio);
      } catch (error) {
        console.error("Error fetching audio data:", error);
        // Handle error here
      }
    }

    if (chapterVerse) {
      fetchVerseDetails();
      fetchAudioData();
    }
  }, [chapterVerse]);

  const fetchVerseNumbers = async () => {
    try {
      const response = await fetch(
        "https://gita-learn-api.vercel.app/api/verseNumbers"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch verse numbers");
      }
      const data = await response.json();
      return data.verseNumbers;
    } catch (error) {
      console.error("Error fetching verse numbers:", error);
      return [];
    }
  };

  const handleClearAll = () => {
    setNotes(""); // Reset textarea
  };
  // Function to handle previous button click
  // Function to handle previous button click
  async function fetchAudioData(chapterVerse) {
    try {
      const response = await fetch(
        `http://localhost:4000/api/audio/${chapterVerse}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.audio;
    } catch (error) {
      console.error("Error fetching audio data:", error);
      return {};
    }
  }

  // Function to handle previous button click
  const handlePreviousPage = async () => {
    try {
      const verseNumbers = await fetchVerseNumbers();
      const currentIndex = verseNumbers.indexOf(chapterVerse);
      if (currentIndex > 0) {
        const previousChapterVerse = verseNumbers[currentIndex - 1];
        const audioDataResponse = await fetchAudioData(previousChapterVerse);
        // setChapterVerse(previousChapterVerse);
        setAudioData(audioDataResponse);
        router.push(`/VerseDetail?chapterVerse=${previousChapterVerse}`);
      } else {
        console.log("No previous verse available");
      }
    } catch (error) {
      console.error("Error navigating to previous verse:", error);
    }
  };

  // Function to handle next button click
  const handleNextPage = async () => {
    try {
      const verseNumbers = await fetchVerseNumbers();
      const currentIndex = verseNumbers.indexOf(chapterVerse);
      if (currentIndex < verseNumbers.length - 1) {
        const nextChapterVerse = verseNumbers[currentIndex + 1];
        const audioDataResponse = await fetchAudioData(nextChapterVerse);
        // setChapterVerse(nextChapterVerse);
        setAudioData(audioDataResponse);
        router.push(`/VerseDetail?chapterVerse=${nextChapterVerse}`);
      } else {
        console.log("No next verse available");
      }
    } catch (error) {
      console.error("Error navigating to next verse:", error);
    }
  };

  // Fetch audio data function

  // const redirectToQuiz = () => {
  //   // Check if chapterVerse is a valid value before redirecting
  //   if (chapterVerse) {
  //     // Redirect to the quiz page with the current chapterVerse as a query parameter
  //     router.push(`/Quiz?verseId=${chapterVerse}`);
  //   } else {
  //     console.error("Invalid chapterVerse:", chapterVerse);
  //     // Handle the case where chapterVerse is null or invalid
  //   }
  // };

  // const handleCreateCommunityId = async () => {
  //   try {
  //     const communityIdRef = doc(collection(getFirestore(), "communityIds"));
  //     const communityIdSnapshot = await getDoc(communityIdRef);

  //     if (communityIdSnapshot.exists()) {
  //       alert("Community ID already exists. Try entering the existing ID.");
  //     } else {
  //       const newCommunityId = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit ID
  //       setGeneratedCommunityId(newCommunityId);

  //       setIsCreatingCommunityId(true);

  //       const communityData = {
  //         communityId: newCommunityId,
  //         verseId: chapterVerse,
  //       };

  //       await addDoc(collection(getFirestore(), "communityIds"), communityData);

  //       console.log("Community ID created:", communityData);
  //     }
  //   } catch (error) {
  //     console.error("Error creating community ID:", error);
  //     // Handle error here
  //   }
  // };
  // const handleEnterCommunityId = async () => {
  //   if (!communityId) {
  //     alert("Please enter a Community ID.");
  //     return;
  //   }
  
  //   try {
  //     // Check if the entered community ID exists in the collection
  //     const communityPinRef = collection(db, "communityIds");
  //     const communityPinQuery = query(
  //       communityPinRef,
  //       where("communityId", "==", parseInt(communityId))
  //     );
  //     const communityPinSnapshot = await getDocs(communityPinQuery);
  
  //     if (!communityPinSnapshot.empty) {
  //       // The entered community ID exists in the collection
  //       const currentVerseId = chapterVerse;
  
  //       // Send request to the owner of the community ID
  //       const requestData = {
  //         communityId: parseInt(communityId),
  //         status: 'pending',
  //         createdAt: new Date()
  //       };
  
  //       // Create communityIdRequests collection if it doesn't exist
  //       const communityIdRequestsRef = collection(db, "communityIdRequests");
  //       await addDoc(communityIdRequestsRef, { sampleField: "sampleValue" }); // Add a sample field to ensure the collection is created
  
  //       // Add request document to communityIdRequests collection
  //       await addDoc(collection(db, 'communityIdRequests'), requestData);
  
  //       // Redirect user to the quiz page
  //       window.location.href = `/Quiz?verseId=${currentVerseId}&communityId=${communityId}`;
  //     } else {
  //       // The entered community ID does not exist in the collection
  //       alert("Community ID does not exist. Please enter a valid ID.");
  //     }
  //   } catch (error) {
  //     console.error('Error entering community ID:', error);
  //     // Handle error here
  //   }
  // };
  

  async function fetchQuestions(chapterVerse) {
    try {
      const response = await fetch(
        `https://gita-learn-api.vercel.app/api/questions/${chapterVerse}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      return data.questions;
    } catch (error) {
      console.error("Error fetching questions:", error);
      return null;
    }
  }

  // Define a function to check if questions exist for a given chapterVerse
  // Define a function to check if any type of questions exist for a given chapterVerse
  async function checkQuestionsExist(chapterVerse) {
    const questions = await fetchQuestions(chapterVerse);
    return questions && questions.fillUps && questions.fillUps.length > 0;
  }

  // Use the useEffect hook to fetch questions and update questionsExist state
  useEffect(() => {
    async function updateQuestionsExist() {
      if (chapterVerse) {
        console.log("Fetching questions for chapter verse:", chapterVerse);
        const exist = await checkQuestionsExist(chapterVerse);
        setQuestionsExist(exist);
      }
    }
    updateQuestionsExist();
  }, [chapterVerse]);

  return (
    <>
    <head>
        <title>Bhagavad Gita Chapter-wise Verses - Bhagavad Gita As It Is</title>
        <meta name="description" content="Dive into the profound wisdom of the Bhagavad Gita chapter by chapter. Discover the authentic translations and interpretations from 'Bhagavad Gita As It Is' and explore the spiritual essence of each verse." />
        <meta name="keywords" content="Bhagavad Gita, BG, Bhagwat Gita, Bhagvad Gita, Gita, Bhagavad Gita As It Is, Bhagavad Gita Verses, Chapter-wise Gita Verses, Spiritual Text, Hindu Scripture" />
    </head>
      <ToastContainer />
      <div className="min-h-screen p-4" id={`verse${chapterVerse}`}>
        <h1 className="flex justify-center pt-6 mb-4 text-3xl font-bold 32">
          Bg. {chapterVerse}
        </h1>

        <div
          className="flex justify-center mb-4"
          style={{ whiteSpace: "pre-line" }}
        >
          <p
            className="flex p-5 text-xl font-bold text-center w-100"
            onMouseUp={handleTextSelection}
          >
            {verseDetails.sanskrit_shlok}
          </p>

          {showTextBox && selectedText && (
            <div
              ref={boxRef}
              className="absolute p-4 text-white bg-orange-200 border border-gray-500 rounded-lg"
              style={{
                top: textBoxPosition.top,
                left: textBoxPosition.left,
              }}
            >
              <h3 className="text-black">Text: {selectedText}</h3>

              <div className="flex flex-col">
                <textarea
                  className="p-2 mt-2 text-black bg-white border border-gray-500 rounded-lg"
                  value={Notes}
                  onChange={handleTextBoxChange}
                  rows={5}
                  cols={30}
                />
                <div className="flex justify-center mt-2">
                  <button
                    className="px-4 py-2 text-white bg-blue-500 border border-white rounded-lg"
                    onClick={handleSaveText}
                  >
                    Save
                  </button>
                  <div className="w-4" />
                  <button
                    className="px-4 py-2 bg-gray-500 border border-white rounded-lg"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div
          className="flex justify-center mb-4"
          style={{ whiteSpace: "pre-line" }}
        >
          <p
            className="flex p-3 text-xl italic text-center w-100"
            onMouseUp={handleTextSelection}
          >
            {verseDetails.english_shlok}
          </p>
        </div>
        <div className="p-4 mb-4 font-normal text-justify sm:mx-20 sm:px-10">
      <h2 className="flex justify-center text-xl font-semibold">Audio</h2>
      {Array.isArray(audioData.audioUrl) ? (
        <div className="flex flex-col items-center justify-center p-5 ">
          {audioData.audioUrl.map((url, index) => (
            <audio controls className="m-2 w-96" key={index}>
              <source src={url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          ))}
        </div>
      ) : (
        audioData.audioUrl && (
          <div className="flex items-center justify-center p-5">
            <audio controls className="w-96">
              <source src={audioData.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )
      )}
    </div>
        <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 ">
          <h2 className="flex justify-center p-3 text-2xl font-bold">
            Synonyms
          </h2>
          <p
            className="flex justify-center p-3 text-lg "
            onMouseUp={handleTextSelection}
          >
            {verseDetails.synonyms}
          </p>
        </div>
        <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10">
          <h2 className="flex justify-center p-3 text-2xl font-bold ">
            Translation
          </h2>
          <p
            className="flex justify-center p-3 text-lg font-semibold"
            onMouseUp={handleTextSelection}
          >
            {verseDetails.translation}
          </p>
        </div>
        <div onMouseUp={handleTextSelection}>{RenderPurport(verseDetails)}</div>

        {/* Conditionally render the Purport section */}
        {/* Display audio data */}
        {/* <div className="grid grid-cols-2 join"> */}
        <div className="p-4 flex justify-between mx-2.5 font-normal text-justify sm:mx-20 sm:px-10">
          <button
            onClick={handlePreviousPage}
            className="join-item btn btn-outline"
          >
            Previous page
          </button>
          <button
            onClick={handleNextPage}
            className="join-item btn btn-outline"
          >
            Next
          </button>
        </div>

        {/* <div className="flex justify-center p-4">
          {questionsExist && (
            <button onClick={redirectToQuiz} className="text-white bg-orange-400 btn">
              Start Quiz
            </button>
          )}
        </div>

        {questionsExist && (
          <div className="flex justify-center p-4 space-x-4">
            {!isCreatingCommunityId ? (
              <div>
                <button onClick={handleCreateCommunityId} className="text-white bg-orange-400 btn">
                  Create a Community ID
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => setIsCreatingCommunityId(false)} className="text-white bg-orange-400 btn">
                  Back
                </button>
              </div>
            )}
          </div>
        )}

        {isCreatingCommunityId && (
          <div className="flex justify-center p-4">
            <div>
              <p className="text-lg">Community ID: {generatedCommunityId}</p>
            </div>
          </div>
        )} */}

{questionsExist && !isCreatingCommunityId && (
  <div className="flex justify-center p-4">
    <div className="flex items-center space-x-4">
      <select
        value={communityId}
        onChange={(e) => setCommunityId(e.target.value)}
        className="w-64 px-4 py-2 text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Community Name</option>
        {yourIds.map((id) => (
          <option key={id.communityId} value={id.communityId}>
            {id.communityId} - {id.communityName}
          </option>
        ))}
      </select>

      <button
        onClick={handleEnterCommunityId}
        className="text-white bg-orange-400 btn"
      >
        Enter
      </button>
    </div>
  </div>
)}



        <button
          onClick={handleToggleNotesSidebar}
          className="fixed px-4 py-2 text-3xl text-white bg-blue-500 shadow rounded-3xl bottom-4 right-4 hover:bg-blue-600"
        >
          <FaPenSquare />
        </button>
        {isNotesSidebarOpen && (
          <NotesSidebar onClose={handleToggleNotesSidebar} />
        )}
        <PublicNotes verseId={chapterVerse} />
      </div>
      <Footer />
      <ScrollDepth verse={chapterVerse} />
    </>
  );
}

export default VerseDetail;
