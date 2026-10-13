import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

const SpeechRecognitionHandler = ({ language = 'en', onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    // Set recognition language
    if (language === 'te') {
      recognition.lang = 'te-IN';
    } else if (language === 'hi') {
      recognition.lang = 'hi-IN';
    } else {
      recognition.lang = 'en-IN';
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      if (onTranscript && transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setErrorMsg('Microphone access was denied. Please allow microphone permission in your browser settings.');
      } else if (event.error === 'no-speech') {
        setErrorMsg('No speech was detected. Please press the mic and speak clearly.');
      } else {
        setErrorMsg(`Voice recognition notice: ${event.error}. You can also type your question.`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript]);

  const toggleListening = () => {
    setErrorMsg('');
    if (!isSupported) {
      setErrorMsg('Voice speech recognition is not supported in this browser. Please use the text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-4">
        {isListening && (
          <div className="absolute inset-0 rounded-full bg-teal-400 opacity-75 voice-recording-ring pointer-events-none" />
        )}
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          aria-label={isListening ? "Stop listening" : "Start speaking"}
          className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 ${
            isListening
              ? 'bg-red-600 text-white scale-105 shadow-red-200'
              : 'bg-gradient-to-tr from-gov-navy to-gov-teal text-white hover:scale-105 shadow-teal-100'
          }`}
        >
          {isListening ? (
            <MicOff className="w-10 h-10 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </button>
      </div>

      <div className="space-y-1">
        <p className="text-base font-bold text-slate-800">
          {isListening
            ? 'Listening... Speak clearly now'
            : 'Press Microphone and Speak'}
        </p>
        <p className="text-xs text-slate-500 font-medium">
          Supported: Telugu (తెలుగు), Hindi (हिंदी), and English
        </p>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 max-w-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};

export default SpeechRecognitionHandler;
