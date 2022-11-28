import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function Datepicker({ onPressStart, startDate, initial }) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>Date* : </Text>
      <Pressable onPress={onPressStart}>
        <View style={styles.container}>
          {startDate == initial ? (
            <Text
              style={{ color: CustomColors.text_gray, textAlign: "center" }}
            >
              {startDate}
            </Text>
          ) : (
            <Text
              style={{
                color: CustomColors.primary_dark,
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              {startDate}
            </Text>
          )}
          <MaterialIcons name={"calendar-today"} size={24} color="#FFBB4F" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginBottom: "3%",
    width: "35%",
  },
  container: {
    width: "100%",
    borderColor: CustomColors.primary_gray,
    borderWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",

    textAlign: "center",
    borderRadius: 5,
    padding: 8,

    flexDirection: "row",
  },
});
