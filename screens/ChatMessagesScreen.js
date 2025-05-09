import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, View, ScrollView, TextInput, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import { useNavigation, useRoute } from "@react-navigation/native";
import io from "socket.io-client";

const socket = io("https://chatapp-m0q8.onrender.com"); // URL backend của bạn

const ChatMessagesScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const { userId } = useContext(UserType);
  const route = useRoute();
  const { recepientId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    // Lắng nghe sự kiện trạng thái online
    socket.on(`user-online-${recepientId}`, () => {
      setIsOnline(true);
    });

    socket.on(`user-offline-${recepientId}`, () => {
      setIsOnline(false);
    });

    // Khi người dùng kết nối
    socket.emit("user-connected", userId);

    // Hủy sự kiện khi màn hình bị hủy
    return () => {
      socket.off(`user-online-${recepientId}`);
      socket.off(`user-offline-${recepientId}`);
    };
  }, [recepientId]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <Ionicons name="arrow-back" size={24} onPress={() => navigation.goBack()} />
        <Image source={{ uri: recepientId?.image }} style={{ width: 30, height: 30, borderRadius: 15 }} />
        <Text style={{ marginLeft: 10 }}>{recepientId?.name}</Text>
        <Text style={{ marginLeft: 10, color: isOnline ? "green" : "red" }}>
          {isOnline ? "Online" : "Offline"}
        </Text>
      </View>

      {/* Messages List */}
      <ScrollView>
        {messages.map((message) => (
          <Text key={message.id}>{message.text}</Text>
        ))}
      </ScrollView>

      {/* Message Input */}
      <TextInput placeholder="Type a message..." />
    </View>
  );
};

export default ChatMessagesScreen;
