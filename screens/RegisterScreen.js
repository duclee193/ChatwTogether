import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [userInfo, setUserInfo] = useState({ name: "", email: "", password: "", image: "" });
  const navigation = useNavigation();

  const handleRegister = () => {
    axios
      .post("https://chatapp-m0q8.onrender.com/register", userInfo)
      .then(() => {
        Alert.alert("Registration successful", "You have been registered successfully");
        setUserInfo({ name: "", email: "", password: "", image: "" });
      })
      .catch(() => Alert.alert("Registration Error", "An error occurred while registering"));
  };

  const handleChange = (field, value) => setUserInfo((prev) => ({ ...prev, [field]: value }));

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.inner}>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.subHeader}>Register to your Account</Text>

        {["name", "email", "password", "image"].map((field) => (
          <View key={field} style={styles.inputContainer}>
            <Text style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
            <TextInput
              value={userInfo[field]}
              onChangeText={(text) => handleChange(field, text)}
              style={styles.input}
              placeholder={`Enter your ${field}`}
              secureTextEntry={field === "password"}
            />
          </View>
        ))}

        <Pressable onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.signInLink}>
          <Text style={styles.signInText}>Already have an account? Sign in</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" },
  inner: { alignItems: "center", width: "80%" },
  header: { color: "#4A55A2", fontSize: 17, fontWeight: "600" },
  subHeader: { fontSize: 17, fontWeight: "600", marginTop: 15 },
  inputContainer: { marginTop: 20 },
  label: { fontSize: 18, fontWeight: "600", color: "gray" },
  input: {
    fontSize: 18,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
  },
  button: {
    width: 200,
    backgroundColor: "#4A55A2",
    padding: 15,
    marginTop: 50,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  signInLink: { marginTop: 15 },
  signInText: { textAlign: "center", color: "gray", fontSize: 16 },
});

export default RegisterScreen;
