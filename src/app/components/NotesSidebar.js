import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { MdDelete } from "react-icons/md";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/auth";

function NotesSidebar({ onClose }) {
  const [boldMode, setBoldMode] = useState(false);
  const [showFullNote, setShowFullNote] = useState({});
  const searchParams = useSearchParams();
  const chapterVerse = searchParams.get("chapterVerse");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedNote, setEditedNote] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (user && chapterVerse) {
      const userNotesRef = collection(db, "users", user.uid, chapterVerse); // Reference the collection with chapterVerse name
      const unsubscribe = onSnapshot(userNotesRef, (snapshot) => {
        const userNotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          showFull: false, // Add 'showFull' property to each note object
        }));
        setNotes(userNotes);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleToggleFullNote = (noteId) => {
    setShowFullNote((prevShowFullNote) => ({
      ...prevShowFullNote,
      [noteId]: !prevShowFullNote[noteId], // Toggle 'showFull' for the specific note
    }));
  };
  const deleteNote = async (noteId) => {
    try {
      if (user && chapterVerse) {
        const userNoteRef = doc(db, "users", user.uid, chapterVerse, noteId);
        await deleteDoc(userNoteRef);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const addNote = async () => {
    if (user && chapterVerse) {
      try {
        const userNotesRef = collection(db, "users", user.uid, chapterVerse);
        await addDoc(userNotesRef, {
          content: note,
        });

        setNote("");
      } catch (error) {
        console.error("Error adding note:", error);
      }
    }
  };

  const handleEditNote = (noteId, noteContent) => {
    setEditingNoteId(noteId);
    setEditedNote(noteContent);
  };

  const updateNote = async () => {
    if (user && chapterVerse && editingNoteId) {
      try {
        const userNoteRef = doc(
          db,
          "users",
          user.uid,
          chapterVerse,
          editingNoteId
        );
        await updateDoc(userNoteRef, {
          notes: editedNote,
        });
        setEditingNoteId(null); // Reset editing mode
      } catch (error) {
        console.error("Error updating note:", error);
      }
    }
  };

  return user ? (
    <div
      className="fixed top-0 right-0 p-4 m-4 mt-24 overflow-y-auto bg-white rounded-lg h-3/4 md:w-2/6 notes-sidebar"
      style={{
        boxShadow: "4px 8px 10px rgba(128, 128, 128, 0.5)",
        backgroundColor: "rgba(245, 247, 246)",
        borderLeft: "1px solid black",
        borderTop: "1px solid black",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="flex-grow text-2xl font-semibold text-center top-1100pt-5">
          Notes of Bg: {chapterVerse} ({notes.length})
        </h1>

        <button
          className="fixed p-1 pl-2 pr-2 bg-white border rounded-lg top-1000 right-10 border-black-1px"
          onClick={onClose}
          style={{ alignSelf: "flex-start" }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            style={{ fontSize: "24px", color: "black" }}
            onMouseEnter={(e) => {
              e.target.style.color = "red";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "black";
            }}
          />
        </button>
      </div>

      <ul className="max-w-full pl-4 list-disc">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-2 mb-4 border border-gray-200 rounded-lg shadow-lg bg-white-300 opacity-400"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-grow overflow-hidden">
                <p className="p-3 mb-1 text-center bg-gray-100 border rounded border-black-5px ">
                  <span className="font-bold bg-green-200">
                    {note.content}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-grow overflow-hidden">
                {editingNoteId === note.id ? (
                  <textarea
                    className="w-full h-32 p-1 bg-gray-100 border-none rounded" // Increase height
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    placeholder="Enter your notes here..."
                  />
                ) : (
                  <div>
                    {showFullNote[note.id] ? (
                      <p className="p-1 bg-gray-100 rounded">{note.notes}</p>
                    ) : (
                      <p className="bg-gray-100 p-1 rounded h-20 text-ellipsis overflow-hidden ... ">
                        {note.notes}
                      </p>
                    )}
                    {note.notes.length > 50 && (
                      <button
                        onClick={() => handleToggleFullNote(note.id)}
                        className="text-blue-500 hover:underline"
                      >
                        {showFullNote[note.id] ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-2">
              {editingNoteId === note.id ? (
                <>
                  <button
                    onClick={updateNote}
                    className="px-3 py-1 m-1 text-xl text-gray-100 bg-blue-300 rounded hover:text-black"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="px-3 py-1 m-1 text-xl text-gray-100 bg-gray-400 rounded hover:text-black"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditedNote(note.notes); // Preserves the previous notes
                      setEditingNoteId(note.id);
                    }}
                    className="px-3 py-1 m-1 text-xl text-gray-100 bg-blue-300 rounded hover:text-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="px-3 py-1 m-1 text-xl text-gray-100 bg-red-300 rounded hover:text-white"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </ul>
    </div>
  ) : null;
}

export default NotesSidebar;
