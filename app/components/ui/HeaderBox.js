import { View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";

export default function HeaderBox({ onPressEvent, label, icon }) {
  return (
    <View style={styles.itineraryContainer}>
      <View style={styles.itineraryHeaderContainer}>
        <Text style={styles.text}>{label}: </Text>
        {icon && (
          <Ionicons
            onPress={onPressEvent}
            name={icon}
            size={24}
            color="#8ACAC0"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itineraryContainer: {
    marginBottom: 10,
  },
  itineraryHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
    marginVertical: 2,
    backgroundColor: CustomColors.primary_white,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
  },
});
