import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function LabelNumberView({ label, value, hint }) {
  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>{label}:</Text>
      <View style={styles.textInputView}>
          {value ? <Text style={styles.value}>{value}</Text> : <Text style={styles.hintText}>{hint}</Text>}
      </View>
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
  textInputView: {
    flexDirection: "row",
    width: "60%",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
    alignItems: "center",
  },
  value: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_dark,
  },
  hintText:{
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  }
});
