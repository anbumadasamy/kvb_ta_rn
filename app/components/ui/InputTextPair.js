import { View, StyleSheet, Text, TextInput, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function InputTextPair({
  leftLabel,
  rightLabel,
  leftHint,
  rightHint,
  leftValue,
  rightValue,
  leftValueChange,
  rightValueChange,
}) {
  return (
    <View style={styles.mainContainer}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>{leftLabel}</Text>
          <TextInput
            style={styles.inputText}
            placeholder={leftHint}
            value={leftValue}
            onChangeText={leftValueChange}
          />
        </View>

        <View style={styles.inputTextContainerRight}>
          <Text style={styles.label}>{rightLabel}</Text>
          <TextInput
            style={styles.inputText}
            placeholder={rightHint}
            value={rightValue}
            onChangeText={rightValueChange}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
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
  inputText: {
    flexDirection: "row",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    padding: 6,
    borderColor: CustomColors.primary_gray,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
  textHint: {
    fontSize: 14,
    color: CustomColors.primary_gray,
  },
});
