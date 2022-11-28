import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function SubmitButton({
  button1,
  button2,
  button1Press,
  button2Press,
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={styles.buttonOuterContainer1}>
        <Pressable
          style={({ pressed }) =>
            pressed
              ? [styles.buttonInnerContainer1, styles.pressed]
              : styles.buttonInnerContainer1
          }
          onPress={button1Press}
          android_ripple={{ color: CustomColors.ripple_color }}
        >
          <Text style={styles.buttonText1}>{button1}</Text>
        </Pressable>
      </View>

      <View style={styles.buttonOuterContainer2}>
        <Pressable
          style={({ pressed }) =>
            pressed
              ? [styles.buttonInnerContainer2, styles.pressed]
              : styles.buttonInnerContainer2
          }
          onPress={button2Press}
          android_ripple={{ color: "#2ecc71" }}
        >
          <Text style={styles.buttonText2}>{button2}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOuterContainer1: {
    flex: 1,
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    overflow: "hidden",
    alignSelf: "center",
    marginRight: 5,
  },
  buttonOuterContainer2: {
    flex: 1,
    borderRadius: 5,
    height: 45,
    marginTop: 10,
    overflow: "hidden",
    alignSelf: "center",
    marginLeft: 5,
    borderWidth: 1,
    borderColor: CustomColors.primary_gray,
  },
  buttonInnerContainer1: {
    backgroundColor: CustomColors.primary_yellow,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonInnerContainer2: {
    backgroundColor: CustomColors.primary_white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText1: {
    color: CustomColors.primary_white,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonText2: {
    color: CustomColors.primary_dark,
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
