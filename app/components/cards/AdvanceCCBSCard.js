import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomColors } from "../../utilities/CustomColors";

export default function AdvanceCCBSCard({
  data,
  scroll,
  setId,
  setDeleteDialogStatus,
}) {
  const navigation = useNavigation();
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
      <View style={styles.item}>
        <Pressable onPress={() => {}}>
          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>BS : </Text>
              <Text style={styles.text}>{itemData.item.bs}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>CC : </Text>
              <Text style={styles.text}>{itemData.item.cc}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Amount : </Text>
              <Text style={styles.text}>{itemData.item.amount}</Text>
            </View>
          </View>

          <View style={styles.mainrow}>
            <View style={styles.row}>
              <Text style={styles.label}>Percentage : </Text>
              <Text style={styles.text}>{itemData.item.percentage}</Text>
            </View>
            <Pressable
              style={styles.row}
              onPress={() => {
                setDeleteDialogStatus(true);
                setId(itemData.item.randomCcBsId);
              }}
            >
              <MaterialIcons
                name="delete"
                size={24}
                color={CustomColors.primary_red}
              ></MaterialIcons>
            </Pressable>
          </View>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: CustomColors.primary_white,
    padding: 12,
    borderRadius: 5,
    borderLeftWidth: 1,
    borderLeftColor: CustomColors.button_green,
  },
  row: {
    flexDirection: "row",
    padding: 3,
  },
  mainrow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: CustomColors.text_color,
    fontSize: 12.5,
  },
  label: {
    color: CustomColors.label_color,
    fontSize: 12,
    fontWeight: "bold",
  },
});
