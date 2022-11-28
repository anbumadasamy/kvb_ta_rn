import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Picker, onOpen } from "react-native-actions-sheet-picker";
import { CustomColors } from "../../utilities/CustomColors";
import { MaterialIcons } from "@expo/vector-icons";

export default function SearchablePopUp({
  listData,
  label,
  title,
  hint,
  pickerId,
  selected,
  setSelected,
  setSelectedName,
  clear,
}) {
  const [selectedValue, setSelectedValue] = useState();

  console.log("selected " + JSON.stringify(selected))

  return (
    <View>
      <View style={styles.inputTextContainer}>
        <Text style={styles.label}>{label}</Text>
        <Pressable
          style={styles.pressable}
          onPress={() => {
            onOpen(pickerId);
          }}
        >
          {selected ? (
            <Text style={styles.text}>
              {(pickerId == "admin_travel_status" && selected == "Travel_3")
                ? "Travel Approved"
                : (pickerId == "admin_booking_status" && selected == -5 ? "Not Booked & In Progress" : selectedValue)}
            </Text>
          ) : (
            <Text style={styles.textHint}>{hint}</Text>
          )}
          <MaterialIcons name="arrow-drop-down" size={24} color="#A2A2A2" />
        </Pressable>
      </View>

      <Picker
        id={pickerId}
        data={listData}
        //  inputValue={selected}
        searchable={false}
        label={title}
        setSelected={(value) => {
          setSelected(value.id);
          setSelectedValue(value.name);

          if (pickerId == "booking_needed") {
            setSelectedName(value.name);
            clear();
          }
        }}
        // onSearch={onSearch}
        placeholderTextColor="#A2A2A2"
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
  pressable: {
    flexDirection: "row",
    width: "60%",
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
