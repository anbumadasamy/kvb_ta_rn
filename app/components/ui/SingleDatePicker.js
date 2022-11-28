import { View, StyleSheet, Text, Pressable , Alert} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function SingleDatePicker({
  dateOnPress,
  dateValue,
  hint,
  label,
}) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.pressable} onPress={dateOnPress}>
        {(dateValue && dateValue != "Invalid date") ? (
          <Text style={styles.text}>{dateValue}</Text>
        ) : (
          <Text style={styles.textHint}>{hint}</Text>
        )}
        <View style={{ paddingRight: 4 }}>
          <MaterialIcons name="date-range" size={22} color="#A2A2A2" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginRight: "5%",
    width: "35%",
  },
  pressable: {
    width: "60%",
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
