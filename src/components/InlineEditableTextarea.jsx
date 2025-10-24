import React, { useState, useEffect } from "react";

export default function InlineEditableTextarea({ 
  value, 
  onSave, 
  placeholder = "Click to edit...",
  className = "" 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  // Update tempValue when value prop changes
  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleCancel();
    } else if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {isEditing ? (
        <div style={{
          border: "1px solid #60a5fa",
          borderRadius: "6px",
          padding: "8px",
          backgroundColor: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          position: "relative",
          minWidth: "200px"
        }}>
          <textarea
            style={{
              width: "100%",
              height: "80px",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              color: "#1f2937",
              border: "none",
              fontSize: "13px"
            }}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus
          />
          <div style={{
            position: "absolute",
            bottom: "6px",
            right: "8px",
            display: "flex",
            gap: "4px"
          }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "11px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: "#e5e7eb",
                color: "#374151",
                fontSize: "11px",
                padding: "4px 8px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          style={{
            border: "1px solid transparent",
            padding: "8px",
            borderRadius: "6px",
            cursor: "text",
            backgroundColor: "#f8fafc",
            minHeight: "32px",
            fontSize: "13px",
            color: "#1f2937"
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = "#93c5fd";
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = "transparent";
          }}
        >
          <p style={{ 
            whiteSpace: "pre-line", 
            margin: 0,
            color: value ? "#1f2937" : "#9ca3af"
          }}>
            {value || placeholder}
          </p>
        </div>
      )}
    </div>
  );
}