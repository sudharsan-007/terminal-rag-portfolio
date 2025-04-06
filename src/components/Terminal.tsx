import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { TerminalResponse } from '@/types/terminal';
import TypewriterEffect from './TypewriterEffect';
import { useIsMobile } from '@/hooks/use-mobile';

const INITIAL_RESPONSES: TerminalResponse[] = [
  {
    question: 'Tell me about your experience with embedded systems',
    answer: `I have worked extensively with embedded systems throughout my career. I've developed firmware for
medical devices using ARM Cortex-M microcontrollers, implemented real-time operating systems
(RTOS) for IoT devices, and designed hardware interfaces for various sensors and actuators. My
experience spans across multiple industries including healthcare, automotive, and consumer
electronics. I'm proficient with development tools like Keil, IAR Workbench, and platform-specific
SDKs from manufacturers such as STMicroelectronics and Texas Instruments.`
  },
  {
    question: 'What programming languages are you proficient in?',
    answer: `I'm proficient in a variety of programming languages including C, C++, Python, JavaScript, and TypeScript.
For embedded systems, I primarily use C and C++ for firmware development, with occasional assembly language
for performance-critical sections. For web development, I'm experienced with modern JavaScript frameworks
like React, Vue, and Angular. I also have experience with backend development using Node.js, Express, and
databases like MongoDB and PostgreSQL. My approach is always to choose the right tool for the job rather
than forcing a particular language or framework.`
  },
  {
    question: 'Describe your approach to project management',
    answer: `My approach to project management is agile and adaptable, focusing on clear communication and iterative development.
I believe in setting realistic milestones, maintaining transparent documentation, and fostering collaboration
among team members. I typically use tools like Jira for task tracking, Git for version control, and hold regular
stand-ups to address blockers. Risk management is integral to my approach—I identify potential issues early
and develop contingency plans. Throughout the project lifecycle, I emphasize continuous improvement by
conducting retrospectives and applying lessons learned to future iterations.`
  }
];

interface TerminalProps {
  className?: string;
}

const Terminal: React.FC<TerminalProps> = ({ className = '' }) => {
  const [responses, setResponses] = useState<TerminalResponse[]>(INITIAL_RESPONSES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    setIsProcessing(true);
    
    // Simulate response generation
    setTimeout(() => {
      const newResponse: TerminalResponse = {
        question: inputValue,
        answer: `Thank you for your question about "${inputValue}". This is a simulated response that would be replaced with actual RAG-based answers in a production environment. The response would be generated based on the portfolio owner's data and relevant information.`
      };
      
      setResponses([...responses, newResponse]);
      setCurrentIndex(responses.length);
      setInputValue('');
      setIsProcessing(false);
    }, 1500);
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < responses.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && !isProcessing) {
      handleNavigation('prev');
    } else if (e.key === 'ArrowRight' && !isProcessing) {
      handleNavigation('next');
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      handleReset();
    }
  };

  return (
    <div 
      className={`flex flex-col h-full ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={terminalRef}
    >
      {/* Terminal content area (scrollable) */}
      <div className="terminal-window flex-grow overflow-hidden flex flex-col mb-4">
        <div className="flex-grow overflow-y-auto p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {responses[currentIndex] && (
                <div>
                  <div className="mb-4">
                    <span className="text-terminal-accent2">&gt;</span> <span className="text-terminal-text">{responses[currentIndex].question}</span>
                  </div>
                  <div className="content-block">
                    <TypewriterEffect text={responses[currentIndex].answer} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-right text-terminal-text/70 text-sm pr-2">
          {currentIndex + 1}/{responses.length}
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => handleNavigation('prev')}
          disabled={currentIndex === 0 || isProcessing}
          className={`nav-button ${currentIndex === 0 || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Previous response"
        >
          <ArrowLeft className="inline-block mr-1" size={16} /> {!isMobile && 'Previous'}
        </button>
        
        <button
          onClick={handleReset}
          className="nav-button"
          aria-label="Reset terminal"
        >
          <RotateCcw className="inline-block mr-1" size={16} /> Reset
        </button>
        
        <button
          onClick={() => handleNavigation('next')}
          disabled={currentIndex >= responses.length - 1 || isProcessing}
          className={`nav-button ${currentIndex >= responses.length - 1 || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Next response"
        >
          {!isMobile && 'Next'} <ArrowRight className="inline-block ml-1" size={16} />
        </button>
      </div>
      
      {/* Command input - fixed at the bottom */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center terminal-prompt">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isProcessing}
            placeholder="Type a command or ask me anything..."
            className="terminal-input pl-4 w-full"
            aria-label="Terminal input"
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;
