import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { useNavigation } from "@react-navigation/native";

export default function ChatCard({ data, scroll }) {
  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      onEndReached={scroll}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.travelId}
    />
  );

  function renderItem({ ...itemData }) {
    return (
      <View style={styles.item}>
        <View>
          <Text style={styles.title}>{itemData.item.employeeName}</Text>
        </View>
        <View>
            <Text style={styles.text}>{itemData.item.comment}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 4,
    borderRadius: 4,
    width: "50%",
  },
  title: {
    color: CustomColors.primary_dark,
    fontSize: 14,
    fontWeight: "bold",
  },
  text:{
    color: CustomColors.primary_dark,
    fontSize: 12,
  }
});
