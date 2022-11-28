import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { MaterialIcons } from "@expo/vector-icons";

export default function DropDownWithoutLabel({  ontouch, hint, indata }) {
  return (
    <View style={styles.inputTextContainer}>

      <Pressable onPress={ontouch}>
        <View style={styles.view}>
          {indata ? (
            <Text style={{ color: CustomColors.primary_dark, fontSize: 14 }}>
              {indata}
            </Text>
          ) : (
            <Text style={{ color: CustomColors.text_gray, fontSize: 14 }}>
              {hint}
            </Text>
          )}

          <MaterialIcons name="chevron-right" size={24} color="black" />
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
    width: "100%",
  },
  view: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 45,
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
    fontSize: 14,
    borderColor: CustomColors.primary_gray,
  },
  text: {
    color: CustomColors.text_gray,
    fontSize: 14,
  },
});
