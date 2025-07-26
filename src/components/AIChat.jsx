import React, { useState, useEffect, useRef } from "react";
import "../styles/AIChat.css";

const AIChat = () => {
  const API_ENDPOINT = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
  const API_KEY = "sk-default-UVwrao9HeTWXak5gb3d0cf1VWSZ3O4Bv";
  const AGENT_ID = "68834d2dc9c08f1592800f8c";
  const USER_ID = "kungumapriyaamkp5@gmail.com";
  const SESSION_ID = "my-unique-hackathon-session-12345";

  const [messages, setMessages] = useState([
    { type: "status", text: "Type your message and press Enter or click 'Send' to chat!" }
  ]);
  const [input, setInput] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);

  const chatLogRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  const speechSynthesis = window.speechSynthesis;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  };

  const speak = (text) => {
    if (!window.SpeechSynthesisUtterance || !speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Cancel ongoing speech
    if (speechSynthesis.speaking) speechSynthesis.cancel();

    const userMsg = { type: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const typingMsg = { type: "status", text: "⏳ Agent is typing..." };
    setMessages(prev => [...prev, typingMsg]);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify({
          user_id: USER_ID,
          agent_id: AGENT_ID,
          session_id: SESSION_ID,
          message: userMsg.text
        }),
      });

      const data = await res.json();
      const botResponse = data.response;
      setMessages(prev => [...prev.filter(m => m.text !== typingMsg.text), { type: "agent", text: botResponse }]);
      speak(botResponse);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev.filter(m => m.text !== typingMsg.text), { type: "error", text: "❌ Error fetching response." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const startListening = () => {
    if (!recognition) return;
    if (speechSynthesis.speaking) speechSynthesis.cancel();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend();
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div className="ai-chat-wrapper">
      <h1>CampusLink Chat</h1>
      <div className="container">
        <div id="chat-log" ref={chatLogRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}-message`}>
              {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
        />
        <div className="button-group">
          <button onClick={handleSend}>Send</button>
          <button onClick={startListening} disabled={listening}>
            {listening ? "Listening..." : "Speak Input"}
          </button>
          <button onClick={() => speechSynthesis.cancel()} disabled={!speaking}>
            Stop Speaking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;