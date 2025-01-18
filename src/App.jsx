import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useChatStore from "./store/store";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import SubmitButton from "./components/SubmitButton";
import { SolutionSteps } from "./components/SolutionSteps";
import { MathGraph } from "./components/MathGraph";

function App() {
  const { messages, addMessage } = useChatStore();
  const [userInput, setUserInput] = useState("");
  const chatBoxRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault(); // Handle both button click and form submit
    if (!userInput.trim()) return;

    addMessage({ sender: "user", text: userInput });

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: userInput,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.response,
        steps: response.data.steps,
        graph: response.data.graph,
      };

      addMessage(botMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage({
        sender: "bot",
        text: "Error: Unable to process your request.",
      });
    }

    setUserInput("");
  };

  return (
    <div className="outter-container">
      <div className="app-container">
        <div className="chat-container">
          <Header />

          <div className="messages-container" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                <div className="message">
                  <div className="message-content">{msg.text}</div>

                  {msg.steps && (
                    <SolutionSteps msg={msg} />
                  )}

                  {msg.graph && (
                    <MathGraph msg={msg} />
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your math question..."
              className="message-input"
            />
            <SubmitButton />
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
