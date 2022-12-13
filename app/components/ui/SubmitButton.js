import { View, Text, StyleSheet, Pressable } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function SubmitButton({ children, onPressEvent }) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPressEvent}
        android_ripple={{ color: CustomColors.ripple_color}}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 5,
    height: 45,
    width: 150,
    marginTop: 5,
    overflow: "hidden",
    alignSelf: "center",
  },
  buttonInnerContainer: {
    backgroundColor: CustomColors.primary_yellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: CustomColors.primary_white,
    textAlign: "center",
    fontWeight: "bold",
  },
  // android_ripple works only on android
  // for ios ripple we make conditional style
  pressed: {
    backgroundColor: CustomColors.ripple_color,
    opacity: 0.75,
  },
});
