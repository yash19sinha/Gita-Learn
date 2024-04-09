// pages/VerseDetail.js
"use client";
import { useSearchParams } from "next/navigation";
import Head from "next/head";
import { useEffect, useState, useRef, useContext } from "react";
import { Footer } from "../components/Footer";
import RenderPurport from "../components/RenderPurport";
import { useRouter } from "next/navigation";
import NotesSidebar from "../components/NotesSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPenSquare } from "react-icons/fa";
import { FaCog } from 'react-icons/fa';
import { faComment } from "@fortawesome/free-regular-svg-icons";
import PublicNotes from "../components/PublicNotes";
import { useAuth } from "../hooks/auth";
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
import { useFontSize } from '../context/FontSizeContext';

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef();


  const toggleSettings = () => {
    setIsSettingsOpen(prev => !prev);
  };

  const handleClickOutside = (event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsSettingsOpen(false);
    }
  };
 
  const { fontSizeClass, setFontSizeClass } = useFontSize();


  // Dynamically apply the font size class to the body or a top-level div
  

  // Define font size steps
  const fontSizeSteps = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl',
    'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'];
  const currentSizeIndex = fontSizeSteps.indexOf(fontSizeClass);

  // Function to increase font size
  const increaseFontSize = () => {
    const nextIndex = currentSizeIndex + 1 < fontSizeSteps.length ? currentSizeIndex + 1 : currentSizeIndex;
    setFontSizeClass(fontSizeSteps[nextIndex]);
  };

  // Function to decrease font size
  const decreaseFontSize = () => {
    const prevIndex = currentSizeIndex - 1 >= 0 ? currentSizeIndex - 1 : currentSizeIndex;
    setFontSizeClass(fontSizeSteps[prevIndex]);
  };


  useEffect(() => {
    // Add when the component mounts
    document.addEventListener('mousedown', handleClickOutside);
    // Remove when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          setShowTextBox(true); // Show the text box
          menu.remove(); // Remove the menu immediately
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
    setIsNotesSidebarOpen((prev) => !prev);
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
        `https://gita-learn-api.vercel.app/api/audio/${chapterVerse}`
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
        router.push(`/VerseDetail?chapter
        Verse=${previousChapterVerse}`);
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

  const handleEnterCommunityId = async () => {
    if (!communityId) {
      alert("Please enter a Community ID.");
      return;
    }

    // Check if the entered community ID exists in the collection
    const communityPinRef = collection(db, "communityIds");
    const communityPinQuery = query(
      communityPinRef,
      where("communityId", "==", parseInt(communityId))
    ); // Assuming 'communityId' is the field where the pin is stored
    const communityPinSnapshot = await getDocs(communityPinQuery);

    if (!communityPinSnapshot.empty) {
      // The entered community ID exists in the collection
      const currentVerseId = chapterVerse;
      setIsCreatingCommunityId(false);
      router.push(`/Quiz?verseId=${currentVerseId}&communityId=${communityId}`);
    } else {
      // The entered community ID does not exist in the collection
      alert("Community ID does not exist. Please enter a valid ID.");
    }
  };

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

    <div className={`p-4 ${fontSizeClass}`}>
      <Head>
        <title>Bhagavad Gita Chapter-wise Verses - Bhagavad Gita As It Is</title>
        <meta name="description" content="Dive into the profound wisdom of the Bhagavad Gita chapter by chapter. Discover the authentic translations and interpretations from 'Bhagavad Gita As It Is' and explore the spiritual essence of each verse." />
        <meta name="keywords" content="Bhagavad Gita, BG, Bhagwat Gita, Bhagvad Gita, Gita, Bhagavad Gita As It Is, Bhagavad Gita Verses, Chapter-wise Gita Verses, Spiritual Text, Hindu Scripture" />
      </Head>
      

      <div className={`p-4 ${fontSizeClass}`} id={`chapter${chapter}-verse${chapterVerse}`}>
        <h1 className={`flex justify-center text-2xl pt-6 mb-4 font-bold ${fontSizeClass}`}>
          Bg. {chapterVerse}
        </h1>

        <div
          className="flex justify-center mb-4"
          style={{ whiteSpace: "pre-line" }}
        >
          <p
            className="flex p-5  font-bold text-center w-100 ${fontSizeClass}"
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
            className="flex p-3 italic text-center w-100 ${fontSizeClass}"
            onMouseUp={handleTextSelection}
          >
            {verseDetails.english_shlok}
          </p>
        </div>
        <div className="p-4 mb-4 font-normal text-justify sm:mx-20 sm:px-10 ">
          <h2 className="flex justify-center  font-semibold ${fontSizeClass}">Audio</h2>
          {audioData.audioUrl && (
            <div className="flex items-center justify-center p-5">
              <audio controls className="w-96" key={audioData.audioUrl}>
                <source src={audioData.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 ">
          <h2 className="flex justify-center p-3 font-bold ${fontSizeClass}">
            Synonyms
          </h2>
          <p
            className="flex justify-center p-3 "
            onMouseUp={handleTextSelection}
          >
            {verseDetails.synonyms}
          </p>
        </div>
        <div className="p-4 font-normal text-justify sm:mx-20 sm:px-10 ${fontSizeClass}">
          <h2 className="flex justify-center p-3  font-bold ${fontSizeClass}">
            Translation
          </h2>
          <p
            className="flex justify-center p-3  font-semibold"
            onMouseUp={handleTextSelection}
          >
            {verseDetails.translation}
          </p>
        </div>
        <div className={`${fontSizeClass}`} onMouseUp={handleTextSelection}>

        <RenderPurport verseDetails={verseDetails} fontSizeClass={fontSizeClass} />

        
</div>


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
              <input
                type="text"
                placeholder="Enter Community ID"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-64 px-4 py-2 text-black bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleEnterCommunityId}
                className="text-white bg-orange-400 btn"
              >
                Enter
              </button>
            </div>
          </div>
        )}

<div className="flex flex-col">
      <button onClick={toggleSettings} className="fixed bottom-12 right-6 mb-4 px-4 py-2 text-white rounded-full bg-blue-500 shadow-lg focus:outline-none z-50">
      <FaCog />
      </button>
      
      {isSettingsOpen && (
        <div ref={settingsRef} className="fixed bottom-24 right-6 mb-4 rounded-lg text-black bg-gray-200 p-4 w-42 z-40">
          <div className="flex items-center justify-start space-x-4">
          <span>Font Size</span>
          
          <div className="flex items-center justify-between bg-white p-1 rounded h-6 w-13">
          <button onClick={decreaseFontSize} className="px-1 py-2 text-xl font-bold mr-2">-</button>
          <button onClick={increaseFontSize} className="px-1 py-2 text-xl font-bold">+</button>
          </div>
          </div>
        </div>
      )}
        {/* <select value={fontSizeClass} onChange={(e) => setFontSizeClass(e.target.value)}>
    <option value="text-base">Base</option>
    <option value="text-lg">Large</option>
    <option value="text-2xl">Extra Large</option>
    //Additional options as needed 
  </select> */}
      </div>
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
      <ScrollDepth chapter={chapter} verse={chapterVerse} />
    </div>
  );
}

export default VerseDetail;
