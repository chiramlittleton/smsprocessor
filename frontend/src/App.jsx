import React, { useState, useEffect } from "react";

function App() {
  const [formData, setFormData] = useState({
    from: "+1234567890",
    to: "+0987654321",
    message: "Hello, world!",
  });

  const [messages, setMessages] = useState([]);
  const [filters, setFilters] = useState({ from: "", to: "", status: "" });
  const [media, setMedia] = useState(null);
  const [sendMessageResponse, setSendMessageResponse] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    let query = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:5050/api/messages?${query}`);
    const data = await response.json();
    setMessages(data);
  };

  const handleMessageChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setSendMessageResponse("Sending...");

    const messageData = new FormData();
    messageData.append("from", formData.from);
    messageData.append("to", formData.to);
    messageData.append("message", formData.message);
    if (media) {
      messageData.append("file", media);
    }

    try {
      const response = await fetch("http://localhost:5050/api/messages", {
        method: "POST",
        body: messageData, // No need for Content-Type header; FormData sets it automatically
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSendMessageResponse("✅ Message sent successfully!");
      fetchMessages(); // Refresh message list
    } catch (error) {
      setSendMessageResponse(`❌ ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "500px", margin: "auto" }}>
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
        <label>
          <strong>Attach Media (Optional):</strong>
          <input type="file" accept="image/*" onChange={(e) => setMedia(e.target.files[0])} />
        </label>
        <button type="submit">Send Message</button>
      </form>

      {sendMessageResponse && (
        <p style={{ marginTop: "10px", fontWeight: "bold", textAlign: "center", color: sendMessageResponse.includes("✅") ? "green" : "red" }}>
          {sendMessageResponse}
        </p>
      )}

      <h2 style={{ textAlign: "center" }}>Filter Messages</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" name="from" placeholder="Filter by sender" onChange={handleFilterChange} />
        <input type="text" name="to" placeholder="Filter by recipient" onChange={handleFilterChange} />
        <select name="status" onChange={handleFilterChange}>
          <option value="">-- Select Status --</option>
          <option value="received">Received</option>
          <option value="stored">Stored</option>
          <option value="processed">Processed</option>
        </select>
        <button onClick={fetchMessages}>Apply Filters</button>
      </div>
    </div>
  );
}

export default App;
