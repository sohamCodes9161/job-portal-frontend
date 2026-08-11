import { useEffect, useRef, useState } from "react";
import { messagesApi } from "../api/messagesApi";
import MessageComposer from "./MessageComposer";
import EmptyState from "@/shared/components/EmptyState";
import { IconMessageSquare, IconAlertCircle } from "@/shared/components/icons";

const MessageThread = ({ applicationId, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchThread = async () => {
    try {
      setError("");
      const res = await messagesApi.getThread(applicationId);
      setMessages(res.data.messages || []);
    } catch (err) {
      setError("Couldn't load this conversation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async (body) => {
    // Optimistic bubble so the composer feels instant
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      body,
      sender: { _id: currentUserId },
      createdAt: new Date().toISOString(),
      pending: true,
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setSending(true);

    try {
      const res = await messagesApi.send(applicationId, body);
      setMessages((prev) =>
        prev.map((m) => (m._id === optimisticMessage._id ? res.data.data : m))
      );
    } catch (err) {
      // Roll back the optimistic bubble and let the person know it failed
      setMessages((prev) => prev.filter((m) => m._id !== optimisticMessage._id));
      setError("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="message-thread">
        <div className="message-thread__body">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton-block" style={{ height: 36, width: "60%", marginBottom: 10, borderRadius: 12 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="message-thread">
      {error && (
        <div className="alert alert--error mb-4">
          <IconAlertCircle />
          <span>{error}</span>
        </div>
      )}

      <div className="message-thread__body">
        {messages.length === 0 ? (
          <EmptyState
            icon={<IconMessageSquare />}
            title="No messages yet"
            description="Start the conversation below."
          />
        ) : (
          messages.map((msg) => {
            const isMine = msg.sender?._id === currentUserId;
            return (
              <div
                key={msg._id}
                className={`message-bubble-row${isMine ? " message-bubble-row--mine" : ""}`}
              >
                <div className={`message-bubble${isMine ? " message-bubble--mine" : ""}${msg.pending ? " message-bubble--pending" : ""}`}>
                  <p>{msg.body}</p>
                  <span className="message-bubble__time">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <MessageComposer onSend={handleSend} sending={sending} />
    </div>
  );
};

export default MessageThread;
