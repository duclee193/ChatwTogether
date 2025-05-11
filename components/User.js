import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { UserType } from "../UserContext";

const User = ({ item }) => {
  const { userId, setUserId } = useContext(UserType);
  const [requestSent, setRequestSent] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:8000/friend-requests/sent/${userId}`
        );

        const data = await response.json();
        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(
          `http://10.0.2.2:8000//friends/${userId}`
        );

        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("error retrieving user friends", response.status);
        }
      } catch (error) {
        console.log("Error message", error);
      }
    };

    fetchUserFriends();
  }, []);
  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch(
        "http://10.0.2.2:8000/friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ currentUserId, selectedUserId }),
        }
      );

      if (response.ok) {
        setRequestSent(true);
      }
    } catch (error) {
      console.log("error message", error);
    }
  };
  console.log("friend requests sent", friendRequests);
  console.log("user friends", userFriends);  return (
    <Pressable
      style={styles.userContainer}
    >
      <View style={styles.avatarContainer}>
        <Image
          style={styles.avatar}
          source={{ uri: item.image }}
        />
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{item?.name}</Text>
        <Text style={styles.userEmail}>{item?.email}</Text>
      </View>
      {userFriends.includes(item._id) ? (
        <Pressable
          style={[styles.actionButton, styles.friendsButton]}
        >
          <Text style={styles.buttonText}>Friends</Text>
        </Pressable>
      ) : requestSent ||
        friendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={[styles.actionButton, styles.requestSentButton]}
        >
          <Text style={styles.buttonText}>
            Request Sent
          </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={[styles.actionButton, styles.addFriendButton]}
        >
          <Text style={styles.buttonText}>
            Add Friend
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
};

export default User;

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 10,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#FDFDFD',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  avatarContainer: {
    marginRight: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  userInfoContainer: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userEmail: {
    marginTop: 4,
    color: "gray",
    fontSize: 14,
    flexWrap: 'wrap',
  },
  actionButton: {
    padding: 10,
    minWidth: 105,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendsButton: {
    backgroundColor: "#82CD47",
  },
  requestSentButton: {
    backgroundColor: "gray",
  },
  addFriendButton: {
    backgroundColor: "#567189",
  },
  buttonText: {
    textAlign: "center", 
    color: "white", 
    fontSize: 13,
    fontWeight: '500',
  }
});
