import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function InputText({ label, value, onChangeEvent, hint,keyboard }) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={hint}
        keyboardType={keyboard ? keyboard : "default"}
        value={value}
        onChangeText={onChangeEvent}
      ></TextInput>
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
  textInput: {
    width: "60%",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    padding: 6,
    fontSize: 14,
    borderColor: CustomColors.primary_gray,
  },
});
