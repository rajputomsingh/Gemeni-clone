import React, { useContext, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { Context } from "../../Context/Context";
import "./Main.css";

const Main = () => {
  const {
    input,
    setInput,
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
  } = useContext(Context);

  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [listening, setListening] = useState(false);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; // Set language; adjust as needed
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && input) {
      onSent();
    }
  };

  const handleGalleryClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file.");
    }
  };

  const handleMicClick = () => {
    if (recognition) {
      if (!listening) {
        recognition.start();
        setListening(true);
      } else {
        recognition.stop();
        setListening(false);
      }
    } else {
      alert("Speech Recognition API not supported in this browser.");
    }
  };

  if (recognition) {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prevInput) => prevInput + " " + transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }

  return (
    <div className="main">
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="UserIcon" />
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Om singh,</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div className="card" onClick={() => setInput("Suggest beautiful places to see on upcoming road trip")}>
                <p>Suggest beautiful places to see on upcoming road trip</p>
                <img src={assets.compass_icon} alt="CompassIcon" />
              </div>
              <div className="card" onClick={() => setInput("Briefly summarize this concept: urban planning")}>
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="CompassIcon" />
              </div>
              <div className="card" onClick={() => setInput("Brainstorm team bonding activities for our work retreat")}>
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="CompassIcon" />
              </div>
              <div className="card" onClick={() => setInput("Tell me about React js and React native")}>
                <p>Tell me about React js and React native</p>
                <img src={assets.code_icon} alt="CompassIcon" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user_icon} alt="UserIcon" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="GeminiIcon" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div>{resultData}</div>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Selected file preview" />
            </div>
          )}

          <div className="search-box">
            <input
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div className="search-box-icon">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <img src={assets.gallery_icon} alt="GalleryIcon" onClick={handleGalleryClick} />
              <img
                src={assets.mic_icon}
                alt="MicIcon"
                onClick={handleMicClick}
                style={{ color: listening ? "red" : "inherit" }}
              />
              {input && (
                <img
                  onClick={onSent}
                  src={assets.send_icon}
                  alt="SendIcon"
                />
              )}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its responses.{" "}
            <a href="https://support.google.com/gemini/answer/13594961?visit_id=638488069169109558-2959892032&p=privacy_notice&rd=1#privacy_notice">
              Your privacy & Gemini Apps
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
