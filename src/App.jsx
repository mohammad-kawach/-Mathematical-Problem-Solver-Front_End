import { useState, useRef, useEffect } from "react";
import axios from "axios";
import useChatStore from "./store/store";
import "./App.css";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import SubmitButton from "./components/SubmitButton";
import { SolutionSteps } from "./components/SolutionSteps";
import { MathGraph } from "./components/MathGraph";
import QuickActions from "./components/QuickActions";
// import StatisticsDisplay from "./components/StatisticsDisplay";
// import MatrixDisplay from "./components/MatrixDisplay";

function App() {
  const { messages, addMessage } = useChatStore();
  const [userInput, setUserInput] = useState("");
  // const [operationType, setOperationType] = useState("general"); // New state for operation type
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Add helper function to detect operation type
  const detectOperationType = (input) => {
    const input_lower = input.toLowerCase();
    if (input_lower.includes("integrate")) return "integration";
    if (
      input_lower.includes("derivative") ||
      input_lower.includes("differentiate")
    )
      return "differentiation";
    if (input_lower.includes("matrix")) return "matrix";
    if (input_lower.includes("statistics")) return "statistics";
    return "general";
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!userInput.trim()) return;

    // Detect operation type from input
    const detectedType = detectOperationType(userInput);
    // setOperationType(detectedType);

    addMessage({ sender: "user", text: userInput });

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: userInput,
        type: detectedType, // Send operation type to backend
      });

      const botMessage = {
        sender: "bot",
        text: response.data.response,
        steps: response.data.steps,
        graph: response.data.graph,
        operationType: detectedType,
        matrixData: response.data.matrix,
        statisticsData: response.data.statistics,
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

  // Add quick action buttons

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

                  {msg.steps && <SolutionSteps msg={msg} />}

                  {msg.graph && <MathGraph msg={msg} />}

                  {/* {msg.matrixData && <MatrixDisplay matrix={msg.matrixData} />} */}

                  {/* {msg.statisticsData && (
                    <StatisticsDisplay stats={msg.statisticsData} />
                  )} */}
                </div>
              </div>
            ))}
          </div>

          <QuickActions setUserInput={setUserInput} />

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
