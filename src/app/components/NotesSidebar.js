// components/NotesSidebar.js
"use client";
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/auth';
import { MdDelete } from "react-icons/md";


function NotesSidebar({ onClose }) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const userNotesRef = collection(db, 'users', user.uid, 'notes');
      const unsubscribe = onSnapshot(userNotesRef, (snapshot) => {
        const userNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(userNotes);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addNote = async () => {
    if (user) {
      const userNotesRef = collection(db, 'users', user.uid, 'notes');
      await addDoc(userNotesRef, {
        content: note,
        createdAt: serverTimestamp(),
      });

      setNote('');
    }
  };

  const deleteNote = async (noteId) => {
    console.log('Deleting note with ID:', noteId);

    try {
      const userNoteRef = doc(db, 'users', user.uid, 'notes', noteId);
      await deleteDoc(userNoteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    user ? (
      <div className="fixed top-0 right-0 p-4 m-2 mt-24 overflow-y-auto bg-gray-200 rounded h-3/4 md:w-1/4 notes-sidebar">
        <h1 className="mb-4 text-2xl font-semibold">Your Notes</h1>
        <ul className="max-w-full pl-4 list-disc">
          {notes.map((note) => (
            <li key={note.id} className="flex items-center justify-between mb-2">
              <span className="flex-grow max-w-full overflow-hidden">{note.content}</span>
              <button
                onClick={() => deleteNote(note.id)}
                className="m-1 text-xl text-red-500 hover:text-red-700"
              >
                <MdDelete />
              </button>
            </li>
          ))}
        </ul>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-20 p-2 mb-4 bg-white border rounded"
          placeholder="Add your note..."
        ></textarea>
        <button 
          onClick={addNote}
          className="px-4 py-2 m-2 text-white bg-blue-500 rounded"
        >
          Add Note
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 m-2 text-white bg-gray-500 rounded"
        >
          Close
        </button>
      </div>
    ) : null
  );
}

export default NotesSidebar;
