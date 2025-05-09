const [isTyping, setIsTyping] = useState(false);

useEffect(() => {
  socket.on(`typing-${recepientId}`, () => {
    setIsTyping(true);
  });

  socket.on(`stop-typing-${recepientId}`, () => {
    setIsTyping(false);
  });

  return () => {
    socket.off(`typing-${recepientId}`);
    socket.off(`stop-typing-${recepientId}`);
  };
}, [recepientId]);

const handleTyping = () => {
  socket.emit(`typing-${recepientId}`);
  setTimeout(() => {
    socket.emit(`stop-typing-${recepientId}`);
  }, 1000); // Dừng khi không còn gõ trong 1s
};

return (
  <View style={{ flex: 1 }}>
    {/* Các phần khác */}
    {isTyping && <Text>Recipient is typing...</Text>}

    <TextInput
      value={message}
      onChangeText={(text) => {
        setMessage(text);
        handleTyping();
      }}
      placeholder="Type a message..."
    />
  </View>
);
