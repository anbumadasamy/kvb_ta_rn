import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import RadioGroup from "react-native-radio-buttons-group";
import { CustomColors } from "../../utilities/CustomColors";
import { useState, useEffect } from "react";

export default function CustomizedRadioButton({
  label,
  buttonpressed,
  status,
}) {
  const radioButtonsData = [
    {
      id: "1",
      label: "Yes",
      color: CustomColors.primary_green,
      selected: status,
    },
    {
      id: "2",
      label: "No",
      color: CustomColors.primary_green,
      selected: !status,
    },
  ];
  useEffect(() => {
    setRadioButtons(radioButtonsData);
  }, [status]);
  const [radioButtons, setRadioButtons] = useState(radioButtonsData);

  return (
    <View style={styles.inputTextContainer}>
      <Text style={styles.label}>{label}</Text>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={buttonpressed}
        layout="row"
      />
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
});
