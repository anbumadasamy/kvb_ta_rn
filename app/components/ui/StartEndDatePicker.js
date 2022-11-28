import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";

export default function StartEndDatePicker({
  onPressStart,
  onPressEnd,
  startDate,
  endDate,
  noOfDays,
}) {
  return (
    <View style={styles.mainContainer}>
      <Pressable style={styles.dateContainer} onPress={onPressStart}>
        <MaterialIcons name="date-range" size={24} color="#A2A2A2" />
        <Text style={styles.dateText}>{startDate}</Text>
      </Pressable>

      <Pressable style={styles.dateContainer} onPress={onPressEnd}>
        <MaterialIcons name="date-range" size={24} color="#A2A2A2" />
        <Text style={styles.dateText}>{endDate}</Text>
      </Pressable>

      <View style={styles.dateContainer}>
        {/* { noOfDays != "" && <Text>{noOfDays} {noOfDays == 1 ? "Day" : "Days"}</Text> } */}
        <Text >
          {noOfDays == "" ? `No Of Days: 0` : `No Of Days: ${noOfDays}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    marginStart: 10,
    fontSize: 14,
  },
});
