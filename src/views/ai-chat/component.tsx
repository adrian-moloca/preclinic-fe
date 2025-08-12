import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export const ChatAssistant = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "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"; // 🔐 Replace with your actual key

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: newMessages,
        }),
      });

      const data = await res.json();
      const assistantReply = data?.choices?.[0]?.message;

      if (assistantReply) {
        setMessages([...newMessages, assistantReply]);

        if (
          assistantReply.content.toLowerCase().includes("make an appointment") ||
          input.toLowerCase().includes("make an appointment")
        ) {
          alert("Navigate user to the appointments page (e.g., /appointments)");
        }
      } else {
        console.error("No reply from assistant:", data);
      }
    } catch (error) {
      console.error("Error calling OpenAI:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h6">AI Assistant</Typography>

      <Box sx={{ maxHeight: 300, overflowY: "auto", my: 2 }}>
        {messages.map((msg, i) => (
          <Typography key={i} sx={{ color: msg.role === "user" ? "blue" : "green" }}>
            <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong> {msg.content}
          </Typography>
        ))}
      </Box>

      <TextField
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me something..."
        disabled={loading}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </Button>
    </Paper>
  );
};
