import { View, Text, Button, TextInput, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";

export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable
      onPress={doLogout}
      style={{
        alignSelf: "center",
        height: 54,
        width: 260,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 80,
        marginBottom: 20,
        backgroundColor: "#007958"
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 16,
          fontFamily: "airMedium",
        }}
      >
        Logout
      </Text>
    </Pressable>
  );
};

const profile = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  const onSaveUser = async () => {
    try {
      await user?.update({
        firstName: firstName!,
        lastName: lastName!,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ textAlign: "center" }}>
        Good morning {user?.firstName} {user?.lastName}!
      </Text>

      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.inputField}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.inputField}
      />
      <Button
        onPress={onSaveUser}
        title="Update account"
        color={"#6c47ff"}
      ></Button>
      <LogoutButton />
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 40,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
