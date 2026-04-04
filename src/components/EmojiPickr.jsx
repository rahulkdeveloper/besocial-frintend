import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickr = ({handleSelectedEmoji}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    handleSelectedEmoji(emojiData)
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        className="btn btn-light"
        onClick={() => setShowPicker(!showPicker)}
      >
        😀
      </button>

      {showPicker && (
        <div
          style={{
            position: "absolute",
            bottom: "", // adjust to show above
            zIndex: 100,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickr;
