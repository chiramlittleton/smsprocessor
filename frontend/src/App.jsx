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
  const [selectedMessageId, setSelectedMessageId] = useState("");
  const [sendMessageResponse, setSendMessageResponse] = useState("");
  const [uploadResponse, setUploadResponse] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    let query = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:5050/api/messages?${query}`);
    const data = await response.json();

    // ✅ Fetch media for each message
    const messagesWithMedia = await Promise.all(
      data.messages.map(async (msg) => {
        const mediaResponse = await fetch(`http://localhost:5050/api/messages/${msg.id}/media`);
        const mediaData = await mediaResponse.json();
        return { ...msg, media: mediaData.media || [] };
      })
    );

    setMessages(messagesWithMedia);
  };

  const handleMessageChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
        setSendMessageResponse("✅ Message sent successfully!");
        fetchMessages(); // Refresh messages list
      } else {
        setSendMessageResponse(`❌ Error: ${data.message || "Failed to send message"}`);
      }
    } catch (error) {
      setSendMessageResponse("❌ Network error. Please try again.");
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
        <button type="submit">Send Message</button>
      </form>

      {/* ✅ Message sending response directly below the form */}
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

      <h2 style={{ textAlign: "center" }}>Messages</h2>
      <table border="1" style={{ width: "100%", textAlign: "left", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Message</th>
            <th>Status</th>
            <th>Media</th> {/* ✅ Added media column */}
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.from}</td>
              <td>{msg.to}</td>
              <td>{msg.message}</td>
              <td>{msg.status}</td>
              <td>
                {msg.media.length > 0 ? (
                  msg.media.map((mediaItem, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5050/${mediaItem.file_path}`} // ✅ Adjust URL if needed
                      alt="Media"
                      style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "5px" }}
                    />
                  ))
                ) : (
                  "No Media"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
