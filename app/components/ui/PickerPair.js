import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";

export default function PickerPair({
  leftIcon,
  rightIcon,
  leftLabel,
  rightLabel,
  leftHint,
  rightHint,
  leftValue,
  rightValue,
  setLeftValue,
  setRightValue,
}) {
  const [leftDatePicker, setLeftDatePicker] = useState(false);
  const [rightDatePicker, setRightDatePicker] = useState(false);

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>{leftLabel}</Text>
          <Pressable
            style={styles.pressable}
            onPress={() => setLeftDatePicker(true)}
          >
            {leftValue ? (
              <Text style={styles.text}>
                {moment(leftValue).format("DD-MM-YYYY")}
              </Text>
            ) : (
              <Text style={styles.textHint}>{leftHint}</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name={leftIcon} size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>

        <View style={styles.inputTextContainerRight}>
          <Text style={styles.label}>{rightLabel}</Text>
          <Pressable
            style={styles.pressable}
            onPress={() => setRightDatePicker(true)}
          >
            {rightValue ? (
              <Text style={styles.text}>
                {moment(rightValue).format("DD-MM-YYYY")}
              </Text>
            ) : (
              <Text style={styles.textHint}>{rightHint}</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name={rightIcon} size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>
      </View>
      <DateTimePickerModal
        isVisible={leftDatePicker}
        mode="date"
        onConfirm={(selectedDate) => {
          setLeftValue(moment(selectedDate).format("YYYY-MM-DD"));
          setLeftDatePicker(false);
        }}
        onCancel={() => {
          setLeftDatePicker(false);
        }}
        display={Platform.OS == "ios" ? "inline" : "default"}
      />
      <DateTimePickerModal
        isVisible={rightDatePicker}
        mode="date"
        onConfirm={(selectedDate) => {
          setRightValue(moment(selectedDate).format("YYYY-MM-DD"));
          setRightDatePicker(false);
        }}
        onCancel={() => {
          setRightDatePicker(false);
        }}
        display={Platform.OS == "ios" ? "inline" : "default"}
      />

      {/*  {leftDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          display="default"
          onChange={(event, selectedDate) => {
            setLeftValue(moment(selectedDate).format("YYYY-MM-DD"));
            setLeftDatePicker(false);
          }}
        ></DateTimePicker>
      )}

      {rightDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          display="default"
          onChange={(event, selectedDate) => {
            setRightValue(moment(selectedDate).format("YYYY-MM-DD"));
            setRightDatePicker(false);
          }}
        ></DateTimePicker>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
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
  pressable: {
    flexDirection: "row",
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_dark,
  },
  textHint: {
    fontSize: 14,
    padding: 6,
    color: CustomColors.primary_gray,
  },
});
