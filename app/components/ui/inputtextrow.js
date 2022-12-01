import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function Inputtextrow({
  label,
  value,
  hint,
  onChangeEvent,
  editable,
}) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.textInput}
        placeholder={hint}
        editable={editable}
        keyboardType="default"
        value={value}
        onChangeText={onChangeEvent}
      ></TextInput>
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
    width: "100%",
  },
  textInput: {
    width: "100%",
    height: 40,
    marginTop:5,
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    borderColor: CustomColors.primary_gray,
    color: CustomColors.primary_dark,
  },
});
