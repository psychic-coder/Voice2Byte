"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { restaurants } from "@/data/restaurants";
import { SpeakText } from "./SpeakText";
import { playSound } from "./PlaySound";
import detectLanguage from "./Franc"; 
import {translateToEnglish} from "./LibreText";
import { processUserInput } from "./DeepSeek";

export default function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const [menuSpoken, setMenuSpoken] = useState(false);
  const currentRestaurantRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognitionRef.current = recognition;

    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const toggleListening = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      console.error("Speech recognition not initialized");
      return;
    }

    recognition.onresult = async (event) => {
      const result = event.results[0][0].transcript.toLowerCase();
      setTranscript(result);

      const { isoCode, languageName } = detectLanguage(result);
      console.log("Detected Language:", languageName, `(${isoCode})`);

      try {
        const translatedText = await translateToEnglish({ 
          text: result, 
          sourceLang: isoCode 
        });
        console.log("Translated:", translatedText);
      
        const intent = await processUserInput(translatedText);
        console.log("Detected Intent:", intent);
        
      } catch (error) {
        console.error("Processing failed:", error);
      }

      if (result.includes("show me the restaurants available")) {
        if (pathname === "/") {
          router.push("/restaurants");
        }
      }

      if (result.includes("tell me the list of restaurants available")) {
        if (pathname === "/restaurants") {
          const hotelNames = restaurants.map((r) => r.name).join(", ");
          SpeakText(`Here are the restaurants available: ${hotelNames}`);
        }
      }

      if (result.includes("show me the menu of")) {
        const matched = result.match(/show me the menu of (.+)/);
        if (matched && matched[1]) {
          const spokenName = matched[1].trim().toLowerCase();
          const hotel = restaurants.find(
            (r) => r.name.toLowerCase() === spokenName
          );

          if (hotel) {
            const encodedName = encodeURIComponent(hotel.name);
            router.push(`/restaurant-card?name=${encodedName}`);
          } else {
            SpeakText(`Sorry, I couldn't find a hotel named ${spokenName}`);
          }
        }
      }

      if (result.includes("tell me the menu")) {
        if (pathname.startsWith("/restaurant-card")) {
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
          const nameParam = urlParams.get("name");

          if (nameParam) {
            const restaurantName = decodeURIComponent(nameParam)
              .toLowerCase()
              .replace(/\s/g, "");
            const restaurant = restaurants.find(
              (r) => r.name.toLowerCase().replace(/\s/g, "") === restaurantName
            );

            if (restaurant) {
              currentRestaurantRef.current = restaurant;
              SpeakText(`Here are the menu items for ${restaurant.name}:`);

              restaurant.menu.forEach((item, index) => {
                setTimeout(() => {
                  SpeakText(item.item);
                  if (index === restaurant.menu.length - 1) {
                    setTimeout(() => {
                      setMenuSpoken(true);
                    }, 1000);
                  }
                }, index * 1000);
              });
            } else {
              SpeakText(
                `Sorry, I couldn't find the restaurant in the database.`
              );
            }
          } else {
            SpeakText(`Restaurant name not found in the URL.`);
          }
        } else {
          SpeakText(
            `Please go to the restaurant's page first to hear the menu.`
          );
        }
      }

      if (result.includes("order")) {
        const match = result.match(/order (.+)/);
        const itemName = match?.[1]?.trim().toLowerCase();

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const nameParam = urlParams.get("name");

        if (nameParam) {
          const restaurantName = decodeURIComponent(nameParam)
            .toLowerCase()
            .replace(/\s/g, "");
          const restaurant = restaurants.find(
            (r) => r.name.toLowerCase().replace(/\s/g, "") === restaurantName
          );

          if (restaurant && itemName) {
            const foundItem = restaurant.menu.find(
              (m) => m.item.toLowerCase() === itemName
            );

            if (foundItem) {
              SpeakText(`Your item is ordered.`);
            } else {
              SpeakText(
                `Sorry, ${itemName} is not available in the menu of ${restaurant.name}.`
              );
            }
          } else {
            SpeakText(`Could not find the restaurant or item.`);
          }
        } else {
          SpeakText(`Restaurant name not found in the URL.`);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    if (isListening) {
      recognition.stop();
      playSound("/sounds/stop.mp3");
    } else {
      recognition.start();
      playSound("/sounds/start.mp3");
    }

    setIsListening((prev) => !prev);
  };

  return (
     <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className={`card shadow-lg rounded-3 border-0 ${isListening ? 'border-warning' : ''}`}
               style={{ backgroundColor: '#fff9e6' }}>
            <div className="card-body p-4 text-center">
              <div className="mb-4">
                <i className={`bi bi-mic-fill fs-1 ${isListening ? 'text-warning' : 'text-dark'}`} 
                   style={{ color: isListening ? '#ffc107' : '#ffc107' }}></i>
              </div>
              
              <h3 className="card-title mb-3">
                {isListening ? (
                  <span className="badge bg-warning text-dark px-3 py-2">Listening...</span>
                ) : (
                  <span className="text-dark">Voice Command Interface</span>
                )}
              </h3>
              
              <p className="lead mb-4 text-dark">
                Press <span className="badge bg-warning text-dark">Spacebar</span> to{" "}
                {isListening ? "stop" : "start"} listening
              </p>
              
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="me-2">
                    <i className="bi bi-activity fs-5" style={{ color: '#ffc107' }}></i>
                  </span>
                  <div className="progress w-100" style={{height: '8px'}}>
                    <div 
                      className={`progress-bar ${isListening ? 'progress-bar-striped progress-bar-animated' : ''}`} 
                      role="progressbar" 
                      style={{
                        width: isListening ? '100%' : '0%',
                        backgroundColor: '#ffc107'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="transcript-container p-3 rounded mb-3" 
                   style={{ backgroundColor: '#fff3cd' }}>
                <h6 className="text-start text-dark mb-2">Transcript:</h6>
                <p className={`text-start fs-5 ${transcript ? 'text-dark' : 'text-muted fst-italic'}`}>
                  {transcript || "Waiting for voice input..."}
                </p>
              </div>
              
              <button 
                onClick={toggleListening}
                className={`btn btn-lg ${isListening ? 'btn-outline-warning' : 'btn-warning'} rounded-pill px-4`}
                style={{
                  backgroundColor: isListening ? 'transparent' : '#ffc107',
                  borderColor: '#ffc107',
                  color: isListening ? '#ffc107' : '#212529'
                }}
              >
                {isListening ? (
                  <>
                    <i className="bi bi-stop-circle me-2"></i> Stop Listening
                  </>
                ) : (
                  <>
                    <i className="bi bi-mic me-2"></i> Start Listening
                  </>
                )}
              </button>
              
              <div className="mt-3">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i> Speak clearly after the beep sound
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}