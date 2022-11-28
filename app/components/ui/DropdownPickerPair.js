import { View, StyleSheet, Text, Pressable, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export default function DropdownPickerPair({
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
  rightPickerTitle,
  rightPickerId,
  rightPickerData,
}) {
  const [selectedRight, setSelectedRight] = useState();
  const [requestedDatePicker, setRequestedDatePicker] = useState(false);

  const onRequestedDateChange = (event, selectedDate) => {
    if (event.type == "set") {
      setRequestedDatePicker(false);
      const currentDate = moment(selectedDate).format("DD-MMM-YYYY");
      setLeftValue(currentDate);
      console.log("Date --------------> " + JSON.stringify(currentDate));
    } else {
      setRequestedDatePicker(false);
    }
  };

  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.inputTextContainerLeft}>
          <Text style={styles.label}>{leftLabel}</Text>
          <Pressable
            style={styles.pressable}
            onPress={() => setRequestedDatePicker(true)}
          >
            {leftValue ? (
              <Text style={styles.text}>{leftValue}</Text>
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
            onPress={() => onOpen(rightPickerId)}
          >
            {rightValue ? (
              <Text style={styles.text}>{(rightPickerId == "admin_requirements" && rightValue == 101 ) ? "All" : selectedRight }</Text>
            ) : (
              <Text style={styles.textHint}>{rightHint}</Text>
            )}
            <View style={{ paddingRight: 4 }}>
              <MaterialIcons name={rightIcon} size={22} color="#A2A2A2" />
            </View>
          </Pressable>
        </View>
      </View>

      {requestedDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date()}
          display="default"
          onChange={onRequestedDateChange}
        ></DateTimePicker>
      )}

      <Picker
        id={rightPickerId}
        data={rightPickerData}
        //inputValue={query}
        searchable={false}
        label={rightPickerTitle}
        setSelected={(value) => {
          setRightValue(value.id);
          setSelectedRight(value.name);
        }}
        // onSearch={onSearch}
        placeholderTextColor="#A2A2A2"
      />
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
