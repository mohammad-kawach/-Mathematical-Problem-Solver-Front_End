import React, { useState } from "react";
import axios from "axios";
import useChatStore from "./store/store";
import "./App.css";

function App() {
  const { messages, addMessage } = useChatStore(); // Zustand store
  const [userInput, setUserInput] = useState("");

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to the store
    addMessage({ sender: "user", text: userInput });

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: userInput,
      });

      // Add bot response to the store
      const botMessage = { sender: "bot", text: response.data.response };

      // Check for steps and graph
      if (response.data.steps) {
        botMessage.steps = response.data.steps;
      }
      if (response.data.graph) {
        botMessage.graph = response.data.graph;
      }

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
    <>
      <nav className="p-2 navbar navbar-dark navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Math Chatbot
          </a>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Chatbot</h5>
              </div>
              <div
                className="card-body chat-box"
                style={{ height: "400px", overflowY: "auto" }}
              >
                {messages.map((msg, index) => (
                  <div key={index}>
                    <div
                      className={`d-flex mb-3 ${
                        msg.sender === "user"
                          ? "justify-content-end"
                          : "justify-content-start"
                      }`}
                    >
                      <div
                        className={`p-2 rounded ${
                          msg.sender === "user"
                            ? "bg-primary text-white"
                            : "bg-light text-dark"
                        }`}
                        style={{ maxWidth: "75%" }}
                      >
                        {msg.text}
                      </div>
                    </div>
                    {msg.steps && (
                      <div className="mb-3">
                        <strong>Steps:</strong>
                        <ul>
                          {msg.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {msg.graph && (
                      <div className="mb-3">
                        <strong>Graph:</strong>
                        <img
                          src={msg.graph}
                          alt="Graph"
                          style={{ maxWidth: "100%" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <button className="btn btn-primary" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
