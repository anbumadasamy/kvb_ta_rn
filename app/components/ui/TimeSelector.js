import { View, TextInput, StyleSheet, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function TimeSelector({
  mandatory,
  startDateOnPress,
  startDate,
  startTimeOnpress,
  startTime,
}) {
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>Start date:{mandatory}</Text>
          <Pressable style={styles.pressable} onPress={startDateOnPress}>
            {startDate ? (
              <Text style={styles.text}>{startDate}</Text>
            ) : (
              <Text style={styles.textHint}>Start date</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>

        <View style={styles.inputTextContainerRight}>
          <Text style={styles.label}>Start Time:{mandatory}</Text>
          <Pressable style={styles.pressable} onPress={startTimeOnpress}>
            {startTime ? (
              <Text style={styles.text}>{startTime}</Text>
            ) : (
              <Text style={styles.textHint}>Start Time</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="access-time" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputTextContainerLeft: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 20,
    marginRight: 10,
  },
  inputTextContainerRight: {
    flex: 1,
    flexDirection: "column",
    marginBottom: 20,
    marginLeft: 10,
  },
  label: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginBottom: 10,
  },
  pressable: {
    flexDirection: "row",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_dark,
  },
  textHint: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  },
});
