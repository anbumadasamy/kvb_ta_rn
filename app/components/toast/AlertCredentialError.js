import { Alert } from "react-native";

export default function AlertCredentialError(error, navigation) {
  Alert.alert("Credential Error", error, [
    {
      text: "Logout",
      onPress: () => navigation.navigate("LoginScreen"),
      style: "default",
    },
  ]);
}
