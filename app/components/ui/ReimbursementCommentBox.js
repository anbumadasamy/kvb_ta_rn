import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function ReimbursementCommentBox({
  inputComment,
  onInputCommentChanged,
  label,
  hint,
  editable,
}) {
  return (
    <View style={styles.commentBoxContainer}>
      <Text style={styles.commentLabel}>{label}</Text>
      <View style={styles.commentInput}>
        <TextInput
          style={styles.inputText}
          editable={editable}
          multiline={true}
          placeholder={hint}
          value={inputComment}
          onChangeText={onInputCommentChanged}
        />
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
  inputText: {
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
});
