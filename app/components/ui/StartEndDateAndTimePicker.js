import { Ionicons,EvilIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";

export default function StartEndDateAndTimePicker({
  onPressStartDate,
  onPressEndDate,
  onPressStartTime,
  onPressEndTime,
  startDate,
  endDate,
  startTime,
  endTime,
}) {
  return (
    <View>
      <View style={styles.mainContainer}>
        <Pressable style={styles.dateContainer} onPress={onPressStartDate}>
          <Ionicons name="calendar-outline" size={22} color="#A2A2A2" />
          <Text style={styles.dateText}>{startDate}</Text>
        </Pressable>
        <Pressable style={styles.dateContainer} onPress={onPressStartTime}>
          <EvilIcons name="clock" size={22} color="#A2A2A2" />
          <Text style={styles.dateText}>{startTime}</Text>
        </Pressable>
      </View>
      <View style={styles.mainContainer}>
        <Pressable style={styles.dateContainer} onPress={onPressEndDate}>
          <Ionicons name="calendar-outline" size={22} color="#A2A2A2" />
          <Text style={styles.dateText}>{endDate}</Text>
        </Pressable>
        <Pressable style={styles.dateContainer} onPress={onPressEndTime}>
          <EvilIcons name="clock" size={22} color="#A2A2A2" />
          <Text style={styles.dateText}>{endTime}</Text>
        </Pressable>
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
