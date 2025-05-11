import { StyleSheet, Text, View, Alert, ScrollView, Dimensions, SafeAreaView, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { UserType } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import axios from "axios";
import User from "../components/User";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId } = useContext(UserType);
  const [users, setUsers] = useState([]);

  const handleLogout = async () => {
    try {
      // Clear the auth token
      await AsyncStorage.removeItem("authToken");

      // Reset user ID in context
      setUserId("");

      // Navigate to login screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      Alert.alert("Logout Error", "There was an error logging out");
      console.log("Logout error:", error);
    }
  };  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        height: 60,
        shadowOpacity: 0,
        elevation: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      },
      headerLeft: () => (
        <Text style={styles.headerTitle}>Chat Together</Text>
      ),
      headerRight: () => (
        <View style={styles.headerIconsContainer}>
          <Ionicons
            onPress={() => navigation.navigate("Chats")}
            name="chatbox-ellipses-outline"
            size={24}
            color="black"
            style={styles.headerIcon}
          />
          <MaterialIcons
            onPress={() => navigation.navigate("Friends")}
            name="people-outline"
            size={24}
            color="black"
            style={styles.headerIcon}
          />
          <MaterialIcons
            onPress={handleLogout}
            name="logout"
            size={24}
            color="black"
            style={styles.headerIcon}
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      setUserId(userId);

      axios
        .get(`http://10.0.2.2:8000/users/${userId}`) // Using Android emulator endpoint
        // .get(`http://localhost:8000/users/${userId}`) // Web endpoint
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log("error retrieving users", error);
        });
    };

    fetchUsers();
  }, []);  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to false when users are loaded
    if (users.length > 0 || users.length === 0) {
      setIsLoading(false);
    }
  }, [users]);

  console.log("users", users);
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#567189" />
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
        >
          <View style={styles.userListContainer}>
            {users.length > 0 ? (
              users.map((item, index) => (
                <User key={index} item={item} />
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No users found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Header styles
  headerTitle: {
    fontSize: 16, 
    fontWeight: "bold",
    marginLeft: 5,
    height: '100%',
    textAlignVertical: 'center',
    paddingBottom: 0,
  },
  headerIconsContainer: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "flex-end",
    width: 120, // Fixed width to ensure space for all icons
    paddingBottom: 0,
    height: '100%',
  },
  headerIcon: {
    marginHorizontal: 6,
    padding: 5, // Larger touch target
    alignSelf: 'center',
  },
  
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  userListContainer: {
    padding: 15,
    paddingBottom: 80, // Extra padding at bottom for better scrolling
    width: '100%',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    height: height * 0.5,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: height * 0.8,
  }
});
