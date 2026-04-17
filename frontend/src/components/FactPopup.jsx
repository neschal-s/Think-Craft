import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const FactPopup = () => {
  const { isDark, theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [factIndex, setFactIndex] = useState(0);
  const [isClosed, setIsClosed] = useState(false);

  const facts = [
    'AI can now generate realistic images from simple text descriptions in seconds.',
    'Machine learning models can predict disease outbreaks weeks before they happen.',
    'Quantum computers can solve certain problems 1 million times faster.',
    'Neural networks are inspired by how human brain cells communicate together.',
    'AI generates more data in one day than existed in the entire 1990s.',
    'GPT-4 can understand and generate content in over 90 different languages.',
    'Deep learning models can detect cancer in medical images better than doctors.',
    'Computers now perform complex calculations that would take humans centuries.',
    'AI can identify people by analyzing their walking pattern and movements.',
    'Machine learning powers recommendations for 80% of Netflix content watched.',
    'Neural networks can learn and adapt without explicit human programming instructions.',
    'AI systems can now generate human-quality code and find security vulnerabilities.',
    'Quantum entanglement allows two particles to instantly communicate across any distance.',
    'Machine learning algorithms improve their accuracy by analyzing thousands of examples.',
    'AI can translate languages in real-time with near-perfect human-level accuracy.',
    'Computers process information billions of times faster than human brain neurons.',
    'Deep learning has surpassed human performance in image recognition tasks.',
    'AI can generate music, art, and creative content indistinguishable from human work.',
    'Machine learning models can predict stock market trends with remarkable accuracy.',
    'Neural networks power facial recognition systems used by billions of people.',
    'AI assistants handle 85% of customer service interactions for major companies.',
    'Quantum computers harness the power of quantum superposition and entanglement.',
    'Machine learning can analyze medical images and diagnose diseases within seconds.',
    'AI-powered robots are now performing complex surgical procedures with precision.',
    'Natural language processing helps computers understand the nuances of human conversation.',
    'Deep learning networks have beaten world champions in chess and Go.',
    'Machine learning models can generate realistic human faces that never existed.',
    'AI can predict earthquakes, hurricanes, and natural disasters hours before impact.',
    'Computers now recognize speech with 95% accuracy in most languages.',
    'Neural networks can analyze millions of social media posts in milliseconds.',
    'AI systems can drive vehicles autonomously with minimal human intervention now.',
    'Machine learning helps farmers optimize crop yields and reduce water usage.',
    'Deep learning algorithms power recommendation engines used by billions worldwide.',
    'AI can detect fraudulent transactions and prevent financial crimes in real-time.',
    'Quantum computing could revolutionize drug discovery and vaccine development processes.',
    'Machine learning models learn patterns from data without explicit instructions.',
    'AI-powered chatbots can have meaningful conversations and provide customer support.',
    'Neural networks power voice assistants like Alexa, Siri, and Google Assistant.',
    'Deep learning enables autonomous vehicles to navigate complex urban environments safely.',
    'Machine learning optimizes power grids to reduce energy consumption and waste.',
    'AI can write articles, stories, and essays that read like human writing.',
    'Computers can now see and interpret the world like human eyes do.',
    'Machine learning predicts customer behavior and personalizes shopping experiences completely.',
    'AI systems analyze billions of genetic sequences to find disease cures.',
    'Deep learning models compress data to store more information with less space.',
    'Quantum computers use qubits that exist in multiple states simultaneously.',
    'Machine learning detects spam emails with 99.9% accuracy automatically.',
    'AI-powered systems manage traffic lights to reduce congestion by 25%.',
    'Neural networks can translate complex scientific papers into everyday language easily.',
    'Deep learning helps banks detect money laundering and fraud instantly.',
    'Machine learning personalizes learning experiences for millions of students worldwide.',
    'AI creates realistic deepfakes by analyzing facial expressions and movements.',
    'Computers generate video summaries from hours of footage in minutes now.',
    'Machine learning predicts which employees are likely to leave their jobs.',
    'AI systems recommend products by analyzing millions of user preferences.',
    'Deep learning powers facial unlock features on modern smartphones and devices.',
    'Machine learning optimizes renewable energy systems for maximum power generation.',
    'AI can diagnose skin cancer from photos with dermatologist-level accuracy.',
    'Quantum entanglement creates unbreakable codes for secure communication systems.',
    'Machine learning analyzes social networks to identify influencers and key nodes.',
    'AI generates personalized workout plans based on fitness goals and preferences.',
    'Deep learning enables real-time translation in video calls and conversations.',
    'Machine learning predicts equipment failures before they happen in factories.',
    'AI systems write code suggestions that help developers work faster.',
    'Neural networks can process and understand video content like human brains.',
    'Machine learning creates personalized medicine treatments for individual patients.',
    'AI analyzes fashion trends and predicts what clothes will sell next.',
    'Deep learning helps preserve endangered species through population monitoring systems.',
    'Machine learning optimizes logistics to reduce shipping times and costs significantly.',
    'AI generates realistic 3D models from 2D images and sketches.',
    'Computers can now understand context and sarcasm in human communication perfectly.',
    'Machine learning analyzes brain scans to detect early signs of Alzheimer\'s.',
    'AI powers recommendation algorithms for music, movies, and streaming services.',
    'Deep learning enables gesture recognition for touchless control of devices.',
    'Machine learning predicts weather patterns with accuracy improving every year.',
    'AI systems help farmers use precision agriculture to maximize crop yields.',
    'Neural networks analyze satellite imagery to track deforestation and environmental changes.',
    'Machine learning personalizes news feeds to show relevant stories to users.',
    'AI can identify mental health issues from social media text patterns.',
    'Deep learning accelerates scientific research by analyzing research papers automatically.',
    'Machine learning optimizes supply chains to reduce waste and improve efficiency.',
    'AI generates realistic simulations for training pilots, soldiers, and medical staff.',
    'Computers can now compose symphonies and music pieces in any style.',
    'Machine learning detects cyberattacks in milliseconds and prevents data breaches.',
    'AI analyzes consumer behavior to optimize marketing campaigns for better results.',
    'Deep learning improves autonomous vehicles\' ability to understand complex traffic.',
    'Machine learning predicts customer churn to help businesses retain loyal clients.',
    'AI can generate entire worlds and environments for video games instantly.',
    'Neural networks help biologists understand protein folding and molecular structures.',
    'Machine learning enables robots to learn new tasks through demonstration.',
    'AI systems analyze medical records to improve patient outcomes and care.',
    'Deep learning powers search engines that understand user intent perfectly.',
    'Machine learning helps city planners design more efficient urban infrastructure.',
    'AI can generate business reports and summaries from raw data automatically.',
    'Computers now understand and respond to human emotions in conversations.'
  ];

  useEffect(() => {
    // Don't show facts if user has closed the popup
    if (isClosed) return;

    // Function to show a new fact
    const showNewFact = () => {
      // Double check isClosed hasn't changed
      if (isClosed) return;

      setIsExiting(false);
      const randomIndex = Math.floor(Math.random() * facts.length);
      setFactIndex(randomIndex);
      setCurrentFact(facts[randomIndex]);
      setIsVisible(true);

      // After 8 seconds, start exit animation
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
      }, 8000);

      // After exit animation completes (0.4s) + 3 second delay, show next fact
      const nextFactTimer = setTimeout(() => {
        if (!isClosed) {
          showNewFact();
        }
      }, 11400); // 8000 + 400 (animation) + 3000

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(nextFactTimer);
      };
    };

    // Show first fact immediately
    showNewFact();
  }, [isClosed]);

  const handleClose = () => {
    setIsClosed(true);
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 400);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-20 right-4 max-w-sm z-40 transition-all duration-400`}
      style={{
        animation: isExiting 
          ? 'slideOutRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          : 'slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `}</style>

      <div
        className={`${
          isDark
            ? 'bg-gradient-to-br from-[#1a1d25] to-[#252a35] border border-[#0055ff]/30'
            : 'bg-gradient-to-br from-white to-gray-50 border border-[#0055ff]/20'
        } rounded-xl p-4 shadow-2xl backdrop-blur-md`}
      >
        <div className="flex items-start gap-3">
          {/* Fact Icon */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-lg ${
              isDark
                ? 'bg-[#0055ff]/20 text-[#0088ff]'
                : 'bg-[#0055ff]/10 text-[#0055ff]'
            }`}
          >
            💡
          </div>

          {/* Fact Content */}
          <div className="flex-1">
            <h4 className={`font-['Orbitron'] text-xs font-bold mb-2 tracking-widest ${
              isDark ? 'text-[#0055ff]' : 'text-[#0055ff]'
            }`}>
              INTERESTING FACT
            </h4>
            <p
              className={`font-['Inter'] text-sm font-normal leading-relaxed ${
                isDark ? 'text-[#b0b3b8]' : 'text-gray-700'
              }`}
            >
              {currentFact}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
              isDark
                ? 'text-[#8a8d93] hover:text-[#b0b3b8] hover:bg-[#2a2d35]'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0055ff] to-[#ff5500] rounded-b-xl opacity-60"></div>
      </div>
    </div>
  );
};

export default FactPopup;
