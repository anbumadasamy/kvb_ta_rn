import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

export default function ApprovalFlowCard({ data, scroll }) {
  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      onEndReached={scroll}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
  function renderItem({ ...itemData }) {
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.labelTextRow}>
            <Text style={styles.label}>Travel No: </Text>
            <Text style={styles.text}>{itemData.item.travelNo}</Text>
          </View>

          <View style={styles.labelTextRow}>
            <Text style={styles.label}>Transaction Date: </Text>
            <Text style={styles.text}>{itemData.item.approvedDate}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.labelTextRow}>
            <Text style={styles.label}>Type: </Text>
            <Text style={styles.text}>{itemData.item.type}</Text>
          </View>

          <View style={styles.labelTextRow}>
            <Text style={styles.label}>Trans by: </Text>
            <Text style={styles.text}>{itemData.item.employee}</Text>
          </View>
        </View>

        <View>
          <View style={styles.labelTextRow}>
            <Text style={styles.label}>Comment: </Text>
            <Text style={styles.text}>{itemData.item.comment}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 2,
              justifyContent: "flex-end",
            }}
          >
            <Text style={styles.text}>{itemData.item.status}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelTextRow: {
    flexDirection: "row",
    padding: 2,
  },
  text: {
    color: CustomColors.text_color,
    fontSize: 13,
  },
  label: {
    color: CustomColors.label_color,
    fontSize: 13,
    fontWeight: "bold", 
  },
});
