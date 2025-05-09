import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";

const UserChat = ({ item }) => {
  return (
    <Pressable style={styles.chatContainer}>
      <Image
        source={{ uri: item.image }} // Giả sử mỗi người bạn có trường 'image' chứa URL ảnh đại diện
        style={styles.avatar}
      />
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatStatus}>
          {item.isOnline ? "Online" : "Offline"}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatInfo: {
    marginLeft: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  chatStatus: {
    fontSize: 14,
    color: "#777",
  },
});

export default UserChat;
