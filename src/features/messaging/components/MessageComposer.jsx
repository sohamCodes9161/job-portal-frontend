import { useState } from "react";
import { IconSend } from "@/shared/components/icons";

const MessageComposer = ({ onSend, sending, placeholder = "Write a message..." }) => {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || sending) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="message-composer">
      <textarea
        className="message-composer__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        aria-label="Write a message"
      />
      <button
        type="button"
        className="btn btn--primary btn--icon"
        onClick={submit}
        disabled={sending || !value.trim()}
        aria-label="Send message"
      >
        <IconSend />
      </button>
    </div>
  );
};

export default MessageComposer;
