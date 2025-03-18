import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    from: "+1234567890",
    to: "+0987654321",
    message: "Hello, world!",
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleMessageChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("http://localhost:5050/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResponseMessage("✅ Message sent successfully!");
      } else {
        setResponseMessage(`❌ Error: ${data.message || "Failed to send message"}`);
      }
    } catch (error) {
      setResponseMessage("❌ Network error. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "400px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Send SMS</h2>
      <form onSubmit={handleSendMessage} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>
          <strong>From:</strong>
          <input
            type="text"
            name="from"
            value={formData.from}
            onChange={handleMessageChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>
        <label>
          <strong>To:</strong>
          <input
            type="text"
            name="to"
            value={formData.to}
            onChange={handleMessageChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>
        <label>
          <strong>Message:</strong>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleMessageChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px", height: "60px" }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send Message
        </button>
      </form>
      {responseMessage && (
        <p style={{ marginTop: "10px", fontWeight: "bold", textAlign: "center", color: responseMessage.includes("✅") ? "green" : "red" }}>
          {responseMessage}
        </p>
      )}
    </div>
  );
}

export default App;
