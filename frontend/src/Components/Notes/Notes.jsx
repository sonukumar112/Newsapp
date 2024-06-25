import React, { useEffect } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useNews } from "../NewsContext";
import { IoMdClose } from "react-icons/io";
import { AiOutlineDelete } from "react-icons/ai";

const Notes = () => {
  const {
    contactActive,
    openContactForm,
    closeContactForm,
    notesList,
    setNotesList,
    handleInput,
    handleSubmit,
    userInput,
    handleDeleteNote,
  } = useNews();

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notesList"));
    if (savedNotes) {
      setNotesList(savedNotes);
    }
  }, [setNotesList]);

  return (
    <>
      <div
        id="floating-btn"
        className="fixed bottom-20 right-5 z-[100] flex flex-col items-center justify-center md:bottom-10"
      >
        <span
          className={`flex flex-col items-center justify-center p-[12px] bg-dark-400 rounded-[50%] border-green-2003 transition-all scale-[.80] hover:scale-[.95] cursor-pointer`}
        >
          <Fab color="primary" aria-label="add" onClick={openContactForm}>
            <AddIcon />
          </Fab>
        </span>
      </div>

      <div
        className={`w-[380px] ${
          contactActive ? "h-[57vh]" : "h-0 overflow-hidden"
        } bg-gray-700 max-h-[450px] bg-dark-300 shadow-xl z-[999] fixed bottom-[90px] right-1 px-3 rounded-md transition-all md:right-5 md:bottom-[20px] md:w-[350px]`}
        id="form"
      >
        <div
          id="head"
          className="w-full flex flex-row items-start justify-start"
        >
          <h1 className="text-[25px] py-4 text-white">Add Notes</h1>
          <IoMdClose
            className={`p-2 text-[35px] absolute top-[-16px] right-[-5px] text-white bg-red-900 rounded-[50%] cursor-pointer ${
              contactActive ? "flex" : "hidden"
            }`}
            onClick={closeContactForm}
          />
        </div>
        <div
          id="inputs"
          className="w-full flex flex-col items-start justify-start"
        >
          <input
            type="text"
            name="title"
            className="w-full px-2 py-[12px] mb-4 rounded-md bg-dark-100 border-[2px] border-none outline-none"
            placeholder="Title"
            value={userInput.title}
            onChange={handleInput}
          />
          <textarea
            cols="30"
            rows="5"
            name="notes"
            className="w-full h-[180px] bg-dark-100 resize-none rounded-md outline-none px-2 py-2 mb-3"
            placeholder="Notes"
            value={userInput.notes}
            onChange={handleInput}
          ></textarea>
          <button
            className="w-full px-2 py-3 text-center transition-all bg-dark-200 rounded-md bg-red-700 text-white hover:bg-red-800"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>

      <div className="w-full p-4">
        {notesList.length === 0 ? (
          <div className="text-center text-gray-500">Add notes here</div>
        ) : (
          notesList.map((note) => (
            <div
              key={note.id}
              className="mb-4 p-4 bg-gray-200 rounded-md shadow-md relative"
            >
              <h2 className="text-lg font-bold">{note.title}</h2>
              <p className="mt-2">{note.notes}</p>
              <AiOutlineDelete
                className="absolute top-2 right-2 text-red-500 cursor-pointer"
                size={24}
                onClick={() => handleDeleteNote(note.id)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Notes;
