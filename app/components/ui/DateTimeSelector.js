import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function DateTimeSelector({
  inDateOnPress,
  inDate,
  inDateLabel,
  outDateLabel,
  inTimeLabel,
  outTimeLabel,
  inDateLabelhint,
  outDateLabelhint,
  inTimeLabelhint,
  outTimeLabelhint,
  outDateOnPress,
  outDate,
  inTimeOnPress,
  inTime,
  outTimeOnPress,
  outTime,
}) {
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>{inDateLabel}</Text>
          <Pressable style={styles.pressable} onPress={inDateOnPress}>
            {inDate ? (
              <Text style={styles.text}>{inDate}</Text>
            ) : (
              <Text style={styles.textHint}>{inDateLabelhint}</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>

        <View style={styles.inputTextContainerRight}>
          <Text style={styles.label}>{inTimeLabel}</Text>
          <Pressable style={styles.pressable} onPress={inTimeOnPress}>
            {inTime ? (
              <Text style={styles.text}>{inTime}</Text>
            ) : (
              <Text style={styles.textHint}>{inTimeLabelhint}</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="access-time" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>{outDateLabel}</Text>
          <Pressable style={styles.pressable} onPress={outDateOnPress}>
            {outDate ? (
              <Text style={styles.text}>{outDate}</Text>
            ) : (
              <Text style={styles.textHint}>{outDateLabelhint}</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>

        <View style={styles.inputTextContainerRight}>
          <Text style={styles.label}>{outTimeLabel}</Text>
          <Pressable style={styles.pressable} onPress={outTimeOnPress}>
            {outTime ? (
              <Text style={styles.text}>{outTime}</Text>
            ) : (
              <Text style={styles.textHint}>{outTimeLabelhint}</Text>
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
