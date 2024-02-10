"use client";
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, setDoc, collection, addDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { MdDelete } from "react-icons/md";
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';



function PublicNotes({ verseId }) {
  const [publicNotes, setPublicNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  useEffect(() => {
    const validateAndFetchNotes = async () => {
      try {
        if (!verseId) {
          console.error('Invalid verseId:', verseId);
          return;
        }

        const user = auth.currentUser;
        const uid = user ? user.uid : null;

        const notesRef = collection(db, `publicNotes/${verseId}/Notes`);

        const unsubscribe = onSnapshot(notesRef, (snapshot) => {
          const notes = snapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, uid: data.uid, username: data.username, note: data.note };
          });
          setPublicNotes(notes);
        });

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    validateAndFetchNotes();
  }, [verseId]);


  const handleAddNote = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
  
        // Fetch the user's display name
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
  
        if (userDoc.exists()) {
          const username =
            userDoc.data().authMethod === 'google'
              ? userDoc.data().displayName
              : userDoc.data().name;
  
              if (image) {
                // Upload image to Firebase Storage
                const storageRef = ref(
                  storage,
                  `publicNotes/${verseId}/images/${image.name}`
                );
                await uploadBytes(storageRef, image);
              
                // Get download URL of the uploaded image
                const downloadURL = await getDownloadURL(storageRef);
                setImageUrl(downloadURL); // Set imageUrl here
              }
              
          // Add new note only if the image upload is successful
          const verseIdString = String(verseId);
          const notesCollectionRef = collection(
            db,
            'publicNotes',
            verseIdString,
            'Notes'
          );
  
          // Update the local state with the new note
          const newNoteRef = await addDoc(notesCollectionRef, {
            uid,
            username,
            note: newNote,
            imageUrl,
          });
  
          setPublicNotes([
            ...publicNotes,
            { id: newNoteRef.id, uid, username, note: newNote, imageUrl },
          ]);
          setNewNote('');
          setImage(null); // Clear the image state
        } else {
          console.error('User document not found for UID:', uid);
        }
      } else {
        console.error('User is not signed in.');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };
  


// ...


  const handleDeleteNote = async (id) => {
    try {
      const notesCollectionRef = collection(db, 'publicNotes', String(verseId), 'Notes');
      const existingNote = publicNotes.find((note) => note.id === id);

      // Check if the note belongs to the current user before allowing delete
      if (existingNote && existingNote.uid === auth.currentUser?.uid) {
        await deleteDoc(doc(notesCollectionRef, id));
        setPublicNotes(publicNotes.filter((note) => note.id !== id));
      } else {
        console.error('User does not have permission to delete this note.');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
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
          <textarea
            rows="4"
            cols="50"
            placeholder="Add your public note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full p-3 text-black bg-white border rounded-md"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-4"
          />
          <button
            onClick={handleAddNote}
            className="justify-center mt-4 btn btn-primary"
          >
            Add Note
          </button>
          <ul className="mt-4">
          {publicNotes.map((note) => (
          <li key={note.id} className="flex items-center justify-between p-4 mb-2 border rounded-lg">
            <div>
              <p><strong>{note.username}:</strong> {note.note}</p>
              {note.imageUrl && (
                <img src={note.imageUrl} alt="Public Note Image" className="max-w-full mt-2" />
              )}
            </div>
            {note.uid === auth.currentUser?.uid && (
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="m-2 text-2xl text-red-500 hover:text-red-700"
              >
                <MdDelete />
              </button>
            )}
          </li>
        ))}

          </ul>
        </div>
      )}
    </div>
  );
}

export default PublicNotes;