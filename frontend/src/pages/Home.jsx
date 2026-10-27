
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }

    const loadData = async () => {
      try {
        const [profileResponse, conversationResponse] = await Promise.all([
          api.get("/auth/me"),
          api.get("/conversations"),
        ]);

        setUser(profileResponse.data.user);
        setConversations(conversationResponse.data.conversations || []);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        } else {
          setError(
            err.response?.data?.message ||
              "Could not load your chats. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate]);

  const openConversation = (conversation) => {
    setActiveConversation(conversation);
  };

  const startConversation = async (otherUser) => {
    setError("");

    try {
      const response = await api.post("/conversations", {
        userId: otherUser._id,
      });

      const conversation = response.data.conversation;

      setConversations((previous) => {
        const exists = previous.some((item) => item._id === conversation._id);

        return exists
          ? previous.map((item) =>
              item._id === conversation._id ? conversation : item
            )
          : [conversation, ...previous];
      });

      setActiveConversation(conversation);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not open this conversation."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const updateConversation = (updatedConversation) => {
    setConversations((previous) =>
      previous.map((conversation) =>
        conversation._id === updatedConversation._id
          ? updatedConversation
          : conversation
      )
    );

    setActiveConversation(updatedConversation);
  };

  if (loading) {
    return <div className="center-screen">Loading your chats...</div>;
  }

  return (
    <div className="app-shell">
      <Sidebar
        user={user}
        conversations={conversations}
        activeConversation={activeConversation}
        onSelectConversation={openConversation}
        onStartConversation={startConversation}
        onLogout={handleLogout}
      />

      <main className="main-panel">
        {error && <div className="error-banner">{error}</div>}

        {activeConversation ? (
          <ChatWindow
            key={activeConversation._id}
            conversation={activeConversation}
            currentUser={user}
            onConversationUpdate={updateConversation}
          />
        ) : (
          <div className="empty-chat">
            <div className="empty-chat-icon">✉</div>
            <h2>Your messages</h2>
            <p>Search for a user or select a conversation to get started.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
