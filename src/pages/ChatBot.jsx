import { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

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
  const messagesEndRef = useRef(null);

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

  // Display only 3 questions initially, more when expanded
  const visibleSuggestions = showMoreQuestions ? quickSuggestions : quickSuggestions.slice(0, 2);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate bot response with a delay
    setTimeout(() => {
      handleBotResponse(inputValue.toLowerCase());
    }, 600);
  };

  // Handle bot response based on user input
  const handleBotResponse = (userInput) => {
    let foundAnswer = false;

    // Check for matching FAQ
    for (const faq of faqData) {
      const keywords = faq.question.split('|');
      if (keywords.some(keyword => userInput.includes(keyword.toLowerCase()))) {
        const botResponse = {
          id: messages.length + 2,
          text: faq.answer,
          sender: 'bot'
        };
        setMessages(prev => [...prev, botResponse]);
        foundAnswer = true;
        break;
      }
    }

    // Default responses for common complaint patterns - multilingual
    if (!foundAnswer) {
      let defaultResponse = {
        id: messages.length + 2,
        sender: 'bot'
      };
      
      if (userInput.includes(t('chatbot.patterns.unhappy', 'not happy')) || userInput.includes('unhappy') || userInput.includes('frustrated')) {
        defaultResponse.text = t('chatbot.responses.unhappy', "I understand you're frustrated. Dealing with civic issues can be challenging. Would you like me to help you escalate your report or check its current status?");
      } 
      else if (userInput.includes('why') && userInput.includes('not')) {
        defaultResponse.text = t('chatbot.responses.whyNot', "I'm not sure why your issue hasn't been resolved yet. It could be due to high volume, resource constraints, or complexity. Would you like to check the status of your report or add a comment to request an update?");
      }
      else if (userInput.includes('when') || userInput.includes('how long')) {
        defaultResponse.text = t('chatbot.responses.when', "Response times vary based on issue type and severity. Critical issues are typically addressed within 24-48 hours, while standard issues may take 3-5 days. Would you like to check the status of a specific report?");
      }
      else if (userInput.includes(t('chatbot.patterns.problem', 'problem')) || userInput.includes('issue') || userInput.includes('complaint')) {
        defaultResponse.text = t('chatbot.responses.problem', "I can help you report a new issue or check on an existing one. Would you like to know how to report a problem or check the status of a report you've already submitted?");
      }
      else {
        defaultResponse.text = t('chatbot.responses.default', "I'm not sure about that yet. Try asking about reporting issues, tracking complaints, or how our platform works. For specific account questions, contact our support team at support@janconnect.com.");
      }
      
      setMessages(prev => [...prev, defaultResponse]);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* Chatbot Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
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
          <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-green-500"></span>
          </span>
        </motion.button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-[calc(100vw-2rem)] sm:w-96 h-[80vh] sm:h-[520px] max-h-[600px] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl flex flex-col border border-gray-700 overflow-hidden"
          style={{
            maxWidth: 'calc(100vw - 2rem)',
            margin: '0 auto'
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base sm:text-lg">{t('chatbot.title', 'JanBot Assistant')}</h3>
                <p className="text-xs opacity-80">{t('chatbot.subtitle', 'Here to help with civic issues')}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
              aria-label={t('chatbot.closeButton', 'Close chat')}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-800/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-3 sm:mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs p-3 sm:p-4 rounded-2xl text-sm sm:text-base ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                      : 'bg-gray-700 text-gray-100 border border-gray-600'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border-t border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm text-gray-400">{t('chatbot.quickQuestions', 'Quick questions:')}</p>
              <button 
                onClick={() => setShowMoreQuestions(!showMoreQuestions)}
                className="text-xs sm:text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center"
              >
                {showMoreQuestions ? (
                  <>
                    <span>{t('chatbot.showLess', 'Show less')}</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  </>
                ) : (
                  <>
                    <span>{t('chatbot.showMore', 'Show more')}</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {visibleSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-600 border border-gray-500 rounded-xl hover:bg-gray-500 transition-colors text-gray-200 break-words max-w-[48%] sm:max-w-none"
                  style={{ wordBreak: 'break-word' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-gray-700 border-t border-gray-600 rounded-b-2xl">
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chatbot.placeholder', 'Ask JanBot about reporting issues...')}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm bg-gray-600 border border-gray-500 rounded-2xl rounded-r-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
                className="px-3 py-2 sm:px-4 sm:py-3 text-white bg-indigo-600 rounded-2xl rounded-l-none hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={t('chatbot.sendButton', 'Send message')}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;