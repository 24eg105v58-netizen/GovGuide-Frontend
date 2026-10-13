import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '../services/voiceService';
import SpeechRecognitionHandler from '../components/voice/SpeechRecognitionHandler';
import TextToSpeechPlayer from '../components/voice/TextToSpeechPlayer';
import SchemeCard from '../components/schemes/SchemeCard';
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Loader2,
  Globe,
} from 'lucide-react';

const VoiceAssistantPage = () => {
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState('te'); // default to Telugu or English
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      display: 'నమస్కారం! నేను మీ గోవ్‌గైడ్ వాయిస్ అసిస్టెంట్. రైతులు, విద్యార్థులు, ఆరోగ్యం లేదా ఇతర పథకాల గురించి అడగండి.',
      spoken: 'నమస్కారం! నేను మీ గోవ్‌గైడ్ వాయిస్ అసిస్టెంట్. పథకాల గురించి తెలుసుకోవడానికి మైక్రోఫోన్ నొక్కి మాట్లాడండి.',
      schemes: [],
      followUps: ['రైతులకు ఏ పథకాలు ఉన్నాయి?', 'ఆరోగ్య పథకాలు ఏమిటి?', 'ఏ పత్రాలు కావాలి?'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // When language switches, give appropriate localized greeting
  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    let greetingDisplay = '';
    let greetingSpoken = '';
    let followUps = [];

    if (lang === 'te') {
      greetingDisplay = 'నమస్కారం! నేను మీ గోవ్‌గైడ్ వాయిస్ అసిస్టెంట్. రైతులు, విద్యార్థులు, ఆరోగ్యం లేదా ఇతర పథకాల గురించి అడగండి.';
      greetingSpoken = 'నమస్కారం! పథకాల సమాచారం కోసం మైక్రోఫోన్ నొక్కి మాట్లాడండి.';
      followUps = ['రైతులకు ఏ పథకాలు ఉన్నాయి?', 'ఆరోగ్య పథకాలు ఏమిటి?', 'ఏ పత్రాలు కావాలి?'];
    } else if (lang === 'hi') {
      greetingDisplay = 'नमस्ते! मैं आपका गवगाइड वॉइस असिस्टेंट हूँ। किसानों, छात्रों, स्वास्थ्य या आवास योजनाओं के बारे में बोलकर पूछें।';
      greetingSpoken = 'नमस्ते! सरकारी योजनाओं के बारे में पूछने के लिए माइक दबाकर बोलें।';
      followUps = ['किसानों के लिए कौन सी योजनाएँ हैं?', 'स्वास्थ्य योजनाएं क्या हैं?', 'कौन से दस्तावेज़ चाहिए?'];
    } else {
      greetingDisplay = 'Hello! I am your GovGuide Voice Assistant. Ask me aloud about schemes for farmers, healthcare, housing, or scholarships.';
      greetingSpoken = 'Hello! Press the microphone button to ask about government schemes.';
      followUps = ['Show me schemes for farmers', 'What healthcare schemes are available?', 'What documents are required?'];
    }

    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        display: greetingDisplay,
        spoken: greetingSpoken,
        schemes: [],
        followUps,
      },
    ]);
  };

  const handleSendQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      display: queryText,
      spoken: '',
      schemes: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await voiceService.processVoiceQuery(queryText, selectedLanguage);

      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        display: response.displayResponse,
        spoken: response.spokenResponse,
        schemes: response.matchedSchemes || [],
        followUps: response.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        display: 'క్షమించండి, సమాచారం పొందడంలో సమస్య ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి. / An error occurred, please try again.',
        spoken: 'Please try again.',
        schemes: [],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      {/* Title & Language Selector */}
      <div className="card-gov p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md bg-gradient-to-r from-teal-50 to-slate-50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-2">
            <Mic className="w-3.5 h-3.5" /> Accessibility Voice Assistant
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('voice.title')}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-lg">
            {t('voice.subtitle')}
          </p>
        </div>

        {/* Spoken Language Picker */}
        <div className="shrink-0 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {t('voice.selectSpokenLang')}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLanguageChange('te')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLanguage === 'te'
                  ? 'bg-gov-teal text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              తెలుగు (Telugu)
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLanguage === 'hi'
                  ? 'bg-gov-teal text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLanguage === 'en'
                  ? 'bg-gov-teal text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Microphone Voice Trigger */}
      <div className="card-gov p-6 bg-white shadow-md">
        <SpeechRecognitionHandler
          language={selectedLanguage}
          onTranscript={(text) => handleSendQuery(text)}
          isProcessing={loading}
        />
      </div>

      {/* Chat Display Box */}
      <div className="card-gov p-6 sm:p-8 space-y-6 shadow-md min-h-[400px] flex flex-col justify-between">
        {/* Messages Feed */}
        <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-6 h-6" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-5 space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-gov-blue text-white shadow-sm'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                    {msg.sender === 'user' ? 'You Asked' : 'GovGuide Assistant'}
                  </span>

                  {msg.spoken && (
                    <TextToSpeechPlayer
                      text={msg.spoken}
                      language={selectedLanguage}
                      autoPlay={msg.sender === 'bot' && msg.id === messages[messages.length - 1]?.id}
                    />
                  )}
                </div>

                <div className="text-sm sm:text-base whitespace-pre-line leading-relaxed font-medium">
                  {msg.display}
                </div>

                {/* Matched Schemes Cards Inside Assistant Response */}
                {msg.schemes && msg.schemes.length > 0 && (
                  <div className="pt-3 space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Recommended Schemes:
                    </span>
                    <div className="grid grid-cols-1 gap-3">
                      {msg.schemes.map((s) => (
                        <div key={s.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-base">
                              {s.schemeName}
                            </h4>
                            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-teal-50 text-teal-800 shrink-0">
                              {s.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {s.benefits}
                          </p>
                          <div className="flex items-center gap-3 pt-2">
                            <a
                              href={`/user/schemes/${s.id}`}
                              className="text-xs font-bold text-gov-teal hover:underline"
                            >
                              View Details →
                            </a>
                            {s.officialUrl && (
                              <a
                                href={s.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
                              >
                                Official Portal <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow up suggestion pills */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {msg.followUps.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendQuery(q)}
                        className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-semibold border border-teal-200 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-10 h-10 rounded-2xl bg-gov-navy text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-500 text-sm p-4 bg-slate-50 rounded-2xl w-fit">
              <Loader2 className="w-5 h-5 animate-spin text-gov-teal" />
              <span>Searching verified government schemes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Fallback Bar */}
        <div className="pt-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('voice.typeAlternative')}
              className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gov-teal focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-5 py-3.5 bg-gov-teal hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs text-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              <span>{t('voice.sendBtn')}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantPage;


