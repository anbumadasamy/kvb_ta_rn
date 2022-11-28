import { View, Text, StyleSheet , Alert} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function CommentBoxView({ inputComment, label, hint }) {
  return (
    <View style={styles.commentBoxContainer}>
      <Text style={styles.commentLabel}>{label}</Text>
      <View style={styles.commentInput}>
        {(inputComment != "") ? (
          <Text
            style={styles.text}
            multiline={true}
          >{inputComment}</Text>
        ) : (
          <Text style={styles.hint} multiline={true}>
            {hint}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentBoxContainer: {
    flexDirection: "column",
    marginBottom: 20,
  },
  commentLabel: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    marginBottom: 10,
  },
  commentInput: {
    width: "100%",
    height: 120,
    borderRadius: 5,
    borderWidth: 1,
    padding: 6,
    borderColor: CustomColors.primary_gray,
  },
  text: {
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
  hint: {
    fontSize: 14,
    color: CustomColors.primary_gray,
  },
});
