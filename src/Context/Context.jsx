import React, { createContext, useState, useEffect } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState([]);
  const [displayedResult, setDisplayedResult] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);

  const delayPara = (index,nextword) =>{
     setTimeout(function (){
    setInputData(prev=>prev+nextword);

    },75*index)
  }

  useEffect(() => {
    if (showResult && typingIndex < resultData.length) {
      const timer = setTimeout(() => {
        setDisplayedResult((prev) => [...prev, resultData[typingIndex]]);
        setTypingIndex((prev) => prev + 1);
      }, 10); // Typing effect with a delay of 10ms for readability

      return () => clearTimeout(timer);
    }
  }, [showResult, typingIndex, resultData]);

  const onSent = async () => {
    setLoading(true);
    setShowResult(false); // Reset display state for new input
    setDisplayedResult([]); // Clear previous displayed result
    setTypingIndex(0); // Reset typing index

    try {
      // Determine the current prompt: prioritize `input`, fallback to `recentPrompt`
      const prompt = input || recentPrompt;
      const response = await runChat(prompt); // Fetch response from API

      // Process the response into formatted data
      const responseArray = response.split("**");
      const formattedResponse = responseArray.flatMap((text, i) => {
        const parts = text.split("*");
        return parts.flatMap((part, index) => {
          const words = part.split(" ");
          const formattedWords = words.map((word, wordIndex) =>
            i % 2 === 1
              ? <span key={`${i}-${index}-${wordIndex}`} style={{ fontWeight: "bold", backgroundColor: "white", color: "black" }}>{word + " "}</span>
              : word + " "
          );
          
          if (index < parts.length - 1) {
            return [...formattedWords, <br key={`br-${i}-${index}`} />, <span key={`spacer-${i}-${index}`} style={{ display: "block", marginTop: "10px" }} />];
          }
          return formattedWords;
        });
      });

      // Update state with new data
      setResultData(formattedResponse);
      setShowResult(true);

      // Update prompt history and recent prompt
      setPrevPrompt((prev) => [...prev, prompt]);
      setRecentPrompt(prompt);

      // Clear the input field
      setInput("");
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  const contextValue = {
    prevPrompt,
    setPrevPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData: displayedResult,
    input,
    setInput,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
