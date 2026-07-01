export function SpeakText(message) {
    if (typeof window === 'undefined') return;
  
    window.speechSynthesis.cancel(); // Interrupt any ongoing speech
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
}
  