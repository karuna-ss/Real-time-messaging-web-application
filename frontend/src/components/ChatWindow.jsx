
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

const SOCKET_URL = "http://localhost:5000";

function ChatWindow({ conversation, currentUser, onConversationUpdate }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const otherUser = conversation.participants?.find(
    (participant) => participant._id !== currentUser?._id
  );

  useEffect(() => {
    let cancelled = false;

    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    const addMessage = (message) => {
      setMessages((previous) => {
        if (previous.some((item) => item._id === message._id)) {
          return previous;
        }

        return [...previous, message];
      });
    };

    socket.on("connect", () => {
      setSocketConnected(true);

      socket.emit("joinConversation", conversation._id, (result) => {
        if (!result?.success) {
          setError(result?.message || "Could not join the conversation.");
        }
      });
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("connect_error", (err) => {
      setSocketConnected(false);
      console.error("Socket connection failed:", err.message);
    });

    socket.on("newMessage", addMessage);

    const loadMessages = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/conversations/${conversation._id}/messages`
        );

        if (!cancelled) {
          setMessages(response.data.messages || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Could not load message history."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
      socket.disconnect();
    };
  }, [conversation._id]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const messageText = text.trim();

    if (!messageText || sending) return;

    setSending(true);
    setError("");

    try {
      const response = await api.post(
        `/conversations/${conversation._id}/messages`,
        { text: messageText }
      );

      const savedMessage = response.data.message;

      // The socket may already have delivered this message.
      setMessages((previous) => {
        if (previous.some((item) => item._id === savedMessage._id)) {
          return previous;
        }

        return [...previous, savedMessage];
      });

      setText("");

      onConversationUpdate({
        ...conversation,
        lastMessage: savedMessage,
        updatedAt: savedMessage.createdAt,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="chat-window">
      <header className="chat-header">
        <span className="avatar">
          {otherUser?.username?.charAt(0).toUpperCase() || "?"}
        </span>

        <div>
          <h2>{otherUser?.username || "Conversation"}</h2>
          <p>{otherUser?.email || ""}</p>
          <small className={socketConnected ? "socket-online" : "socket-offline"}>
            {socketConnected ? "Real-time connected" : "Connecting to real-time chat..."}
          </small>
        </div>
      </header>

      <div className="messages-area">
        {loading ? (
          <p className="muted-text">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="empty-messages">
            <p>No messages yet.</p>
            <span>Send the first message to get started.</span>
          </div>
        ) : (
          messages.map((message) => {
            const senderId = message.senderId?._id || message.senderId;
            const isMine =
              senderId?.toString() === currentUser?._id?.toString();

            return (
              <div
                key={message._id}
                className={`message-row ${isMine ? "mine" : "theirs"}`}
              >
                <div className="message-bubble">
                  {!isMine && (
                    <small>{message.senderId?.username || "User"}</small>
                  )}

                  <p>{message.text}</p>

                  <time>
                    {message.createdAt
                      ? new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </time>
                </div>
              </div>
            );
          })
        )}
      </div>

      {error && <p className="error-banner">{error}</p>}

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Write a message..."
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={5000}
          aria-label="Message"
          disabled={sending}
        />

        <button type="submit" disabled={sending || !text.trim()}>
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}

export default ChatWindow;
