import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react';
import { 
  MessageSquare, 
  Home, 
  User, 
  Users, 
  Bell, 
  Search, 
  Edit3, 
  Heart, 
  MessageCircle, 
  ChevronRight,
  BookOpen,
  DollarSign,
  Smile,
  Activity,
  Globe,
  Award,
  Moon,
  Sun,
  Sparkles,
  Send,
  X,
  Settings,
  LogOut,
  HelpCircle,
  Shield,
  Wifi,
  Battery,
  Signal,
  ArrowDown,
  MapPin,
  Calendar,
  Clock,
  MoreHorizontal,
  ChevronDown,
  Filter,
  Bot,
  Briefcase
} from 'lucide-react';

// --- Constants & Theme ---

const UW_PURPLE = "bg-[#4b2e83]";
const UW_GOLD = "text-[#b7a57a]";

// --- Mock Data ---

const POSTS = [
  {
    id: 1,
    user: "UW Registrar",
    handle: "@registrar",
    time: "1h",
    content: "🚨 Priority Registration for Winter 2026 begins tomorrow at 6:00 AM PST. Seniors & Priority Groups: Check your MyPlan audit tonight to avoid hold errors.",
    likes: 342,
    comments: 45,
    verified: true,
    category: "Academic",
  },
  {
    id: 2,
    user: "Husky Union Building",
    handle: "@hub_uw",
    time: "3h",
    content: "Need a study break? The HUB gaming lounge is free for all students today until 8 PM! Come challenge the staff to Mario Kart. 🏎️",
    likes: 156,
    comments: 22,
    verified: true,
    category: "Social",
    location: "HUB 101"
  },
  {
    id: 3,
    user: "Sarah Jenks",
    handle: "@sarah_j",
    time: "5h",
    content: "Anyone in CSE 142 want to form a study group for the midterm? I'm struggling with the complex conditionals practice problem.",
    likes: 12,
    comments: 5,
    verified: false,
    category: "Academic"
  },
  {
    id: 4,
    user: "UW Alert",
    handle: "@uw_alert",
    time: "1d",
    content: "Cherry Blossom Watch 🌸: The Quad is currently at 40% bloom. Expect peak bloom by next Tuesday. Please respect the trees!",
    likes: 890,
    comments: 102,
    verified: true,
    category: "Campus"
  },
   {
    id: 5,
    user: "Financial Aid",
    handle: "@uw_finaid",
    time: "2d",
    content: "Husky Promise Update: Disimbursements for Spring Quarter will begin posting to tuition accounts on March 18th.",
    likes: 210,
    comments: 34,
    verified: true,
    category: "Finance"
  }
];

// Personal Schedule
const PERSONAL_SCHEDULE = [
  { id: 1, title: "CSE 142: Programming I", time: "08:30 AM - 09:20 AM", location: "Kane Hall 130", type: "class", color: "bg-blue-100 text-blue-700", border: "border-blue-200" },
  { id: 2, title: "INFO 200: Foundations", time: "10:30 AM - 12:20 PM", location: "Mary Gates Hall 241", type: "class", color: "bg-purple-100 text-purple-700", border: "border-purple-200" },
  { id: 3, title: "Capstone Group Meeting", time: "01:00 PM - 02:00 PM", location: "HUB 101", type: "event", color: "bg-yellow-100 text-yellow-700", border: "border-yellow-200" },
  { id: 4, title: "Gym Workout", time: "04:00 PM - 05:30 PM", location: "IMA Building", type: "event", color: "bg-green-100 text-green-700", border: "border-green-200" },
];

// Departmental Deadlines (Allen School)
const DEPT_DEADLINES = [
  { id: 1, title: "Direct to Major (Freshman)", date: "Nov 15", desc: "Application Deadline for Autumn 2026 admission.", type: "deadline", color: "bg-red-100 text-red-700", border: "border-red-200", iconName: "Activity" },
  { id: 2, title: "Transfer Application Opens", date: "Dec 15", desc: "Application opens for students transferring from WA community colleges.", type: "info", color: "bg-blue-100 text-blue-700", border: "border-blue-200", iconName: "Calendar" },
  { id: 3, title: "Current UW Student App", date: "Jan 15", desc: "Deadline for current students applying for Spring quarter admission.", type: "deadline", color: "bg-red-100 text-red-700", border: "border-red-200", iconName: "Activity" },
  { id: 4, title: "FAFSA Priority Deadline", date: "Feb 28", desc: "Priority deadline for financial aid consideration.", type: "finance", color: "bg-green-100 text-green-700", border: "border-green-200", iconName: "DollarSign" },
  { id: 5, title: "Info Session: Study Abroad", date: "Mar 10", desc: "Learn about Allen School exchange programs.", type: "event", color: "bg-purple-100 text-purple-700", border: "border-purple-200", iconName: "Globe" },
];

