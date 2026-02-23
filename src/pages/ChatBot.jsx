import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GoogleGenAI } from "@google/genai";

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreQuestions, setShowMoreQuestions] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t('chatbot.welcomeMessage', "Hey there! I'm JanBot, your civic assistant. I can help you report issues, track your complaints, and answer questions about our platform. What would you like to know?"),
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState('checking');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Initialize Google GenAI with API key
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  // Available models - using the correct ones from your example
  const AVAILABLE_MODELS = [
    "gemini-2.0-flash",        // Stable free model ✅
    "gemini-2.0-pro",          // More powerful
    "gemini-3-flash-preview",  // New preview model
  ];

  // Enhanced FAQ data with multilingual support
  const faqData = [
    {
      question: t('chatbot.faq.report.question', 'how to report|report issue|create report|submit issue'),
      answer: t('chatbot.faq.report.answer', 'To report an issue: 1) Click the "Raise a Complaint" card on your dashboard, 2) Select the issue type, 3) Add a photo if possible, 4) Provide details and location, 5) Submit. You can then track its status in your dashboard!')
    },
    {
      question: t('chatbot.faq.types.question', 'what can I report|types of issues|what issues|problems to report'),
      answer: t('chatbot.faq.types.answer', 'You can report various civic issues like potholes, broken streetlights, garbage problems, water leaks, damaged public property, illegal parking, drainage issues, stray animals, and more. If you\'re unsure, just report it and we\'ll route it to the right department!')
    },
    {
      question: t('chatbot.faq.track.question', 'track my report|check status|report status|where is my complaint'),
      answer: t('chatbot.faq.track.answer', 'You can track your reports in the "My Reports" section. Each report shows its current status with timestamps. You\'ll also get notifications when the status changes. Want me to help you find your recent reports?')
    },
    {
      question: t('chatbot.faq.status.question', 'status meanings|what does status mean|submitted|under review|in progress'),
      answer: t('chatbot.faq.status.answer', 'Here\'s what each status means: • Submitted: We\'ve received your report • Under Review: Our team is assessing it • In Progress: Work has started • Resolved: Issue is fixed • Closed: Report is completed. You can see these on the interactive timeline for each report.')
    },
    {
      question: t('chatbot.faq.edit.question', 'edit my report|change report|update report|modify complaint'),
      answer: t('chatbot.faq.edit.answer', 'You can edit a report only if it\'s still in "Submitted" status. Once it moves to "Under Review" or further, you can\'t edit it but can add comments to provide additional information. Need to update a report?')
    },
    {
      question: t('chatbot.faq.time.question', 'response time|how long|when fixed|time to resolve'),
      answer: t('chatbot.faq.time.answer', 'Response times vary: • Critical issues: 24-48 hours • Standard issues: 3-5 days • Complex issues: 1-2 weeks. You can check average resolution times in the Analytics section. Urgent matters are prioritized!')
    },
    {
      question: t('chatbot.faq.delay.question', 'no update|no progress|stuck|why taking so long|delayed'),
      answer: t('chatbot.faq.delay.answer', 'If your report hasn\'t been updated, it could be because: 1) The department is experiencing high volume 2) Additional resources are needed 3) Weather conditions are delaying work 4) The issue is complex and requires more time. You can add a comment to your report to request an update, and our team will follow up.')
    },
    {
      question: t('chatbot.faq.escalate.question', 'escalate|talk to supervisor|manager|not satisfied'),
      answer: t('chatbot.faq.escalate.answer', 'If you\'re not satisfied with the progress, you can request escalation by adding a comment to your report with "Request escalation" and our team leads will review it. For urgent matters, you can also contact support@janconnect.com directly.')
    },
    {
      question: t('chatbot.faq.duplicate.question', 'multiple reports|duplicate|same issue'),
      answer: t('chatbot.faq.duplicate.answer', 'If you see multiple reports for the same issue, don\'t worry! Our system groups nearby reports together so departments can prioritize areas with multiple complaints. You can still report it as additional reports help demonstrate the severity of the problem.')
    },
    {
      question: t('chatbot.faq.delete.question', 'withdraw|delete|remove|cancel my report'),
      answer: t('chatbot.faq.delete.answer', 'You can request to withdraw a report if it\'s still in "Submitted" status. For reports that are already being processed, please add a comment explaining why you want to withdraw it, and our team will update the status accordingly.')
    },
    {
      question: t('chatbot.faq.greeting.question', 'hello|hi|hey|greetings|what\'s up'),
      answer: t('chatbot.faq.greeting.answer', 'Hello! 👋 I\'m JanBot, your civic assistant. I can help you report issues, track complaints, and answer questions about our platform. What would you like to know today?')
    },
    {
      question: t('chatbot.faq.thanks.question', 'thank|thanks|appreciate|thank you'),
      answer: t('chatbot.faq.thanks.answer', "You're welcome! 😊 Happy to help. Is there anything else you'd like to know about reporting issues or tracking complaints?")
    },
    {
      question: t('chatbot.faq.priority.question', 'priority|urgent|emergency|important issue'),
      answer: t('chatbot.faq.priority.answer', 'For urgent safety issues (like downed power lines, major road hazards), please call emergency services first. In the app, mark these as "High" priority when reporting. These get expedited review and response.')
    },
    {
      question: t('chatbot.faq.photo.question', 'photo|picture|image|add photo'),
      answer: t('chatbot.faq.photo.answer', 'Adding photos is highly recommended! 📸 It helps our teams understand the issue better. You can upload images directly when creating a report. Good photos show the scale, location, and severity of the problem.')
    },
    {
      question: t('chatbot.faq.location.question', 'location|map|where|pin location'),
      answer: t('chatbot.faq.location.answer', 'The app will automatically detect your location when you report an issue, but you can also manually adjust the pin on the map to ensure accuracy. Precise location helps our teams find the problem quickly!')
    },
    {
      question: t('chatbot.faq.department.question', 'department|who fixes|which department|public works'),
      answer: t('chatbot.faq.department.answer', 'Reports are automatically routed: • Potholes → Public Works • Broken streetlights → Energy Department • Garbage issues → Sanitation • Water leaks → Water Authority • Illegal parking → Traffic Police')
    },
    {
      question: t('chatbot.faq.privacy.question', 'privacy|data|information|my data'),
      answer: t('chatbot.faq.privacy.answer', 'Your personal information is kept confidential. Only necessary details (issue location and description) are shared with departments to resolve the problem. We never share your contact information publicly. Read our Privacy Policy in your account settings.')
    },
    {
      question: t('chatbot.faq.notifications.question', 'notifications|alerts|updates|notify me'),
      answer: t('chatbot.faq.notifications.answer', 'You\'ll receive notifications when: • Your report status changes • Officials add comments • The issue is resolved • Similar issues are reported nearby. Manage preferences in your account settings.')
    },
    {
      question: t('chatbot.faq.community.question', 'community|others|neighbors|nearby issues'),
      answer: t('chatbot.faq.community.answer', 'You can see issues reported by others on the interactive map. This helps avoid duplicates and shows what problems are being addressed in your area. Community reporting makes our neighborhoods better!')
    },
    {
      question: t('chatbot.faq.support.question', 'help|support|contact|customer service'),
      answer: t('chatbot.faq.support.answer', 'For additional help: • Email: support@janconnect.com • Phone: 1-800-JAN-HELP (M-F, 8am-6pm) • In-app: Help section in your profile. Our team responds within 24 hours!')
    },
    {
      question: t('chatbot.faq.features.question', 'features|what can I do|capabilities|how it works'),
      answer: t('chatbot.faq.features.answer', 'With JanConnect, you can: • Report civic issues • Track resolution status • View community reports • See analytics • Receive notifications • Earn community points • Make your neighborhood better! 🏙️')
    },
    {
      question: t('chatbot.faq.about.question', 'who are you|what are you|janbot|about you'),
      answer: t('chatbot.faq.about.answer', "I'm JanBot, your AI-powered civic assistant! I'm here to help you navigate our platform, report issues, track complaints, and get your questions answered. I'm available 24/7 to assist you with all things related to civic issue reporting.")
    }
  ];

  // Quick suggestions for users - multilingual
  const quickSuggestions = [
    t('chatbot.suggestions.report', "How to report an issue?"),
    t('chatbot.suggestions.types', "What can I report?"),
    t('chatbot.suggestions.track', "How to track my report?"),
    t('chatbot.suggestions.update', "No update on my report"),
    t('chatbot.suggestions.time', "How long until resolution?"),
    t('chatbot.suggestions.edit', "Can I edit my report?"),
    t('chatbot.suggestions.escalate', "How to escalate an issue?"),
    t('chatbot.suggestions.department', "Who fixes reported issues?"),
    t('chatbot.suggestions.photo', "How to add photos?"),
    t('chatbot.suggestions.urgent', "What are urgent issues?"),
    t('chatbot.suggestions.notifications', "How notifications work?"),
    t('chatbot.suggestions.community', "See community reports?")
  ];

  // Display only 3 questions initially
  const visibleSuggestions = showMoreQuestions ? quickSuggestions : quickSuggestions.slice(0, 3);

  // Scroll to bottom of messages with smooth animation
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check Gemini connection on mount
  useEffect(() => {
    checkGeminiConnection();
  }, []);

  const checkGeminiConnection = async () => {
    if (!GEMINI_API_KEY) {
      console.error("❌ Gemini API key is missing!");
      setGeminiStatus('error');
      return;
    }

    console.log("Checking Gemini connection with SDK...");
    
    try {
      // Try to make a simple request using the SDK
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",  // Use a known working model
        contents: "Respond with just the word 'OK' if you can hear me.",
        config: {
          maxOutputTokens: 10,
        },
      });
      if (response && response.text) {
        console.log("✅ Gemini connected successfully!", response.text);
        setGeminiStatus('connected');
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("❌ Gemini connection failed:", error);
      setGeminiStatus('error');
    }
  };

  // Check if question matches FAQ
  const checkFAQMatch = (userInput) => {
    for (const faq of faqData) {
      const keywords = faq.question.toLowerCase().split('|');
      if (keywords.some(keyword => userInput.includes(keyword))) {
        return faq.answer;
      }
    }
    return null;
  };

  // Get response from Gemini API using the SDK
  const getGeminiResponse = async (userInput) => {
    if (!GEMINI_API_KEY) {
      console.error("Gemini API key not found");
      return "I'm having trouble connecting to my AI services. Please try again later or contact support@janconnect.com for assistance.";
    }

    const systemPrompt = `You are JanBot, a helpful civic assistant for JanConnect platform. Your role is to help users with civic issues, reporting problems, and navigating the platform. Keep responses concise, friendly, and helpful. If you don't know something, suggest they contact support@janconnect.com. Focus on these topics: reporting civic issues, tracking complaints, platform features, community reporting, and general civic assistance.`;

    try {
      // Try different models if one fails
      let lastError = null;
      
      for (const model of AVAILABLE_MODELS) {
        try {
          console.log(`Trying model: ${model}`);
          
          const response = await ai.models.generateContent({
            model: model,
            contents: `${systemPrompt}\n\nUser question: ${userInput}\n\nProvide a helpful response about civic issues and JanConnect platform:`,
            config: {
              temperature: 0.7,
              maxOutputTokens: 300,
            },
          });
          
          if (response && response.text) {
            console.log(`✅ Got response from model: ${model}`);
            return response.text;
          }
        } catch (modelError) {
          console.log(`Model ${model} failed:`, modelError.message);
          lastError = modelError;
          // Continue to next model
        }
      }
      
      // If all models fail
      throw lastError || new Error("All models failed");
      
    } catch (error) {
      console.error("Gemini API error:", error);
      
      // Handle specific error types
      if (error.message?.includes("quota") || error.message?.includes("429")) {
        return "I'm currently experiencing high demand. Please try again in a few moments, or check our FAQ for common questions!";
      }
      
      return "I'm having trouble processing your request right now. Please try again or contact support@janconnect.com for help.";
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue.trim();
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // First check if it matches FAQ
      const faqAnswer = checkFAQMatch(userMessage.toLowerCase());
      
      let botResponseText;
      
      if (faqAnswer) {
        // Use predefined FAQ answer
        botResponseText = faqAnswer;
        console.log("Using FAQ response");
      } else {
        // Use Gemini API for other questions
        console.log("Using Gemini for response");
        botResponseText = await getGeminiResponse(userMessage);
      }

      const botResponse = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Fallback response
      const errorResponse = {
        id: messages.length + 2,
        text: "I'm having trouble responding right now. Please try again or check our FAQ for common questions!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a suggestion directly without input
  const sendSuggestionMessage = async (suggestion) => {
    if (isLoading) return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: suggestion,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // First check if it matches FAQ
      const faqAnswer = checkFAQMatch(suggestion.toLowerCase());
      
      let botResponseText;
      
      if (faqAnswer) {
        // Use predefined FAQ answer
        botResponseText = faqAnswer;
        console.log("Using FAQ response");
      } else {
        // Use Gemini API for other questions
        console.log("Using Gemini for response");
        botResponseText = await getGeminiResponse(suggestion);
      }

      const botResponse = {
        id: messages.length + 2,
        text: botResponseText,
        sender: 'bot'
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting response:", error);
      
      // Fallback response
      const errorResponse = {
        id: messages.length + 2,
        text: "I'm having trouble responding right now. Please try again or check our FAQ for common questions!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendSuggestionMessage(suggestion);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chatbot Button - Circular like WhatsApp */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#4F46E5] rounded-full shadow-lg hover:bg-[#4338CA] transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label={t('chatbot.openButton', 'Open chat')}
          >
            <svg 
              className="w-6 h-6 sm:w-7 sm:h-7 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            className="w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
            style={{
              maxWidth: 'calc(100vw - 2rem)',
              margin: '0 auto',
              height: '600px',
              maxHeight: '80vh'
            }}
          >
            {/* Header - Solid Indigo */}
            <div className="bg-[#4F46E5] text-white p-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center">
                <div>
                  <h3 className="font-semibold text-base">JanBot Assistant</h3>
                  <p className="text-xs text-indigo-100">Here to help with civic issues</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-indigo-200 transition-colors p-1"
                aria-label={t('chatbot.closeButton', 'Close chat')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </motion.button>
            </div>

            {/* Messages Container - Fixed height with scroll */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 p-4 overflow-y-auto bg-white"
              style={{
                scrollBehavior: 'smooth',
                height: '100%',
                maxHeight: 'calc(600px - 180px)'
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                    className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="max-w-[90%] p-3 rounded-lg text-sm text-gray-800"
                        style={{ 
                          backgroundColor: '#F3F4F6',
                          borderBottomLeftRadius: '4px'
                        }}
                      >
                        {message.text}
                      </motion.div>
                    )}
                    {message.sender === 'user' && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="max-w-[90%] p-3 rounded-lg text-sm text-white"
                        style={{ 
                          backgroundColor: '#4F46E5',
                          borderBottomRightRadius: '4px'
                        }}
                      >
                        {message.text}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-gray-100 p-3 rounded-lg rounded-bl-md"
                  >
                    <div className="flex items-center space-x-1">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">SUGGESTIONS</span>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMoreQuestions(!showMoreQuestions)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors flex items-center"
                >
                  {showMoreQuestions ? 'Less' : 'More'}
                  <motion.svg 
                    animate={{ rotate: showMoreQuestions ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-3 h-3 ml-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </motion.svg>
                </motion.button>
              </div>
              <motion.div 
                layout
                className="flex flex-wrap gap-2"
              >
                <AnimatePresence>
                  {visibleSuggestions.map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, backgroundColor: '#E5E7EB' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors text-gray-700 disabled:opacity-50"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  placeholder="Ask something..."
                  className="flex-1 px-4 py-2 text-sm bg-transparent rounded-lg focus:outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === '' || isLoading}
                  className="p-2 text-white bg-[#4F46E5] rounded-lg hover:bg-[#4338CA] disabled:opacity-50 transition-colors mr-1"
                  aria-label={t('chatbot.sendButton', 'Send message')}
                >
                  {isLoading ? (
                    <motion.svg 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </motion.svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* Custom scrollbar for the messages container */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;