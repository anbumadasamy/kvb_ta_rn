import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function Remarks({
  label,
  defaultValue,
  hint,
  mantory,
  textInputConfig,
}) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>
        {label}:{mantory}
      </Text>
      <TextInput
        style={styles.textInput}
        {...textInputConfig}
        placeholder={hint}
        keyboardType="default"
      >
        {defaultValue}
      </TextInput>
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
  textInput: {
    width: "100%",
    height: 70,
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
    fontSize: 14,
    borderColor: CustomColors.primary_gray,
  },
});
