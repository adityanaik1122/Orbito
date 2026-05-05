import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Loader2, Trash2, MapPin, Compass, Ticket, MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QUICK_PROMPTS = [
  { label: '5 days in Tokyo', icon: '🇯🇵' },
  { label: 'Best tours in Rome', icon: '🇮🇹' },
  { label: 'Budget for Bali trip', icon: '🇮🇩' },
  { label: 'Weekend in Paris', icon: '🇫🇷' },
  { label: 'Family trip to Dubai', icon: '🇦🇪' },
  { label: 'Solo travel Southeast Asia', icon: '🌏' },
];

const INTENT_CONFIG = {
  plan:  { label: 'Planning',  color: 'bg-violet-100 text-violet-700', icon: Compass },
  tours: { label: 'Tours',     color: 'bg-amber-100 text-amber-700',   icon: Ticket },
  chat:  { label: 'Travel AI', color: 'bg-blue-100 text-blue-700',     icon: MessageCircle },
};

// ── Simple markdown renderer ─────────────────────────────────────────────────
function renderMarkdown(text) {
  if (!text) return [];
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('---')) {
      elements.push(<hr key={i} className="my-3 border-gray-200" />);
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4 && !line.slice(2, -2).includes('**')) {
      elements.push(
        <p key={i} className="font-bold text-gray-900 mt-3 mb-1 first:mt-0">
          {line.slice(2, -2)}
        </p>
      );
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <div key={i} className="flex items-start gap-1.5 my-0.5">
          <span className="text-[#0B3D91] mt-1 text-xs flex-shrink-0">•</span>
          <span>{inlineFormat(line.slice(2))}</span>
        </div>
      );
    } else if (/^[🕘🕙🕚🕛🕐🕑🕒🕓🕔🕕🕖🕗🍽️🌆🌅🌇]/.test(line)) {
      elements.push(
        <div key={i} className="my-1 pl-1">
          {inlineFormat(line)}
        </div>
      );
    } else if (line.trim() === '') {
      if (i > 0 && elements.length > 0) {
        elements.push(<div key={i} className="h-1.5" />);
      }
    } else {
      elements.push(
        <p key={i} className="my-0.5">
          {inlineFormat(line)}
        </p>
      );
    }
    i++;
  }
  return elements;
}

