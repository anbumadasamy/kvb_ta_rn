import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function LabelTextColumnView({  label, value, hint }) {
  return (
    <View style={styles.inputTextContainer}>
       <Text style={styles.label}>{label}</Text>
      <View style={styles.textInputView}>
        {value ? (
          <Text numberOfLines={1} style={styles.value}>
            {value}
          </Text>
        ) : (
          <Text style={styles.hintText}>{hint}</Text>
        )}
      </View>
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
    marginBottom: 10,
  },
  textInputView: {
    flexDirection: "row",
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
    width: "100%",
  },
  hintText: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  },
});
