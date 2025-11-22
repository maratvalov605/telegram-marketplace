import React, { useState, useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    onSendMessage(trimmedMessage);
    setMessage('');

    // Сброс высоты textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Авто-высота textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputContainer}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Напишите сообщение..."
            style={styles.textarea}
            disabled={disabled}
            rows={1}
          />

          <button
            type="submit"
            style={{
              ...styles.sendButton,
              ...(message.trim() ? styles.sendButtonActive : {})
            }}
            disabled={!message.trim() || disabled}
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderTop: '1px solid #e0e0e0',
    padding: '16px',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '24px',
    padding: '8px 8px 8px 16px',
  },
  textarea: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    resize: 'none' as const,
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.4,
    maxHeight: '120px',
    minHeight: '20px',
  },
  sendButton: {
    border: 'none',
    background: '#ccc',
    color: 'white',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  sendButtonActive: {
    background: '#0088cc',
    cursor: 'pointer',
  },
};