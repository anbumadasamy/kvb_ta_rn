import { View, Text, TextInput, StyleSheet } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function InputNumber({ label, value, hint, onChangeEvent, editable }) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>
        {label}
      </Text>
      <TextInput
      editable={editable ? editable : false}
        style={styles.textInput}
        placeholder={hint}
        value={value}
        onChangeText={onChangeEvent}
        keyboardType="decimal-pad"
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
