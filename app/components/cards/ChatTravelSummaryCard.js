import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import { WebView } from "react-native-webview";
import HtmlText from "react-native-html-to-text";

export default function ChatTravelSummaryCard({ data, scroll }) {
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
      keyExtractor={(item) => item.travelId}
    />
  );
  function renderItem({ ...itemData }) {
    return (
      <View style={styles.item}>
        <View style={styles.row}>
          <View style={styles.row1}>
            <Text style={styles.label}>Travel No: </Text>
            <Text style={styles.text}>{itemData.item.travelId}</Text>
          </View>
          <View style={styles.row1}>
            <Text style={styles.label}>Date: </Text>
            <Text style={styles.text}>{itemData.item.createdDate}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.row1}>
            {/* <Text style={styles.label}>{itemData.item.employeeName}: </Text> */}
            {/* <View>
            <HtmlText html={itemData.item.comment}></HtmlText>
            </View> */}
             {/* <WebView 
             style={{width: "50%"}}
             originWhitelist={['*']} 
             source={{ html: itemData.item.comment }}/> */}
          </View>
          <Pressable
            style={styles.row1}
            onPress={() => {
              navigation.navigate("Chat box", {
                travelId: itemData.item.travelId,
              });
            }}
          >
            <MaterialIcons name="reply" size={24} color={CustomColors.primary_success} />
          </Pressable>
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
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "space-between",
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    color: CustomColors.primary_dark,
    fontSize: 12.5,
  },
  label: {
    color: CustomColors.text_gray,
    fontSize: 12,
    fontWeight: "bold",
  },
});
