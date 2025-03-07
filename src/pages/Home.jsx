import React, { useEffect, useRef, useState } from "react";
import CriminalInfoContainer from "../components/CriminalInfoContainer";
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { Backdrop, CircularProgress } from "@mui/material";

const Home = () => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useOutletContext();
  useEffect(() => {
    if (!isLogin) {
      navigate("/");
    }
  }, []);
  useEffect(()=>{
    if(!input.length){
      setTableData(null)
    }
  },[input])
  useEffect(() => {
    // Check if the browser supports the Web Speech API
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Browser does not support speech recognition.");
    } else {
      // Create a new instance of the Web Speech API
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Enable continuous listening
      recognitionRef.current.interimResults = false; // Final results only
      recognitionRef.current.lang = language; // Set initial language

      // Event listener for speech recognition results
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setInput(transcript);
      };

      // Error handling
      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      // Stop recognition when the user stops speaking
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const toggleListening = (event) => {
    event.preventDefault();
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = language; // Update language before starting
      recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios
      .post(
        "https://fuzzy-search-backend.vercel.app/api/v1/search",
        { name: input },
        { withCredentials: true }
      )
      .then((res) => res.data)
      .catch((e) => {
        console.log(e);
        setLoading(false);
  });
  
    const transformedData = res.map((item) => item.criminal_data);
    setTableData(transformedData);
    setLoading(false);
  };

  return (
    <>
      <div className=" py-10 text-white section-container flex gap-6 flex-col items-center">
        <form
          action=""
          method="post"
          className="min-[870px]:w-[80%] bg-white text-black flex justify-between items-center px-4 py-2 rounded-full"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-8 min-[660px]:grow">
            <select
              name="lang"
              className=" outline-none min-[660px]:w-48 grow-0"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en-US">English</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="hi-IN">Hindi</option>
            </select>
            <input
              type="text"
              placeholder="Enter Search.."
              name="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="outline-none min-[660px]:grow "
            />
          </div>
          <div className="flex gap-4 items-center">
            <button className="bg-gray-200 rounded-full p-2">
              <i
                className="fa-solid fa-microphone-lines text-xl w-10"
                onClick={toggleListening}
              ></i>
            </button>
            <button
              type="submit"
              className="bg-blue-600 px-1 py-3 min-[660px]:px-6 text-white rounded-full"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      <div>
        <CriminalInfoContainer tableData={tableData} />
      </div>
    </>
  );
};

export default Home;
