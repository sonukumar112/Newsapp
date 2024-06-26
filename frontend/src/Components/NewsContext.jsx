import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { baseUrl } from '../../Url';

const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedNews, setSavedNews] = useState([]);
  const [contactActive, setContactActive] = useState(false);
  const [userInput, setUserInputs] = useState({ id: 0, title: "", notes: ""});
  const [notesList, setNotesList] = useState([]);
  const [uniqueId, setUniqueId] = useState("");
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState("in");

  useEffect(() => {
    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "https://newsapi.org/v2/top-headlines",
                {
                    params: {
                        country: country,
                        apiKey: import.meta.env.VITE_KEY,
                    },
                    headers: {
                      'Upgrade': 'HTTP/2.0',
                      'Connection': 'Upgrade'
                  },
                }
            );
            setArticles(
                response.data.articles.map((article, index) => ({
                    ...article,
                    id: index,
                }))
            );
        } catch (error) {
            console.error("Error fetching the news articles:", error);
        } finally {
            setLoading(false);
        }
    };

    //Fetch Saved News
    const fetchSavedNews = async () => {
      if (localStorage.getItem("auth-token")) {
        try {
          const response = await fetch(`${baseUrl}/getsavednews`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "auth-token": `${localStorage.getItem("auth-token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setSavedNews(data);
          console.log(savedNews);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      }
  };
    
    
  //Fetch Saved News
  const fetchNotes = async () => {
      if (localStorage.getItem("auth-token")) {
        try {
          const response = await fetch(`${baseUrl}/getnotes`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "auth-token": `${localStorage.getItem("auth-token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setNotesList(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      }
    };

    fetchNotes();
    fetchSavedNews();
    fetchNews();

  }, [country]);


//Handle Country Change i.e. India or USA
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };


//Handle News Save
const handleSave = (id, title, description, urlToImage, url) => {
  setSavedNews((prev) => prev.includes(id) ? prev.filter(articleId => articleId !== id) : [...prev, id]);
  alert("News Saved Successfully!");
  
  if (localStorage.getItem('auth-token')) {
      fetch(`${baseUrl}/addtosave`, {
          method: "POST",
          headers: {
              Accept: "application/json",  
              "auth-token": `${localStorage.getItem('auth-token')}`,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, title, description, urlToImage, url }),  
      })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error saving news:", error)); 
  }
};


//Handle News Delete
  const handleDelete = (id) => {
    console.log(id);
    if(window.prompt("Are you sure want to delete?","Yes") === "Yes"){
      setSavedNews((prev) => prev.filter(articleId => articleId !== id));
      if(localStorage.getItem('auth-token')){
        fetch(`${baseUrl}/removefromsave`,{
          method:"POST",
          headers:{
            Accept:"application/form-data",
            "auth-token":`${localStorage.getItem('auth-token')}`,
            "Content-Type":"application/json",
          },
          body:JSON.stringify({id}),
        }).then((response)=>response.json()).then((data)=>console.log(data))
      }
    }
  };


  //Handle Notes Input
  function handleInput(e) {
    let inputName = e.target.name;
    let inputVal = e.target.value;

    setUserInputs((prev) => ({
      ...prev,
      [inputName]: inputVal
    }));
  }

  //Handle Notes Save
  const handleSubmit = async () => {
    if (userInput.title.trim() !== "" && userInput.notes.trim() !== "") {
      const newNote = {
        ...userInput,
        id: uuidv4(), 
      };
  
      setNotesList((prev) => {
        const updatedNotes = [...prev, newNote];
        localStorage.setItem("notesList", JSON.stringify(updatedNotes));
        return updatedNotes;
      });
      setUserInputs({ id: "", title: "", notes: "" });
      setUniqueId(newNote.id);
  
      if (localStorage.getItem("auth-token")) {
        try {
          const response = await fetch(`${baseUrl}/addtonote`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "auth-token": `${localStorage.getItem("auth-token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ note: newNote }),
          });
          const data = await response.json();
          if (data.error) {
            console.error("Error adding note:", data.error);
          } else {
            console.log("Note added successfully:", data.message);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
  
      closeContactForm();
    }
  };
  
  //Handle Notes Delete
  const handleDeleteNote = async (noteId) => {
    console.log(noteId);
    setNotesList((prev) => {
      const updatedNotes = prev.filter((note) => note.id !== noteId);
      localStorage.setItem("notesList", JSON.stringify(updatedNotes));
      return updatedNotes;
    });
  
    if (localStorage.getItem("auth-token")) {
      try {
        const response = await fetch(`${baseUrl}/deletenote`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": `${localStorage.getItem("auth-token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: noteId }),
        });
        const data = await response.json();
        if (data.error) {
          console.error("Error deleting note:", data.error);
        } else {
          console.log("Note deleted successfully:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };


  function openContactForm() {
    setContactActive(true);
  }

  function closeContactForm() {
    setContactActive(false);
  }

  return (
    <NewsContext.Provider value={{ articles, setArticles, loading, searchQuery, country, handleCountryChange, setSearchQuery, savedNews, handleSave, handleDelete, contactActive, openContactForm, closeContactForm, notesList, setNotesList, handleInput, handleSubmit, userInput, handleDeleteNote }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => useContext(NewsContext);