// Helper to render icons safely
const DeadlineIcon = ({ name, size = 16 }) => {
  switch(name) {
    case "Activity": return <Activity size={size} />;
    case "Calendar": return <Calendar size={size} />;
    case "DollarSign": return <DollarSign size={size} />;
    case "Globe": return <Globe size={size} />;
    default: return <Activity size={size} />;
  }
};

const CATEGORIES = [
  { name: "Academics", icon: <BookOpen size={20} />, color: "bg-blue-100 text-blue-700" },
  { name: "Finance", icon: <DollarSign size={20} />, color: "bg-green-100 text-green-700" },
  { name: "Wellness", icon: <Activity size={20} />, color: "bg-red-100 text-red-700" },
  { name: "Social", icon: <Users size={20} />, color: "bg-yellow-100 text-yellow-700" },
  { name: "Housing", icon: <Home size={20} />, color: "bg-purple-100 text-purple-700" },
  { name: "Jobs", icon: <Award size={20} />, color: "bg-orange-100 text-orange-700" },
];

// --- Components & Utilities ---

// Markdown Parser (Simple)
const MarkdownText = ({ text, isUser, isDarkMode }) => {
  // Basic parsing for bold (**text**) and newlines
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  
  return (
    <span className={`text-sm leading-relaxed ${isUser ? 'text-white' : isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
        }
        if (part === '\n') {
          return <br key={i} />;
        }
        return part;
      })}
    </span>
  );
};


// 1. Hook: useAutoScroll
const useAutoScroll = ({ content, smooth = false }) => {
  const scrollRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, [smooth]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      const isBottom = distanceToBottom < 50; // Tolerance
      setIsAtBottom(isBottom);

      if (!isBottom && autoScrollEnabled) {
        setAutoScrollEnabled(false);
      } else if (isBottom && !autoScrollEnabled) {
        setAutoScrollEnabled(true);
      }
    }
  }, [autoScrollEnabled]);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (autoScrollEnabled) {
      scrollToBottom();
    }
  }, [content, autoScrollEnabled, scrollToBottom]);

  return {
    scrollRef,
    isAtBottom,
    autoScrollEnabled,
    scrollToBottom,
    disableAutoScroll: () => setAutoScrollEnabled(false),
  };
};

// 2. Component: Button
const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-[#4b2e83] text-white hover:bg-[#361e63]",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-gray-100 text-gray-700",
    icon: "h-10 w-10",
  };
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    icon: "h-10 w-10",
  };
  
  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    />
  );
});
Button.displayName = "Button";

// 3. Component: ChatMessageList
const ChatMessageList = React.forwardRef(({ className, children, smooth = false, ...props }, _ref) => {
  const {
    scrollRef,
    isAtBottom,
    scrollToBottom,
    disableAutoScroll,
  } = useAutoScroll({
    smooth,
    content: children,
  });

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden">
      <div
        className={`flex flex-col w-full h-full p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${className}`}
        ref={scrollRef}
        onWheel={disableAutoScroll}
        onTouchMove={disableAutoScroll}
        style={{ overflowAnchor: 'none' }} // Prevents browser scroll anchoring fighting our logic
        {...props}
      >
        <div className="flex flex-col gap-6 pt-4 pb-4">{children}</div>
      </div>

      {!isAtBottom && (
        <Button
          onClick={() => {
            scrollToBottom();
          }}
          size="icon"
          variant="outline"
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 inline-flex rounded-full shadow-md w-8 h-8 bg-white text-black border border-gray-200 animate-in zoom-in duration-200 z-20"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});
ChatMessageList.displayName = "ChatMessageList";

// 4. Component: Iphone15Pro
function Iphone15Pro({
  width = 433,
  height = 882,
  children,
  className,
  ...props
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 433 882`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M2 73C2 32.6832 34.6832 0 75 0H357C397.317 0 430 32.6832 430 73V809C430 849.317 397.317 882 357 882H75C34.6832 882 2 849.317 2 809V73Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M0 171C0 170.448 0.447715 170 1 170H3V204H1C0.447715 204 0 203.552 0 203V171Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M1 234C1 233.448 1.44772 233 2 233H3.5V300H2C1.44772 300 1 299.552 1 299V234Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M1 319C1 318.448 1.44772 318 2 318H3.5V385H2C1.44772 385 1 384.552 1 384V319Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M430 279H432C432.552 279 433 279.448 433 280V384C433 384.552 432.552 385 432 385H430V279Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M6 74C6 35.3401 37.3401 4 76 4H356C394.66 4 426 35.3401 426 74V808C426 846.66 394.66 878 356 878H76C37.3401 878 6 846.66 6 808V74Z"
        className="dark:fill-[#262626] fill-black"
      />
      <path
        opacity="0.5"
        d="M174 5H258V5.5C258 6.60457 257.105 7.5 256 7.5H176C174.895 7.5 174 6.60457 174 5.5V5Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M21.25 75C21.25 44.2101 46.2101 19.25 77 19.25H355C385.79 19.25 410.75 44.2101 410.75 75V807C410.75 837.79 385.79 862.75 355 862.75H77C46.2101 862.75 21.25 837.79 21.25 807V75Z"
        className="fill-white dark:fill-[#1a1a1a]"
      />

      {/* App Content via foreignObject */}
      <foreignObject
         x="21.25"
         y="19.25"
         width="389.5"
         height="843.5"
         clipPath="url(#roundedCorners)"
         className="overflow-hidden"
      >
        {children}
      </foreignObject>

      {/* Dynamic Island Area (On Top) */}
      <path
        d="M154 48.5C154 38.2827 162.283 30 172.5 30H259.5C269.717 30 278 38.2827 278 48.5C278 58.7173 269.717 67 259.5 67H172.5C162.283 67 154 58.7173 154 48.5Z"
        className="fill-black"
      />
      <path
        d="M249 48.5C249 42.701 253.701 38 259.5 38C265.299 38 270 42.701 270 48.5C270 54.299 265.299 59 259.5 59C253.701 59 249 54.299 249 48.5Z"
        className="fill-[#101010]"
      />
      <path
        d="M254 48.5C254 45.4624 256.462 43 259.5 43C262.538 43 265 45.4624 265 48.5C265 51.5376 262.538 54 259.5 54C256.462 54 254 51.5376 254 48.5Z"
        className="fill-[#202020]"
      />
      <defs>
        <clipPath id="roundedCorners">
          <rect
            x="21.25"
            y="19.25"
            width="389.5"
            height="843.5"
            rx="55.75"
            ry="55.75"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

// --- App Sub-Components ---

// Mock AI Response Generator
const generateMockResponse = (userMessage) => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Registration questions
  if (lowerMsg.includes('registration') || lowerMsg.includes('register')) {
    const regPost = POSTS.find(p => p.user === "UW Registrar");
    if (regPost) {
      return `**Registration Information**\n\n${regPost.content}\n\nMake sure to check your MyPlan audit before registration opens to avoid any holds!`;
    }
    return "**Registration**\n\nPriority Registration for Winter 2026 begins tomorrow at 6:00 AM PST. Seniors and Priority Groups should check their MyPlan audit tonight to avoid hold errors.";
  }
  
  // IMA questions
  if (lowerMsg.includes('ima') || lowerMsg.includes('gym') || lowerMsg.includes('workout')) {
    const scheduleItem = PERSONAL_SCHEDULE.find(s => s.location.includes('IMA'));
    return `**IMA (Intramural Activities Building)**\n\nThe IMA is located on the north side of campus. It's open daily and offers:\n* Fitness equipment\n* Group exercise classes\n* Basketball courts\n* Swimming pool\n* Rock climbing wall\n\nCheck the IMA website for current hours and availability!`;
  }
  
  // HUB questions
  if (lowerMsg.includes('hub') || lowerMsg.includes('husky union')) {
    const hubPost = POSTS.find(p => p.user.includes('HUB'));
    if (hubPost) {
      return `**Husky Union Building (HUB)**\n\n${hubPost.content}\n\nThe HUB is the main student center on campus, located in the center of campus. It has dining options, study spaces, and event areas.`;
    }
    return "**HUB (Husky Union Building)**\n\nThe HUB is the main student center on campus. It features dining options, study spaces, gaming lounges, and hosts many student events. Check their website for current hours and activities!";
  }
  
  // Financial aid questions
  if (lowerMsg.includes('financial aid') || lowerMsg.includes('fafsa') || lowerMsg.includes('husky promise') || lowerMsg.includes('tuition')) {
    const finAidPost = POSTS.find(p => p.user === "Financial Aid");
    const fafsaDeadline = DEPT_DEADLINES.find(d => d.title.includes('FAFSA'));
    let response = "**Financial Aid Information**\n\n";
    if (finAidPost) {
      response += `${finAidPost.content}\n\n`;
    }
    if (fafsaDeadline) {
      response += `**Important:** ${fafsaDeadline.title} is ${fafsaDeadline.date}. ${fafsaDeadline.desc}`;
    }
    return response || "For financial aid questions, contact the Office of Student Financial Aid or check your MyUW account for updates.";
  }
  
  // Deadlines questions
  if (lowerMsg.includes('deadline') || lowerMsg.includes('due date') || lowerMsg.includes('application')) {
    let response = "**Upcoming Deadlines**\n\n";
    DEPT_DEADLINES.slice(0, 3).forEach(deadline => {
      response += `* **${deadline.title}**: ${deadline.date}\n  ${deadline.desc}\n\n`;
    });
    return response.trim();
  }
  
  // Schedule questions
  if (lowerMsg.includes('schedule') || lowerMsg.includes('class') || lowerMsg.includes('today')) {
    let response = "**Today's Schedule**\n\n";
    PERSONAL_SCHEDULE.forEach(item => {
      response += `* **${item.title}**\n  ${item.time} at ${item.location}\n\n`;
    });
    return response.trim();
  }
  
  // Cherry blossoms
  if (lowerMsg.includes('cherry') || lowerMsg.includes('blossom') || lowerMsg.includes('quad')) {
    const cherryPost = POSTS.find(p => p.content.includes('Cherry Blossom'));
    if (cherryPost) {
      return `**Cherry Blossom Update** 🌸\n\n${cherryPost.content}`;
    }
    return "The Quad's cherry blossoms are a beautiful spring tradition at UW! Peak bloom typically occurs in late March to early April. Check UW Alert for current bloom status.";
  }
  
  // CSE questions
  if (lowerMsg.includes('cse') || lowerMsg.includes('computer science')) {
    const csePost = POSTS.find(p => p.content.includes('CSE 142'));
    if (csePost) {
      return `**CSE Information**\n\n${csePost.content}\n\nFor more information about the Computer Science program, check the Paul G. Allen School website.`;
    }
    return "**Computer Science & Engineering**\n\nThe Paul G. Allen School offers various CSE courses. CSE 142 is an introductory programming course. Check the Allen School website for course details and prerequisites.";
  }
  
  // Study group questions
  if (lowerMsg.includes('study group') || lowerMsg.includes('study')) {
    return "**Study Groups**\n\nMany students form study groups for their classes! You can:\n* Post in class discussion forums\n* Check the UWpedia feed for study group requests\n* Visit the HUB study spaces to meet other students\n* Join department-specific student organizations";
  }
  
  // Default helpful response
  return `I can help you with information about:\n\n* **Registration** - When and how to register for classes\n* **Campus locations** - IMA, HUB, and other buildings\n* **Deadlines** - Important dates and application deadlines\n* **Financial aid** - FAFSA, Husky Promise, and tuition\n* **Schedule** - Your class schedule and events\n* **Campus life** - Events, activities, and resources\n\nTry asking about any of these topics, or check the feed for the latest updates!`;
};

const ChatOverlay = ({ isOpen, onClose, isDarkMode }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'system', text: "Hi! I'm your UWpedia assistant. \n\nI can help you find resources, check deadlines, or answer questions about campus life. \n\n**Try asking:** \n* When is registration? \n* Where is the IMA?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Try to use API key from environment variable if available
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
      
      if (apiKey) {
        // Use real API if key is available
        const appContext = `
          You are a helpful assistant for UWpedia (University of Washington).
          Data: ${JSON.stringify(POSTS.map(p => `${p.user}: ${p.content}`))}
          IMPORTANT FORMATTING:
          - Use ### for headers
          - Use **text** for bold
          - Use * for bullet points
          - Keep responses concise and mobile-friendly
        `;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${appContext}\n\nUser Question: ${userMsg}` }] }]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || generateMockResponse(userMsg);
          setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
        } else {
          // Fall back to mock if API fails
          const botReply = generateMockResponse(userMsg);
          setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
        }
      } else {
        // Use mock response system
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
        const botReply = generateMockResponse(userMsg);
        setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
      }
    } catch (error) {
      console.error(error);
      // Fall back to mock response on error
      const botReply = generateMockResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: botReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`flex-1 mt-16 rounded-t-[40px] shadow-2xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`p-5 border-b flex justify-between items-center ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4b2e83] to-[#b7a57a] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={18} fill="white" />
             </div>
             <div>
                <h3 className={`font-bold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>UW Assistant</h3>
                <span className="text-xs text-green-500 flex items-center gap-1 font-medium">● Online</span>
             </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages using ChatMessageList */}
        <ChatMessageList className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} smooth={true}>
           {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-end gap-2 mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              
              {/* Bot Avatar */}
              {msg.role === 'bot' && (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1">
                  <Bot size={14} className="text-gray-500 dark:text-gray-400" />
                </div>
              )}

              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-[#4b2e83] text-white rounded-br-sm' 
                  : isDarkMode 
                    ? 'bg-gray-800 text-gray-100 rounded-bl-sm border border-gray-700' 
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
              }`}>
                <MarkdownText text={msg.text} isUser={msg.role === 'user'} isDarkMode={isDarkMode} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-end gap-2">
               <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mb-1">
                  <Bot size={14} className="text-gray-500 dark:text-gray-400" />
               </div>
               <div className={`px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                  </div>
               </div>
            </div>
          )}
        </ChatMessageList>

        {/* Modern Input Area */}
        <div className={`p-4 pb-8 ${isDarkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-100'}`}>
          <div className={`flex items-center gap-2 p-1.5 pl-4 rounded-[24px] border shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#4b2e83]/20 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
              className={`flex-1 bg-transparent border-none text-sm py-2 focus:outline-none ${
                isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
              }`}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                !input.trim() 
                  ? 'bg-gray-300 dark:bg-gray-700 text-white cursor-not-allowed' 
                  : 'bg-[#4b2e83] hover:bg-[#361e63] text-white shadow-md transform hover:scale-105'
              }`}
            >
              <Send size={18} className={!input.trim() ? 'opacity-50' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ isDarkMode }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const categoriesRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} pt-8`}>
      {/* Header Section - Seamless in Dark Mode */}
      <div className={`px-6 pt-4 pb-6 z-10 rounded-b-[40px] transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white shadow-sm'}`}>
        <div className="flex justify-between items-start mb-6">
           <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Hi, User <span className="animate-wave inline-block origin-bottom-right">👋</span>
              </h1>
              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Explore the Husky experience
              </p>
           </div>
           <div className={`w-10 h-10 rounded-full ${UW_PURPLE} flex items-center justify-center text-white font-bold border-2 border-white shadow-md`}>
             U
           </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search resources, deadlines..." 
              className={`w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4b2e83] transition-shadow ${
                isDarkMode ? 'bg-gray-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-800'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 bg-white rounded-xl shadow-sm cursor-pointer">
               <Settings size={16} className="text-gray-600" />
            </div>
        </div>

        {/* Categories - Dropdown Logic */}
        <div className="relative z-20" ref={categoriesRef}>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => setActiveFilter('All')}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    activeFilter === 'All' 
                    ? 'bg-[#2f2f2f] text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  All
                </button>
                {/* Show first 2 categories inline */}
                {CATEGORIES.slice(0, 2).map(cat => (
                  <button 
                    key={cat.name}
                    onClick={() => setActiveFilter(cat.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      activeFilter === cat.name 
                      ? `${UW_PURPLE} text-white shadow-sm` 
                      : 'bg-white text-gray-600 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
             </div>
             
             {/* Dropdown Trigger */}
             <button 
               onClick={toggleDropdown}
               className={`ml-2 p-2 rounded-xl flex items-center gap-1 text-xs font-medium transition-colors ${
                 showDropdown ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
               }`}
             >
               More <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
             </button>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl shadow-xl border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'} grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2`}>
               {CATEGORIES.slice(2).map(cat => (
                  <button 
                    key={cat.name}
                    onClick={() => {
                      setActiveFilter(cat.name);
                      setShowDropdown(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-xs font-medium text-left flex items-center gap-2 transition-all ${
                      activeFilter === cat.name 
                      ? `${UW_PURPLE} text-white` 
                      : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {cat.icon}
                    {cat.name}
                  </button>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex justify-between items-end px-2">
           <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Popular Updates</h2>
           <span className="text-xs text-[#b7a57a] font-medium cursor-pointer">View all</span>
        </div>

        {POSTS.filter(p => activeFilter === 'All' || activeFilter === p.category).map(post => (
          <div 
            key={post.id} 
            className={`p-5 rounded-3xl shadow-lg transition-transform hover:scale-[1.01] ${
              isDarkMode ? 'bg-gray-900 shadow-black/20' : 'bg-white shadow-gray-200/50'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
               <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${UW_PURPLE} flex items-center justify-center text-white font-bold shadow-sm`}>
                    {post.user.charAt(0)}
                  </div>
                  <div>
                     <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                       {post.user} {post.verified && <span className="text-blue-500 inline-block ml-0.5">✓</span>}
                     </h3>
                     <span className="text-xs text-gray-400">{post.time} ago • {post.category}</span>
                  </div>
               </div>
               <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}>
                 <ChevronRight size={16} className="text-gray-400" />
               </button>
            </div>

            {/* Content */}
            <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {post.content}
            </p>

            {/* Optional Location/Tag */}
            {post.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 bg-gray-100/50 dark:bg-gray-800/50 w-fit px-2 py-1 rounded-lg">
                 <MapPin size={12} /> {post.location}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-2 border-t border-dashed border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-1.5 text-gray-400 hover:text-pink-500 transition-colors cursor-pointer group">
                  <Heart size={18} className="group-hover:fill-current" />
                  <span className="text-xs font-medium">{post.likes}</span>
               </div>
               <div className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer">
                  <MessageCircle size={18} />
                  <span className="text-xs font-medium">{post.comments}</span>
               </div>
               <div className="ml-auto">
                  <button className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    isDarkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}>
                    Details
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScheduleScreen = ({ isDarkMode }) => {
  const [view, setView] = useState('personal'); // 'personal' or 'deadlines'

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} pt-12 px-6`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {view === 'personal' ? "Today's Schedule" : "Deadlines"}
        </h1>
        
        <div className={`flex p-1 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
           <button 
             onClick={() => setView('personal')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
               view === 'personal' 
               ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' 
               : 'text-gray-500 dark:text-gray-400'
             }`}
           >
             My Schedule
           </button>
           <button 
             onClick={() => setView('deadlines')}
             className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
               view === 'deadlines' 
               ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white' 
               : 'text-gray-500 dark:text-gray-400'
             }`}
           >
             Dept. Dates
           </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-24 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {view === 'personal' ? (
          // PERSONAL SCHEDULE RENDER
          PERSONAL_SCHEDULE.map(item => (
            <div key={item.id} className={`flex gap-4 p-4 rounded-2xl border-l-4 shadow-sm ${item.border} ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
               <div className="flex flex-col items-center gap-1 pt-1">
                  <div className={`w-2 h-2 rounded-full ${item.color.split(" ")[0].replace("bg-", "bg-")}`}></div>
                  <div className="h-full w-0.5 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
               </div>
               <div className="flex-1">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.color}`}>{item.type}</span>
                  <h3 className="font-bold text-md mt-2 mb-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                     <Clock size={14} /> {item.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                     <MapPin size={14} /> {item.location}
                  </div>
               </div>
            </div>
          ))
        ) : (
          // DEADLINES RENDER
          <div className="space-y-6">
             <div className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-sm border border-purple-100 dark:border-gray-800`}>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-700">
                      <Briefcase size={20} />
                   </div>
                   <div>
                      <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Paul G. Allen School</h3>
                      <p className="text-xs text-gray-500">Computer Science & Engineering</p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   {DEPT_DEADLINES.map(item => (
                      <div key={item.id} className={`flex gap-3 p-3 rounded-xl border-l-2 ${item.border} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                         <div className={`flex-shrink-0 mt-1 ${item.color.split(" ")[1]}`}>
                            <DeadlineIcon name={item.iconName} size={16} />
                         </div>
                         <div>
                            <div className="flex justify-between items-start">
                               <h4 className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.title}</h4>
                               <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${item.color}`}>{item.date}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileScreen = ({ isDarkMode }) => {
  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
      {/* Profile Header - Seamless in Dark Mode */}
      <div className={`relative pt-16 pb-8 px-6 z-10 rounded-b-[40px] transition-colors duration-300 ${isDarkMode ? 'bg-gray-950' : 'bg-white shadow-sm'}`}>
         <div className="absolute top-12 right-6 p-2 bg-gray-50 dark:bg-gray-800 rounded-full cursor-pointer">
            <Settings size={20} className={isDarkMode ? 'text-white' : 'text-gray-600'} />
         </div>
         
         <div className="flex flex-col items-center">
            <div className={`w-28 h-28 ${UW_PURPLE} rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg mb-4`}>
              U
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>User</h2>
            <p className="text-sm text-gray-500">Computer Science • Class of 2027</p>
         </div>

         <div className="flex justify-center gap-10 mt-8">
            <div className="text-center">
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>12</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Courses</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4/100</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Badges</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>890</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
            </div>
         </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Mood Tracker */}
        <div className={`p-6 rounded-3xl shadow-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
           <div className="flex justify-between items-center mb-6">
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Weekly Mood</h3>
              <MoreHorizontal size={20} className="text-gray-400" />
           </div>
           <div className="h-32 flex items-end justify-between gap-2">
             {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
               <div key={i} className="w-full bg-gray-100 dark:bg-gray-800 rounded-t-xl relative group h-full flex items-end">
                 <div 
                    className={`w-full rounded-t-xl transition-all duration-500 ${h < 40 ? 'bg-red-300' : 'bg-[#4b2e83]'}`} 
                    style={{height: `${h}%`}}
                  ></div>
               </div>
             ))}
           </div>
           <div className="flex justify-between mt-3 text-xs font-bold text-gray-400">
             <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
           </div>
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-3xl shadow-sm ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shortcuts</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Shield size={20}/></div>
                     <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>SafeCampus</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
               </div>
               <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><BookOpen size={20}/></div>
                     <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>MyPlan Audit</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---

// Onboarding Screen Component
const OnboardingScreen = ({ onLoginSuccess }) => {
  const handleUWNetIDLogin = () => {
    // In production, this would redirect to UW's Shibboleth/SAML authentication
    // For now, we'll simulate the login by calling onLoginSuccess after a brief delay
    // In a real implementation, you would redirect to:
    // const uwLoginUrl = 'https://idp.u.washington.edu/idp/profile/SAML2/Redirect/SSO?execution=e1s1';
    // window.location.href = uwLoginUrl;
    
    // Simulate authentication flow
    // After successful authentication, UW would redirect back to your app with a token
    // For demo purposes, we'll just mark onboarding as complete
    setTimeout(() => {
      onLoginSuccess();
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4b2e83] via-[#5a3a93] to-[#4b2e83] p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#b7a57a] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#b7a57a] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* UW Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#4b2e83] to-[#5a3a93] rounded-2xl flex items-center justify-center">
              <span className="text-white text-3xl font-bold">W</span>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-4xl font-bold text-white mb-3 text-center">
          Welcome to UWpedia
        </h1>
        <p className="text-lg text-purple-100 mb-2 text-center">
          Your gateway to the University of Washington
        </p>
        <p className="text-sm text-purple-200 mb-12 text-center max-w-sm">
          Connect with campus resources, stay updated on deadlines, and explore everything UW has to offer
        </p>

        {/* UW NetID Login Button */}
        <button
          onClick={handleUWNetIDLogin}
          className="w-full bg-white text-[#4b2e83] font-bold py-4 px-6 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
        >
          <Shield size={24} className="text-[#4b2e83] group-hover:scale-110 transition-transform" />
          <span className="text-lg">Sign in with UW NetID</span>
          <ChevronRight size={20} className="text-[#4b2e83] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Info Text */}
        <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-[#b7a57a] mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-white text-sm font-medium mb-1">Secure Authentication</p>
              <p className="text-purple-100 text-xs leading-relaxed">
                Your UW NetID credentials are managed by the University of Washington. We never see or store your password.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-purple-200 text-xs">
            By continuing, you agree to UW's terms of service
          </p>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const handleLoginSuccess = () => {
    setOnboardingComplete(true);
  };

  // Show onboarding screen if not completed
  if (!onboardingComplete) {
    return (
      <div className={`w-full min-h-screen flex justify-center items-center p-8 font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#111]' : 'bg-[#eef0f4]'}`}>
        <div className="flex gap-12 items-start">
          {/* IPHONE 15 PRO SVG FRAME */}
          <div className={`relative ${isDarkMode ? 'dark' : ''}`}>
            <Iphone15Pro className="h-[852px] w-auto drop-shadow-2xl">
              <div className={`h-full w-full flex flex-col relative ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <div className="flex-1 overflow-hidden relative">
                  <OnboardingScreen onLoginSuccess={handleLoginSuccess} />
                </div>
              </div>
            </Iphone15Pro>
          </div>

          {/* Demo Controls */}
          <div className="flex flex-col gap-6 pt-20 w-64">
            <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Settings size={20} />
                </div>
                <h3 className="font-bold text-gray-800">Settings</h3>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium"
              >
                <span className="flex items-center gap-2">
                  {isDarkMode ? <Sun size={16} className="text-orange-500"/> : <Moon size={16} className="text-blue-600"/>}
                  Theme
                </span>
                <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border shadow-sm">{isDarkMode ? 'Dark' : 'Light'}</span>
              </button>
            </div>

            <div className="bg-[#4b2e83] p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#b7a57a] rounded-full opacity-20 blur-2xl"></div>
              <h3 className="font-bold mb-2">UWpedia v1.0</h3>
              <p className="text-sm text-purple-200 leading-relaxed">
                Interactive prototype featuring iPhone 15 Pro styling, real UW mock data, and Gemini-powered assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen flex justify-center items-center p-8 font-sans selection:bg-purple-200 transition-colors duration-500 ${isDarkMode ? 'bg-[#111]' : 'bg-[#eef0f4]'}`}>
      <div className="flex gap-12 items-start">
        
        {/* IPHONE 15 PRO SVG FRAME */}
        <div className={`relative ${isDarkMode ? 'dark' : ''}`}>
           <Iphone15Pro className="h-[852px] w-auto drop-shadow-2xl">
              <div className={`h-full w-full flex flex-col relative ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
                 
                 {/* No Top Bar (Removed as requested) */}

                 {/* Screens */}
                 <div className="flex-1 overflow-hidden relative">
                    {currentTab === 'home' && <HomeScreen isDarkMode={isDarkMode} />}
                    {currentTab === 'schedule' && <ScheduleScreen isDarkMode={isDarkMode} />}
                    {currentTab === 'profile' && <ProfileScreen isDarkMode={isDarkMode} />}
                    {currentTab === 'likes' && (
                      <div className="h-full flex items-center justify-center text-gray-400 flex-col gap-4 pt-12">
                        <div className="p-6 bg-gray-100 rounded-full dark:bg-gray-800">
                           <Heart size={40} />
                        </div>
                        <p>Saved Items</p>
                      </div>
                    )}
                    <ChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} isDarkMode={isDarkMode} />
                 </div>

                 {/* Floating Bottom Navigation */}
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800 p-2 flex justify-between items-center z-40">
                    <button 
                      onClick={() => setCurrentTab('home')}
                      className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        currentTab === 'home' 
                        ? `${UW_PURPLE} text-white shadow-lg shadow-purple-900/20` 
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                       <Home size={24} />
                    </button>

                    <button 
                      onClick={() => setCurrentTab('likes')} 
                      className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        currentTab === 'likes' 
                        ? `${UW_PURPLE} text-white shadow-lg shadow-purple-900/20` 
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                       <Heart size={24} />
                    </button>

                    <button 
                      onClick={() => setIsChatOpen(true)}
                      className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                         isChatOpen 
                         ? `${UW_PURPLE} text-white shadow-lg shadow-purple-900/20`
                         : 'text-[#4b2e83] dark:text-[#b7a57a] hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                       <Sparkles size={24} fill="currentColor" />
                    </button>

                    <button 
                      onClick={() => setCurrentTab('schedule')} 
                      className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        currentTab === 'schedule' 
                        ? `${UW_PURPLE} text-white shadow-lg shadow-purple-900/20` 
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                       <Calendar size={24} />
                    </button>

                    <button 
                      onClick={() => setCurrentTab('profile')}
                      className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        currentTab === 'profile' 
                        ? `${UW_PURPLE} text-white shadow-lg` 
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                       <User size={24} />
                    </button>
                 </div>

                 {/* Home Indicator */}
                 <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[130px] h-[5px] bg-gray-300/80 dark:bg-gray-600/80 rounded-full z-50"></div>
              </div>
           </Iphone15Pro>
        </div>

        {/* Demo Controls */}
        <div className="flex flex-col gap-6 pt-20 w-64">
           <div className="bg-white p-6 rounded-3xl shadow-xl flex flex-col gap-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                  <Settings size={20} />
                </div>
                <h3 className="font-bold text-gray-800">Settings</h3>
             </div>
             
             <button 
              onClick={toggleDarkMode}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium"
             >
               <span className="flex items-center gap-2">
                 {isDarkMode ? <Sun size={16} className="text-orange-500"/> : <Moon size={16} className="text-blue-600"/>}
                 Theme
               </span>
               <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border shadow-sm">{isDarkMode ? 'Dark' : 'Light'}</span>
             </button>

              <button 
              onClick={() => setOnboardingComplete(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700 font-medium"
             >
               <span className="flex items-center gap-2">
                 <LogOut size={16} className="text-gray-500"/>
                 Logout / Reset
               </span>
               <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border shadow-sm">Reset</span>
             </button>
           </div>

           <div className="bg-[#4b2e83] p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#b7a57a] rounded-full opacity-20 blur-2xl"></div>
              <h3 className="font-bold mb-2">UWpedia v1.0</h3>
              <p className="text-sm text-purple-200 leading-relaxed">
                Interactive prototype featuring iPhone 15 Pro styling, real UW mock data, and Gemini-powered assistance.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default App;