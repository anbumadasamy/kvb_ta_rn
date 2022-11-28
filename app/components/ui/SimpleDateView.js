import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Alert } from "react-native";
import moment from "moment";

export default function SimpleDateView({
  date,
}) {
  return (
    <View style={styles.dateView}>
      <MaterialCommunityIcons name="calendar" size={22} color="#A2A2A2" />
      <Text style={styles.dateText}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dateView: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    marginStart: 10,
  },
});
