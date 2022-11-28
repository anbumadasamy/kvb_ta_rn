import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  FlatList,
  View,
  TextInput,
  Pressable,
  Text, Alert
} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";

const d = [
  { id: 1, name: "20-07-2022" },
  { id: 2, name: "21-07-2022" },
  { id: 3, name: "22-07-2022" },
  { id: 4, name: "23-07-2022" },
  { id: 5, name: "24-07-2022" },
];

export default function SearchList({ route }) {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [value, setValue] = useState("hi");

  useEffect(() => {
    setData(d);
  });

  function dataItem({ ...itemData }) {
    return (
      <Pressable
        style={styles.cardItem}
        onPress={() => {
          setValue(itemData.item.name);
          navigation.navigate("AddReruirementsScreen", {result: value});
        }}
      >
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.name}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <View style={{ marginLeft: 10 }}>
          <Ionicons name="ios-search" size={24} color="white" />
        </View>
        <TextInput style={styles.inputText} placeholder="Search"></TextInput>
      </View>
      <View style={{ margin: "3%" }}>
        <FlatList
          data={data}
          renderItem={dataItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    backgroundColor: CustomColors.primary_green,
  },
  inputText: {
    borderRadius: 5,
    fontSize: 14,
    padding: 6,
    height: 40,
    width: "85%",
    color: CustomColors.primary_white,
  },
  cardRow: {
    padding: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: CustomColors.text_gray,
  },
  cardText: {
    fontSize: 14,
    color: CustomColors.primary_gray,
  },
});
