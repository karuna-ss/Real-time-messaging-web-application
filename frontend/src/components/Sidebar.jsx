
import { useEffect, useState } from "react";
import api from "../services/api";

function Sidebar({
  user,
  conversations,
  activeConversation,
  onSelectConversation,
  onStartConversation,
  onLogout,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const searchTerm = query.trim();

    if (!searchTerm) {
      setResults([]);
      setSearchError("");
      setSearching(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setSearching(true);
      setSearchError("");

      try {
        const response = await api.get("/users/search", {
          params: { q: searchTerm },
        });

        if (!cancelled) {
          setResults(response.data.users || []);
        }
      } catch (err) {
        if (!cancelled) {
          setResults([]);
          setSearchError(
            err.response?.data?.message || "User search failed."
          );
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const getOtherParticipant = (conversation) => {
    return conversation.participants?.find(
      (participant) => participant._id !== user?._id
    );
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <div>
          <h1>ChatSpace</h1>
          <p>Signed in as {user?.username}</p>
        </div>

        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </header>

      <section className="search-section">
        <h2>Find people</h2>

        <input
          type="text"
          placeholder="Search username or email..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search users"
        />

        {searching && <p className="muted-text">Searching...</p>}
        {searchError && <p className="error-text">{searchError}</p>}

        {!searching && query.trim() && !searchError && results.length === 0 && (
          <p className="muted-text">No users found.</p>
        )}

        {results.length > 0 && (
          <div className="search-results">
            {results.map((result) => (
              <button
                className="user-result"
                key={result._id}
                onClick={() => {
                  onStartConversation(result);
                  setQuery("");
                  setResults([]);
                }}
              >
                <span className="avatar">
                  {result.username?.charAt(0).toUpperCase()}
                </span>

                <span className="user-details">
                  <strong>{result.username}</strong>
                  <small>{result.email}</small>
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="conversations-section">
        <h2>Your conversations</h2>

        {conversations.length === 0 ? (
          <p className="muted-text">No conversations yet. Search for a user!</p>
        ) : (
          conversations.map((conversation) => {
            const otherUser = getOtherParticipant(conversation);
            const isActive = activeConversation?._id === conversation._id;

            return (
              <button
                key={conversation._id}
                className={`conversation-item ${isActive ? "active" : ""}`}
                onClick={() => onSelectConversation(conversation)}
              >
                <span className="avatar">
                  {otherUser?.username?.charAt(0).toUpperCase() || "?"}
                </span>

                <span className="user-details">
                  <strong>{otherUser?.username || "Unknown user"}</strong>
                  <small>
                    {conversation.lastMessage?.text || "Start a conversation"}
                  </small>
                </span>
              </button>
            );
          })
        )}
      </section>
    </aside>
  );
}

export default Sidebar;
