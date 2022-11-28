import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function InputTextC({ label, onChangeValue, hint, value }) {
  return (
    <View style={styles.inputTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.textInput} placeholder={hint} value={value} onChangeText={onChangeValue} keyboardType="default"></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  inputTextContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 20
  },
  label: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    width: "100%",
  },
  textInput: {
    width: "100%",
    height: 40,
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    padding: 6,
    fontSize: 14,
    borderColor: CustomColors.primary_gray,
  },
});