function inlineFormat(text) {
  // Split on **bold** and *italic* markers
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx} className="italic text-gray-600">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, onOpenPlanner }) {
  const isUser = msg.role === 'user';
  const intent = msg.intent;
  const IntentCfg = intent ? INTENT_CONFIG[intent] : null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#0B3D91] flex items-center justify-center flex-shrink-0 mr-2 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? '' : 'flex-1'}`}>
        {!isUser && IntentCfg && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${IntentCfg.color}`}>
              <IntentCfg.icon className="w-3 h-3" />
              {IntentCfg.label}
            </span>
          </div>
        )}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[#0B3D91] text-white rounded-br-sm'
            : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-bl-sm'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{msg.content}</p>
          ) : (
            <div className="prose-sm">
              {renderMarkdown(msg.content)}
              {msg.streaming && (
                <span className="inline-block w-0.5 h-4 bg-[#0B3D91] ml-0.5 animate-pulse" />
              )}
            </div>
          )}
        </div>
        {!isUser && !msg.streaming && msg.messageType === 'itinerary' && msg.content && (
          <button
            onClick={() => onOpenPlanner(msg.content)}
            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-[#0B3D91] hover:text-[#092C6B] bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Open in Planner
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────────
export default function AIChatWidget() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  // Stable userId: auth user id or localStorage guest id
  const userId = user?.id || (() => {
    let gid = localStorage.getItem('orbi_guest_id');
    if (!gid) { gid = 'guest-' + Math.random().toString(36).slice(2); localStorage.setItem('orbi_guest_id', gid); }
    return gid;
  })();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    const msg = text.trim();
    if (!msg || isStreaming) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setIsStreaming(true);

    // Add streaming placeholder
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', streaming: true, intent: null, messageType: null },
    ]);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message: msg }),
        signal: ctrl.signal,
      });

      if (!response.ok) throw new Error('Server error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? ''; // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (raw === '[DONE]') break;

          try {
            const event = JSON.parse(raw);

            if (event.type === 'intent') {
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], intent: event.intent };
                return msgs;
              });
            } else if (event.type === 'token') {
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = {
                  ...msgs[msgs.length - 1],
                  content: msgs[msgs.length - 1].content + event.token,
                };
                return msgs;
              });
            } else if (event.type === 'done') {
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = {
                  ...msgs[msgs.length - 1],
                  streaming: false,
                  messageType: event.messageType,
                };
                return msgs;
              });
            } else if (event.type === 'error') {
              setMessages((prev) => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = {
                  role: 'assistant',
                  content: 'Sorry, something went wrong. Please try again.',
                  streaming: false,
                };
                return msgs;
              });
            }
          } catch { /* malformed JSON — skip */ }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages((prev) => {
          const msgs = [...prev];
          const last = msgs[msgs.length - 1];
          if (last?.streaming) {
            msgs[msgs.length - 1] = {
              role: 'assistant',
              content: 'Sorry, I couldn\'t connect to the server. Make sure the backend is running.',
              streaming: false,
            };
          }
          return msgs;
        });
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming, userId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleClear = async () => {
    setMessages([]);
    try {
      await fetch(`${API_BASE}/chat/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
    } catch { /* ignore */ }
  };

  const handleOpenPlanner = (itineraryText) => {
    // Extract destination from itinerary text
    const match = itineraryText.match(/Day \d.*?([\w\s,]+)\s+Itinerary/i)
      || itineraryText.match(/\*\*[\d]+-Day ([\w\s]+) Itinerary\*\*/i);
    const destination = match?.[1]?.trim() || '';
    navigate('/plan', { state: { prompt: destination ? `Plan a trip to ${destination}` : '', aiText: itineraryText } });
    setIsOpen(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0B3D91] hover:bg-[#092C6B] text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
            aria-label="Open AI travel assistant"
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 right-6 z-50 w-[420px] h-[620px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 96px)' }}
          >
            {/* Header */}
            <div className="bg-[#0B3D91] px-4 py-3.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">Orbi</p>
                  <p className="text-blue-200 text-[11px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    AI Travel Assistant · Powered by Groq
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!isEmpty && (
                  <button
                    onClick={handleClear}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-blue-200 hover:text-white"
                    title="Clear conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-blue-200 hover:text-white"
                  aria-label="Close"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
              {isEmpty ? (
                <div className="h-full flex flex-col justify-center">
                  {/* Welcome */}
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-[#0B3D91]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-7 h-7 text-[#0B3D91]" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base">Ask me anything about travel</h3>
                    <p className="text-gray-500 text-xs mt-1">Plan trips, find tours, get destination tips</p>
                  </div>

                  {/* Quick prompts */}
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_PROMPTS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => sendMessage(p.label)}
                        className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-200 hover:border-[#0B3D91] hover:bg-blue-50 rounded-xl text-xs font-medium text-gray-700 hover:text-[#0B3D91] transition-all text-left"
                      >
                        <span className="text-base leading-none">{p.icon}</span>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <MessageBubble key={idx} msg={msg} onOpenPlanner={handleOpenPlanner} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex gap-2 items-end">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about destinations, tours, planning..."
                    rows={1}
                    disabled={isStreaming}
                    className="w-full resize-none px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 focus:border-[#0B3D91] transition-all disabled:opacity-50 bg-gray-50 max-h-28"
                    style={{ overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden' }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px';
                    }}
                  />
                </div>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isStreaming || !input.trim()}
                  className="w-9 h-9 bg-[#0B3D91] hover:bg-[#092C6B] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                  aria-label="Send"
                >
                  {isStreaming
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Orbi uses AI · May make mistakes · Verify important info
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
