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
        }));
        setNotes(userNotes);
      });

      return () => unsubscribe();
    }
  }, [user]);

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
      className="fixed top-0 right-0 p-4 m-4 mt-24 overflow-y-auto bg-white rounded-lg  h-3/4 md:w-2/6 notes-sidebar"
      style={{
        boxShadow: "4px 8px 10px rgba(128, 128, 128, 0.5)",
        backgroundColor: "rgba(245, 247, 246)",
        borderLeft: "1px solid black",
        borderTop: "1px solid black",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold flex-grow text-center">
          Notes of Bg: {chapterVerse}
        </h1>
        <button onClick={onClose}>
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
            className="mb-4 p-2 border border-black rounded-lg bg-white"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-grow overflow-hidden">
                <p className="mb-1 bg-gray-100 p-1 rounded">
                  <span className=" font-bold">Text:</span> {note.content}{" "}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-start">
              <div className="flex-grow overflow-hidden">
                {editingNoteId === note.id ? (
                  <textarea
                    className="w-full bg-gray-100 p-1 rounded"
                    value={editedNote} // Use editedNote for value
                    onChange={(e) => setEditedNote(e.target.value)} // Update editedNote state
                  />
                ) : (
                  <p className=" bg-gray-100 p-1 rounded">
                    <span className="font-bold">Notes:</span> {note.notes}
                  </p>
                )}
              </div>
              <div>
                {editingNoteId === note.id ? (
                  <button
                    onClick={updateNote}
                    className="m-1 text-xl text-gray-500 hover:text-black-700"
                  >
                    <svg
                      class="h-6 w-6 text-gray-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />{" "}
                      <polyline points="17 21 17 13 7 13 7 21" />{" "}
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditNote(note.id, note.notes)}
                    className="m-1 text-xl text-gray-500 hover:text-black-700"
                  >
                    <svg
                      class="h-6 w-6 text-gray-500"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      {" "}
                      <path stroke="none" d="M0 0h24v24H0z" />{" "}
                      <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                      <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                      <line x1="16" y1="5" x2="19" y2="8" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => deleteNote(note.id)}
                  className="m-1 text-xl text-gray-500 hover:text-red-700"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          </div>
        ))}
      </ul>
    </div>
  ) : null;
}

export default NotesSidebar;
