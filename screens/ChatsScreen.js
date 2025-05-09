import { StyleSheet, Text, View, ScrollView, Pressable, TextInput, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import { useNavigation } from "@react-navigation/native";
import UserChat from "../components/UserChat";

const ChatsScreen = () => {
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();

  useEffect(() => {
    const acceptedFriendsList = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://chatapp-m0q8.onrender.com/accepted-friends/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setAcceptedFriends(data);
        } else {
          setError("Failed to load friends.");
        }
      } catch (error) {
        setError("Error fetching friends.");
        console.log("error showing the accepted friends", error);
      } finally {
        setLoading(false);
      }
    };

    acceptedFriendsList();
  }, [userId]);

  const filteredFriends = acceptedFriends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredFriends.length === 0 ? (
          <Text>No friends found.</Text>
        ) : (
          <Pressable>
            {filteredFriends.map((item, index) => (
              <UserChat key={index} item={item} />
            ))}
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    margin: 10,
    paddingLeft: 10,
    borderRadius: 5,
  }
});

export default ChatsScreen;
