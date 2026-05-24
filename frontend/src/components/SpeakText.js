export function SpeakText(message) {
    if (typeof window === 'undefined') return;
  
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  }
  