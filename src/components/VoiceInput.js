"use client";
import React, { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { restaurants } from "@/data/restaurants";
import { SpeakText } from "./SpeakText";
import { playSound } from "./PlaySound";
import {
  addOrder,
  clearOrders,
  deleteOrder,
  updateQuantity,
} from "@/redux/reducers/orderSlice";
import { useDispatch, useSelector } from "react-redux";

export default function VoiceInput() {
  const user = useSelector((state) => state.user.currentUser);
  const orders = useSelector((state) => state.order.orders);
  const totalPrice =
    orders?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
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

  const getPageName = (path) => {
    if (!path || path === "/") return "home";
    if (path.startsWith("/restaurant-card")) return "restaurantDetails";
    if (path.startsWith("/restaurants")) return "restaurants";
    if (path.startsWith("/cart")) return "cart";
    if (path.startsWith("/search")) return "search";
    if (path.startsWith("/about")) return "about";
    if (path.startsWith("/contacts")) return "contacts";
    if (path.startsWith("/checkout")) return "checkout";
    if (path.startsWith("/profile")) return "profile";
    if (path.startsWith("/login")) return "login";
    if (path.startsWith("/signup")) return "signup";
    return path.replace("/", "") || "home";
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

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

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
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
          context.menuItems = restaurant.menu.map((m) => ({
            name: m.item,
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

      formData.append("context", JSON.stringify(context));

      console.log("Processing audio with context:", context);

      let response;
      try {
        response = await axios.post("http://localhost:5000/analyze", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        });
      } catch (axiosError) {
        console.error("Backend communication error:", axiosError);

        try {
          console.log("Trying fallback transcription endpoint...");
          response = await axios.post(
            "http://localhost:5000/transcribe",
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
          const errorMsg =
            "Sorry, I couldn't process your voice command. Please check if the backend is running.";
          SpeakText(errorMsg);
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
        SpeakText(
          `I heard: ${transcription}. But I couldn't understand the command.`
        );
      }

      return { transcription, decision };
    } catch (error) {
      console.error("Unexpected error processing audio:", error);
      const errorMsg =
        "An unexpected error occurred while processing your voice.";
      SpeakText(errorMsg);
      setTranscript(errorMsg);
      return null;
    }
  };

  const handleIntent = (decision) => {
    if (!decision || !decision.action) return;

    const action = decision.action;
    //  const reply = decision.reply || "";
    //  SpeakText(reply);

    switch (action) {
      case "sayPage":
        const currentPageName = getPageName(pathname);
        const pageDescriptions = {
          home: "home page",
          search: "search page",
          about: "about",
          contacts: "contacts",
          restaurants: "restaurants listing page",
          restaurantDetails: "restaurant details page",
          cart: "shopping cart page",
          checkout: "checkout page",
          profile: "profile page",
          login: "login page",
          signup: "signup page",
        };
        const pageDescription =
          pageDescriptions[currentPageName] || `${currentPageName} page`;
        SpeakText(`You are currently on the ${pageDescription}.`);
        break;

      case "goTo":
        if (decision.page) {
          router.push(`/${decision.page}`);
          SpeakText(`Navigating to ${decision.page} page.`);
        }
        break;

      case "readRestaurants":
        if (decision.restaurants?.length) {
          const list = decision.restaurants.join(", ");
          SpeakText(`Nearby restaurants: ${list}`);
        }
        break;

      case "showMenu":
        if (decision.restaurant) {
          const encodedName = encodeURIComponent(decision.restaurant);
          if (!pathname.startsWith("/restaurant-card"))
            router.push(`/restaurant-card?name=${encodedName}`);
          if (decision.menuItems?.length) {
            SpeakText(`Menu for ${decision.restaurant}:`);
            decision.menuItems.forEach((item, idx) =>
              setTimeout(() => SpeakText(item), idx * 1000)
            );
          }
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
          const totalAdded = itemsToAdd.length;
          const itemNames = itemsToAdd
            .map((item) => `${item.quantity} ${item.name}`)
            .join(", ");
          SpeakText(`Added ${itemNames} to your cart.`);
        } else if (decision.items?.length) {
          SpeakText(
            "Please navigate to a restaurant page first to add items to your cart."
          );
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
          SpeakText(
            `Updated ${decision.itemName} quantity to ${decision.quantity}.`
          );
        }
        break;

      case "readCart":
        if (orders?.length) {
          const items = orders.map((i) => `${i.quantity} ${i.name}`).join(", ");
          const totalPrice = orders.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          );
          SpeakText(`Your cart has: ${items}. Total: ${totalPrice}`);
        } else SpeakText("Your cart is empty.");
        break;

      case "removeFromCart":
        if (decision.itemId) {
          dispatch(deleteOrder(decision.itemId));
          SpeakText(`Removed ${decision.itemName} from cart.`);
        }
        break;

      case "checkout":
        router.push("/checkout");
        const total = orders.reduce((acc, i) => acc + i.price * i.quantity, 0);
        SpeakText(`Proceeding to checkout. Total: ${total}`);
        break;

      case "clearCart":
        dispatch(clearOrders());
        SpeakText("Cart cleared.");
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
