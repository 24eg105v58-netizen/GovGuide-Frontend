
import { useEffect, useState } from 'react'
import './VoiceTools.css'

const LANGUAGE_CODES = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
}

export default function VoiceTools({
  onTranscript,
  speakText = '',
  placeholder = 'Speak here',
  language = 'en',
}) {
  const speechLanguage = LANGUAGE_CODES[language] || 'en-IN'

  const [listening, setListening] = useState(false)
  const [message, setMessage] = useState('')
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    const available =
      typeof window !== 'undefined' &&
      !!(window.SpeechRecognition || window.webkitSpeechRecognition)

    setSupported(available)
  }, [])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMessage('Voice input is not supported in this browser. Please type your answer.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = speechLanguage
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setMessage('Listening... Please speak now.')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      onTranscript?.(transcript)
      setMessage(`Recognized: ${transcript}`)
    }

    recognition.onerror = (event) => {
      setMessage(
        event.error === 'not-allowed'
          ? 'Microphone permission was denied. Allow microphone access in your browser settings.'
          : `Voice input failed (${event.error}). Please try again or type your answer.`
      )
    }

    recognition.onend = () => setListening(false)

    try {
      recognition.start()
    } catch {
      setListening(false)
      setMessage('Could not start the microphone. Please try again.')
    }
  }

  function stopListening() {
    setListening(false)
    setMessage('You can try speaking again.')
  }

  function speak() {
    if (!('speechSynthesis' in window)) {
      setMessage('Read-aloud is not supported in this browser.')
      return
    }

    const text = String(speakText || '').trim()

    if (!text) {
      setMessage('There is no text available to read aloud yet.')
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = speechLanguage
    utterance.rate = 0.9

    utterance.onstart = () => setMessage('Reading aloud...')
    utterance.onend = () => setMessage('Finished reading.')
    utterance.onerror = () => setMessage('Read-aloud could not be completed.')

    window.speechSynthesis.speak(utterance)
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setMessage('Read-aloud stopped.')
    }
  }

  return (
    <section className="voice-tools" aria-label="Voice accessibility">
      <div className="voice-tools-heading">
        <span aria-hidden="true">🎙️</span>
        <div>
          <strong>Voice accessibility</strong>
          <p>Speak or listen in your preferred website language.</p>
        </div>
      </div>

      <div className="voice-actions">
        <button
          type="button"
          className="voice-button voice-mic-button"
          onClick={startListening}
          disabled={listening || !supported}
          title={placeholder}
        >
          🎤 {listening ? 'Listening...' : 'Speak'}
        </button>

        <button
          type="button"
          className="voice-button"
          onClick={speak}
          disabled={!String(speakText || '').trim()}
        >
          🔊 Read aloud
        </button>

        {listening && (
          <button
            type="button"
            className="voice-button voice-stop-button"
            onClick={stopListening}
          >
            Stop
          </button>
        )}

        <button
          type="button"
          className="voice-button voice-stop-button"
          onClick={stopSpeaking}
        >
          Stop reading
        </button>
      </div>

      <p className="voice-status" role="status" aria-live="polite">
        {!supported
          ? 'Speech recognition is unavailable in this browser. Read-aloud may still work.'
          : message}
      </p>
    </section>
  )
}