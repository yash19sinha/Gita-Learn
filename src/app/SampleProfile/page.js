
 // pages/Profile.js
 "use client";
 import { useEffect, useState } from 'react';
 import { useAuth } from '../hooks/auth';
 import { collection, doc, getDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';
 import { auth, db } from "../firebase/config";
 import 'react-calendar/dist/Calendar.css';
 import CalendarHeatmap from 'react-calendar-heatmap';
 import 'react-calendar-heatmap/dist/styles.css';
 import { Tooltip } from 'react-tooltip';
 import CreateCommunityIdForm from '../components/CreateCommunityId';
 import ScrollDataTable from '../components/ScrollDataTable';
 import { toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 import { useRouter } from 'next/navigation';
 import { GiHamburgerMenu } from "react-icons/gi";
 
 function Page() {
   const user = auth.currentUser; 
   const [userData, setUserData] = useState(null);
   const [averageScore, setAverageScore] = useState(0);
   const [quizzesAttempted, setQuizzesAttempted] = useState(0);
   const [timersData, setTimersData] = useState([]);
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [phoneno, setPhoneno] = useState('');
   const [newPhoneNo, setNewPhoneNo] = useState('');
   const [isEditing, setIsEditing] = useState(false);
   const [imageURL, setImageURL] = useState(null);
   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
   const [activeContent, setActiveContent] = useState('Profile');
   const imgUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
   const [generatedCommunityId, setGeneratedCommunityId] = useState('');
   const router = useRouter();
   
   const today = new Date();
   const startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
   const endDate = today;
 
   useEffect(() => {
 
     if (!user) {
       toast.warn("Please login first");
       router.push('/login');
       return;
     }
    
 
     const fetchUserProfile = async () => {
       try {
         const email = user.email;
         const name = user.displayName;
 
         setEmail(email);
         setName(name);
 
         const userDocRef = doc(db, 'users', user.uid);
         const userDoc = await getDoc(userDocRef);
 
         if (userDoc.exists()) {
           const userDataFromFirestore = userDoc.data();
           setUserData(userDataFromFirestore);
 
           if (user.photoURL) {
             console.log('User Photo URL:', user.photoURL);
             setImageURL(user.photoURL);
           } else {
             setImageURL(imgUrl);
           }
 
           const scoresRef = collection(db, 'scores');
           const userScoresQuery = query(scoresRef, where('userId', '==', user.uid));
           const userScoresSnapshot = await getDocs(userScoresQuery);
 
           let totalScore = 0;
           let quizzesCount = 0;
 
           userScoresSnapshot.forEach((scoreDoc) => {
             const scoreData = scoreDoc.data();
             totalScore += scoreData.score;
             quizzesCount += 1;
           });
 
           const avgScore = quizzesCount > 0 ? totalScore / quizzesCount : 0;
           setAverageScore(avgScore);
           setQuizzesAttempted(quizzesCount);
 
           if (userDataFromFirestore.timers) {
             const timersArray = userDataFromFirestore.timers.map((timerData) => ({
               timer: (timerData.timer / 60).toFixed(2),
               timestamp: timerData.timestamp.toDate(),
             }));
 
             const uniqueDatesMap = new Map();
 
             timersArray.forEach((timerData) => {
               const dateKey = timerData.timestamp.toISOString().split('T')[0];
 
               if (uniqueDatesMap.has(dateKey)) {
                 uniqueDatesMap.set(dateKey, uniqueDatesMap.get(dateKey) + parseFloat(timerData.timer));
               } else {
                 uniqueDatesMap.set(dateKey, parseFloat(timerData.timer));
               }
             });
 
             const uniqueTimersArray = Array.from(uniqueDatesMap, ([date, timer]) => ({
               timestamp: new Date(date),
               timer: timer.toFixed(2),
             }));
 
             console.log(uniqueTimersArray);
             setTimersData(uniqueTimersArray);
           } else {
             console.error('Timers data not found in user document.');
           }
         } else {
           console.error('User document not found in Firestore.');
         }
       } catch (error) {
         console.error('Error fetching user profile:', error);
       }
     };
 
     fetchUserProfile();
   }, [user, router]);
 
   const updatePhoneNumber = async () => {
     try {
       const userDocRef = doc(db, 'users', user.uid);
       await updateDoc(userDocRef, { phoneNo: newPhoneNo });
       setPhoneno(newPhoneNo);
       setIsEditing(false);
       console.log('Phone number updated successfully.');
     } catch (error) {
       console.error('Error updating phone number:', error);
     }
   };
 
   const handleCommunityIdCreated = (newCommunityId) => {
     setGeneratedCommunityId(newCommunityId);
   };
   const toggleDrawer = () => {
     setIsDrawerOpen(prevState => !prevState);
   };
 
   const handleSidebarItemClick = (content) => {
     setIsDrawerOpen(false); // Close the drawer after clicking on sidebar item
     setActiveContent(content);
   };
 
 
 
   return (
     <div className="min-h-screen drawer">
       <input id="my-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} onChange={toggleDrawer} />
       <div className="drawer-content">
         <label htmlFor="my-drawer" className="text-2xl bg-orange-300 btn drawer-button">
         <GiHamburgerMenu className=' 5xl' />
         </label>
         <div className="container p-4 mx-auto mt-4">
           <div >
             {activeContent === 'Profile' && (
       
               <div>
               <div className="flex flex-col items-center md:flex-row">
                <div className="p-4 mb-4 rounded shadow md:mr-4 md:mb-0">
          {imageURL && (
            <img
              src={imageURL}
              alt="User Profile"
              className="w-56 h-56 mx-auto mb-2 rounded-full md:mr-4"
            />
          )}
          {userData && (
            <h1 className="text-3xl font-bold text-center text-black">
              {name || userData.name}
            </h1>
          )}
        </div>

        {userData && (
          <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow-md md:w-4/5 h-72">
            <div className="mb-2">
              <span className="text-xl font-semibold">Name: {name || userData.name}</span>
            </div>
            <div className="mb-2">
              <span className="text-xl font-semibold">Email: {email}</span>
            </div>
            <div className="flex items-center mb-2">
              <label className="text-xl font-semibold text-gray-600">Phone Number:</label>
              {isEditing ? (
                <input
                  type="text"
                  className="p-1 ml-2 border rounded"
                  value={newPhoneNo}
                  onChange={(e) => setNewPhoneNo(e.target.value)}
                />
              ) : (
                <p className="ml-2 text-lg">{phoneno || userData.phoneNo}</p>
              )}
              {isEditing ? (
                <button
                  className="px-3 py-1 ml-2 text-white bg-green-500 rounded hover:bg-green-600"
                  onClick={updatePhoneNumber}
                >
                  Save
                </button>
              ) : (
                <button
                  className="px-3 py-1 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        )}   
         
      </div>
      <div className='overflow-x-auto w-80 md:w-full'>
      <ScrollDataTable/>
      </div>
      </div>
  
    )}
   
      
      
             
            
             {activeContent === 'Create Quiz Id' && (
                    <div className='flex justify-center'>
                    <CreateCommunityIdForm onCreate={handleCommunityIdCreated} />
                    </div>
             )}
             {activeContent === 'Streaks' && (
               <div>
                <h2 className="mt-4 mb-2 text-2xl font-bold text-black">Reading Streak</h2>
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={timersData.map((timer) => ({
          date: timer.timestamp.toISOString().split('T')[0],
          count: 2,
        }))}
        classForValue={(value) => {
          if (!value) {
            return 'color-empty';
          }
          return `color-scale-${value.count}`;
        }}
        showWeekdayLabels
        titleForValue={(value) => value && `${value.date}`}
        tooltipDataAttrs={(value) => ({
          'data-tip': `${value.date}: ${value.count}`,
        })}
        className="w-full max-w-screen-md px-4 mx-auto"
      />
      <Tooltip />
      <table className="w-full my-4 bg-white rounded shadow table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Day and date</th>
            <th className="px-4 py-2">Timer</th>
          </tr>
        </thead>
        <tbody>
          {timersData.map((timer, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border">{timer.timestamp.toDateString()}</td>
              <td className="px-4 py-2 border">{timer.timer} Minutes</td>
            </tr>
          ))}
        </tbody>
      </table>
             
               </div>
             )}
           </div>
         </div>
       </div>
       <div className="drawer-side">
         <label htmlFor="my-drawer" aria-label="close sidebar" className={`drawer-overlay ${isDrawerOpen ? 'block' : 'hidden'}`} onClick={toggleDrawer}></label>
         <ul className={`min-h-full p-4 menu w-80 bg-base-200 text-base-content ${isDrawerOpen ? 'block' : 'hidden'}`}>
           <li>
             <button 
               className={`sidebar-item ${activeContent === 'Profile' ? 'active' : ''}`} 
               onClick={() => {
                 handleSidebarItemClick('Profile');
               }}
             >
               Profile
             </button>
           </li>
           <li>
             <button 
               className={`sidebar-item ${activeContent === 'Create Quiz Id' ? 'active' : ''}`} 
               onClick={() => {
                 handleSidebarItemClick('Create Quiz Id');
               }}
             >
               Create Quiz Id
             </button>
           </li>
           <li>
             <button 
               className={`sidebar-item ${activeContent === 'Streaks' ? 'active' : ''}`} 
               onClick={() => {
                 handleSidebarItemClick('Streaks');
               }}
             >
               Streaks
             </button>
           </li>
         </ul>
       </div>
     </div>
   );
 };
 
 export default Page;
 
 
 
 
 