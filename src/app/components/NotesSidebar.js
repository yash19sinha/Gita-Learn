// components/NotesSidebar.js
"use client"
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/auth';

function NotesSidebar({ onClose }) {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const notesRef = collection(db, 'notes');
      const userNotesQuery = query(notesRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(userNotesQuery, (snapshot) => {
        const userNotes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNotes(userNotes);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const addNote = async () => {
    if (user) {
      await addDoc(collection(db, 'notes'), {
        userId: user.uid,
        content: note,
        createdAt: serverTimestamp(),
      });

      setNote('');
    }
  };

  return (
    <div className="notes-sidebar">
      <h1>Your Notes</h1>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
      <textarea value={note} onChange={(e) => setNote(e.target.value)}></textarea>
      <button onClick={addNote}>Add Note</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default NotesSidebar;
