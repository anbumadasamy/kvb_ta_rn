import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function DateSelector({
  mandatory,
  startDateOnPress,
  endDateOnPress,
  endDateValue,
  startDateValue,
}) {
  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>Start Date:{mandatory}</Text>
          <Pressable style={styles.pressable} onPress={startDateOnPress}>
            {startDateValue ? (
              <Text style={styles.text}>{startDateValue}</Text>
            ) : (
              <Text style={styles.textHint}>Start date</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>

        <View style={styles.inputTextContainerRight}>
          <Text style={styles.label}>End Date:{mandatory}</Text>
          <Pressable style={styles.pressable} onPress={endDateOnPress}>
            {endDateValue ? (
              <Text style={styles.text}>{endDateValue}</Text>
            ) : (
              <Text style={styles.textHint}>End date</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
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
