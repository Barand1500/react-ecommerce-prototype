import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const QUICK_REPLIES = [
  'Sipariş durumumu öğrenmek istiyorum',
  'İade işlemi nasıl yapılır?',
  'Kargo takibi',
  'Ürün hakkında bilgi almak istiyorum'
];

const BOT_RESPONSES: Record<string, string> = {
  'sipariş': 'Sipariş durumunuzu kontrol etmek için "Hesabım" sayfasından "Siparişlerim" bölümüne bakabilirsiniz. Sipariş numaranızı paylaşırsanız size yardımcı olabilirim.',
  'iade': 'İade işlemi için ürünü teslim aldıktan sonra 14 gün içinde başvuru yapabilirsiniz. Ürünün kullanılmamış ve orijinal ambalajında olması gerekmektedir. İade talebinizi "Hesabım > Siparişlerim" bölümünden oluşturabilirsiniz.',
  'kargo': 'Kargo takibi için sipariş onay mailinde gönderilen takip numarasını kullanabilirsiniz. Genellikle siparişler 1-3 iş günü içinde kargoya verilmektedir.',
  'ürün': 'Hangi ürün hakkında bilgi almak istiyorsunuz? Ürün adını veya kategorisini yazarsanız size detaylı bilgi verebilirim.',
  'merhaba': 'Merhaba! 👋 Güzel Teknoloji\'ye hoş geldiniz. Size nasıl yardımcı olabilirim?',
  'teşekkür': 'Rica ederim! Başka bir sorunuz olursa yardımcı olmaktan memnuniyet duyarım. İyi günler! 😊',
  'fiyat': 'Fiyat bilgisi için ilgili ürün sayfasını ziyaret edebilirsiniz. Kampanyalı ürünlerimiz için ana sayfamızı kontrol etmenizi öneririm.',
  'indirim': 'Güncel kampanya ve indirimlerimizi ana sayfamızda bulabilirsiniz. Ayrıca e-bültenimize abone olarak özel indirimlerde haberdar olabilirsiniz!',
  'ödeme': 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeleriniz 256-bit SSL ile güvence altındadır.',
  'default': 'Anlıyorum. Size daha iyi yardımcı olabilmem için lütfen sorunuzu biraz daha detaylandırır mısınız? Veya 0850 123 45 67 numaralı müşteri hizmetlerimizi arayabilirsiniz.'
};

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Merhaba! 👋 Ben GT. Sizin şahsi asistanınız olarak nasıl yardımcı olabilirim?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [keyword, response] of Object.entries(BOT_RESPONSES)) {
      if (keyword !== 'default' && lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    return BOT_RESPONSES.default;
  };

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(messageText),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[500] w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:shadow-blue-500/60 transition-shadow"
          >
            <MessageCircle size={28} />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[500] w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Güzel Asistan</h3>
                  <p className="text-blue-200 text-xs">Çevrimiçi</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Minimize2 size={18} className="text-white" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end gap-2 ${message.isBot ? '' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.isBot 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' 
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {message.isBot ? <Bot size={16} /> : <User size={16} />}
                      </div>
                      <div className={`max-w-[75%] p-3 rounded-2xl ${
                        message.isBot 
                          ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-md shadow-sm' 
                          : 'bg-blue-600 text-white rounded-br-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-[10px] mt-1 ${message.isBot ? 'text-slate-400' : 'text-blue-200'}`}>
                          {message.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Bot size={16} className="text-blue-600" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-md shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 2 && (
                  <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 mb-2">Hızlı seçenekler:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(reply)}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!inputValue.trim()}
                      className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
