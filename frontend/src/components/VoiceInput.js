"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
// import { restaurants } from "@/data/restaurants";
import { SpeakText } from "./SpeakText";
import { playSound } from "./PlaySound";
import {
  addOrder,
  clearOrders,
  deleteOrder,
  updateQuantity,
} from "@/redux/reducers/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { getPageName, pageDescriptions } from "./VoiceComponents/PageName";
import { config } from "@/data/axiosData";
import { playAudioCue } from "@/src/utils/AudioCues";
import { announceToScreenReader } from "@/src/components/AriaAnnouncer";

export default function VoiceInput() {
  const [restaurants, setRestaurants] = useState([]);
  const user = useSelector((state) => state.user.currentUser);
  const { orders, trackingId } = useSelector((state) => state.order);
  const totalPrice =
    orders?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [lastDecision, setLastDecision] = useState(null);
  const [backendStatus, setBackendStatus] = useState("unknown");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [menuSpoken, setMenuSpoken] = useState(false);
  const currentRestaurantRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Socket.IO Integration for Real-Time Order Updates
  useEffect(() => {
    let socket;
    if (trackingId) {
      console.log(`[Socket.IO] Connecting to tracking ID: ${trackingId}`);
      socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000");

      socket.on("connect", () => {
        socket.emit("join_order_room", trackingId);
      });

      socket.on("order:status", (data) => {
        console.log("[Socket.IO] Order Status Update:", data);
        playAudioCue('success');
        SpeakText(data.message);
        announceToScreenReader(data.message);
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [trackingId]);

   useEffect(() => {
     const fetchRestaurants = async () => {
       try {
         setLoading(true);
         const res = await axios.get(
           `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/customer/getAllRestaurants`,
           config
         );

         setRestaurants(res.data.restaurants);
         console.log(restaurants);
         setError(null);
       } catch (err) {
         console.error("Failed to fetch restaurants:", err);
         setError(err.response?.data?.message || err.message);
       } finally {
         setLoading(false);
       }
     };

     fetchRestaurants();
   }, []);


  
   
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleListening();
      }
    };
    const handleDoubleClick = (e) => {
      e.preventDefault();
      toggleListening();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("dblclick", handleDoubleClick);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [isListening]);

  const toggleListening = async () => {
    if (isListening) {
      console.log("Stopping recording...");
      stopRecording();
    } else {
      console.log("Starting recording...");
      await startRecording();
    }
  };

  const startRecording = async () => {
    playSound("/sounds/voice.mp3");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      // Audio analysis for silence detection (VAD)
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const checkSilence = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const average = sum / bufferLength;

        if (average < 15) { // silence threshold
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              console.log("Silence detected, stopping recording...");
              if (isListening) stopRecording();
            }, 2000); // 2 seconds of silence
          }
        } else {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
        }
      };

      const silenceInterval = setInterval(checkSilence, 200);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        clearInterval(silenceInterval);
        playSound("/sounds/voice.mp3");
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await processAudio(audioBlob);

        // Clean up
        cleanupAudioAnalysis();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const cleanupAudioAnalysis = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;

    setIsListening(false);

    try {
      mediaRecorderRef.current.stop();
      cleanupAudioAnalysis();

      const tracks = mediaRecorderRef.current.stream?.getTracks();
      if (tracks) tracks.forEach((track) => track.stop());
    } catch (err) {
      console.warn("Error stopping recorder:", err);
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "user_audio.wav");

      // --- Dynamic context generation ---
      const currentPageName = getPageName(pathname);

      const context = {
        currentPage: currentPageName,
        conversationHistory: conversationHistory,
        restaurants: restaurants.map((r) => r.name),
        menuItems: [],
        cart: [],
        userLocation: user?.location || "",
        totalPrice: totalPrice,
        userSignedIn: !!user,
      };

      if (pathname.startsWith("/restaurant-card")) {
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantId = urlParams.get("id");
        const restaurantName = urlParams.get("name");

        let restaurant;
        if (restaurantId) {
          restaurant = restaurants.find(
            (r) => r.id.toString() === restaurantId
          );
        } else if (restaurantName) {
          restaurant = restaurants.find(
            (r) =>
              r.name.toLowerCase() ===
              decodeURIComponent(restaurantName).toLowerCase()
          );
        }

        if (restaurant) {
          currentRestaurantRef.current = restaurant;
          context.menuItems = restaurant.menu.map((m, index) => ({
            name: `${index + 1}. ${m.item}`,
            price: m.price,
            id: m.id || restaurant.menu.indexOf(m),
          }));
          context.restaurantName = restaurant.name;
          context.restaurantId = restaurant.id;
        }
      }

      if (user && orders?.length > 0) {
        context.cart = orders.map((item) => ({
          itemId: item.itemId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));
      }

      if (user?.role === 'HOTEL_ADMIN') {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/hotelAdmin/me`, config);
          if (res.data.success) {
             context.hotelOrders = res.data.profile.restaurant.recentOrders.map(o => ({
                 id: o.id,
                 status: o.status,
                 total: o.totalAmount,
                 items: o.items.map(i => i.name).join(", ")
             }));
          }
        } catch (e) {
          console.error("Failed to fetch hotel orders for context");
        }
      }

      formData.append("context", JSON.stringify(context));

      console.log("Processing audio with context:", context);

      let response;
      try {
        // Phase 3: Route through Node.js API Gateway instead of Python directly
        response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/voice/analyze`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });
      } catch (axiosError) {
        console.error("Backend communication error:", axiosError);
        
        // Phase 3: Handle Gateway Rate Limiting (429 Too Many Requests)
        if (axiosError.response && axiosError.response.status === 429) {
            setBackendStatus("error");
            playAudioCue('error');
            const rateLimitMsg = "Please slow down, you're sending too many voice requests.";
            SpeakText(rateLimitMsg);
            announceToScreenReader(rateLimitMsg);
            setTranscript(rateLimitMsg);
            return null;
        }

        try {
          console.log("Trying fallback transcription endpoint...");
          response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"}/api/voice/transcribe`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              timeout: 15000,
            }
          );

          const { transcription } = response.data;
          setTranscript(transcription);
          SpeakText(
            `I heard: ${transcription}. But I couldn't process the command.`
          );
          return { transcription, decision: null };
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
          setBackendStatus("error");
          playAudioCue('error');
          const errorMsg =
            "Sorry, I couldn't process your voice command. Please check if the backend is running.";
          SpeakText(errorMsg);
          announceToScreenReader(errorMsg);
          setTranscript(errorMsg);
          return null;
        }
      }

      const { transcription, decision } = response.data;
      setTranscript(transcription);

      console.log("Transcription:", transcription);
      console.log("Ollama Decision:", decision);

      if (decision) {
        setLastDecision(decision);
        setBackendStatus("success");
        handleIntent(decision);
      } else {
        setBackendStatus("no-decision");
        playAudioCue('error');
        SpeakText(
          `I heard: ${transcription}. But I couldn't understand the command.`
        );
      }

      return { transcription, decision };
    } catch (error) {
      console.error("Unexpected error processing audio:", error);
      playAudioCue('error');
      const errorMsg =
        "An unexpected error occurred while processing your voice.";
      SpeakText(errorMsg);
      announceToScreenReader(errorMsg);
      setTranscript(errorMsg);
      return null;
    }
  };

  const handleIntent = async (decision) => {
    if (!decision || !decision.action) return;

    const action = decision.action;
    const reply = decision.reply || "";
    
    if (reply) {
      SpeakText(reply);
      announceToScreenReader(reply);
    }
    
    setConversationHistory(prev => {
        const newHistory = [...prev, { user: transcript, ai: reply }];
        return newHistory.slice(-5);
    });

    switch (action) {
      case "sayPage":
        // LLM reply already spoken
        break;

      case "goTo":
        if (decision.page) {
          router.push(`/${decision.page}`);
        }
        break;

      case "readRestaurants":
        const isOnRestaurantsPage = pathname === "/restaurants";
        if (!isOnRestaurantsPage) {
          router.push("/restaurants");
        }
        break;

      case "showMenu":
        if (decision.restaurant) {
          const encodedName = encodeURIComponent(decision.restaurant);
          if (!pathname.startsWith("/restaurant-card"))
            router.push(`/restaurant-card?name=${encodedName}`);
        }
        break;

      case "addToCart":
        if (decision.items?.length && currentRestaurantRef.current) {
          const restaurant = currentRestaurantRef.current;
          const itemsToAdd = decision.items.map((item) => {
            // Find the menu item from current restaurant
            const menuItem = restaurant.menu.find(
              (m) =>
                m.item.toLowerCase().includes(item.name.toLowerCase()) ||
                item.name.toLowerCase().includes(m.item.toLowerCase())
            );

            return {
              itemId: menuItem?.id || `${restaurant.id}-${item.name}`,
              name: menuItem?.item || item.name,
              quantity: item.quantity || 1,
              price: menuItem?.price || 0,
              restaurantId: restaurant.id,
            };
          });

          itemsToAdd.forEach((item) => dispatch(addOrder([item])));
          playAudioCue('success');
        }
        break;

      case "updateCartQuantity":
        if (decision.itemId && decision.quantity != null) {
          dispatch(
            updateQuantity({
              itemId: decision.itemId,
              quantity: decision.quantity,
            })
          );
        }
        break;

      case "readCart":
        break;

      case "removeFromCart":
        if (decision.itemId) {
          dispatch(deleteOrder(decision.itemId));
          playAudioCue('success');
        }
        break;

      case "checkout":
        router.push("/checkout");
        break;

      case "clearCart":
        dispatch(clearOrders());
        break;

      case "readOrders":
        // LLM reply is already spoken
        break;

      case "updateOrderStatus":
        if (decision.orderId && decision.status) {
           try {
             await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/hotelAdmin/${decision.orderId}/confirmOrder/${decision.status.toUpperCase()}`, config);
             window.dispatchEvent(new Event('refreshOrders'));
             playAudioCue('success');
           } catch(e) {
             playAudioCue('error');
             SpeakText("Failed to update order status.");
           }
        }
        break;

      case "greet":
      case "goodbye":
      case "help":
      case "unknown":
        break;

      default:
        console.warn("Unknown action:", action);
        break;
    }
  };

    

  return (
    <div className="container my-5 w-100">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6  w-100">
          <div
            className={`card shadow-lg rounded-3 border-0 ${
              isListening ? "border-warning" : ""
            }`}
            style={{ backgroundColor: "#fff9e6" }}
          >
            <div className="card-body p-4 text-center">
              <div className="mb-4">
                <i
                  className={`bi bi-mic-fill fs-1 ${
                    isListening ? "text-warning" : "text-dark"
                  }`}
                  style={{ color: isListening ? "#ffc107" : "#ffc107" }}
                ></i>
              </div>

              <h3 className="card-title mb-3">
                {isListening ? (
                  <span className="badge bg-warning text-dark px-3 py-2">
                    Listening...
                  </span>
                ) : (
                  <span className="text-dark">Voice Command Interface</span>
                )}
              </h3>

              <p className="lead mb-4 text-dark">
                Press{" "}
                <span className="badge bg-warning text-dark">Spacebar</span> to{" "}
                {isListening ? "stop" : "start"} listening
              </p>

              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-center">
                  <span className="me-2">
                    <i
                      className="bi bi-activity fs-5"
                      style={{ color: "#ffc107" }}
                    ></i>
                  </span>
                  <div className="progress w-100" style={{ height: "8px" }}>
                    <div
                      className={`progress-bar ${
                        isListening
                          ? "progress-bar-striped progress-bar-animated"
                          : ""
                      }`}
                      role="progressbar"
                      style={{
                        width: isListening ? "100%" : "0%",
                        backgroundColor: "#ffc107",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className="transcript-container p-3 rounded mb-3"
                style={{ backgroundColor: "#fff3cd" }}
              >
                <h6 className="text-start text-dark mb-2">Transcript:</h6>
                <p
                  className={`text-start fs-5 ${
                    transcript ? "text-dark" : "text-muted fst-italic"
                  }`}
                >
                  {transcript || "Waiting for voice input..."}
                </p>
              </div>

              <button
                onClick={toggleListening}
                className={`btn btn-lg ${
                  isListening ? "btn-outline-warning" : "btn-warning"
                } rounded-pill px-4`}
                style={{
                  backgroundColor: isListening ? "transparent" : "#ffc107",
                  borderColor: "#ffc107",
                  color: isListening ? "#ffc107" : "#212529",
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
                  <i className="bi bi-info-circle me-1"></i> Speak clearly after
                  the beep sound
                </small>
              </div>
            </div>
          </div>

          {/* Debug Panel */}
          {process.env.NODE_ENV === "development" && (
            <div
              className="card mt-3 border-0"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div className="card-body p-3">
                <h6 className="card-title text-muted mb-2">
                  <i className="bi bi-bug me-2"></i>Debug Info
                </h6>
                <div className="row text-start">
                  <div className="col-md-6">
                    <small className="text-muted d-block">
                      Backend Status:
                    </small>
                    <span
                      className={`badge ${
                        backendStatus === "success"
                          ? "bg-success"
                          : backendStatus === "error"
                          ? "bg-danger"
                          : backendStatus === "no-decision"
                          ? "bg-warning"
                          : "bg-secondary"
                      }`}
                    >
                      {backendStatus}
                    </span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-muted d-block">Current Page:</small>
                    <code>{pathname || "/"}</code>
                  </div>
                </div>
                {lastDecision && (
                  <div className="mt-2">
                    <small className="text-muted d-block">Last Decision:</small>
                    <pre className="text-sm" style={{ fontSize: "0.75rem" }}>
                      {JSON.stringify(lastDecision, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
