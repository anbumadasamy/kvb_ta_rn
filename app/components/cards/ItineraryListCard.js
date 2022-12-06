import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomColors } from "../../utilities/CustomColors";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
} from "react-native";

export default function ItineraryListCard({
  data,
  deleteItinerary,
  deleteCreateItinerary,
  from,
  status,
}) {
  const navigation = useNavigation();
  return (
    <FlatList
      data={data}
      renderItem={ItineraryListItem}
      keyExtractor={(item, index) => {
        return index;
      }}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      bounces={false}
    />
  );

  function ItineraryListItem({ ...itemData }) {
    return (
      <Pressable
        style={styles.cardItem}
        onPress={() => {
          if (from === "travel_creation") {
            navigation.navigate("AddItineraryScreen", {
              itineraryDetail: itemData.item,
              itineraryFrom: "update",
            });
          } else if (from === "travel_update" && (status == 2 || status == 5)) {
            navigation.navigate("Itinerary Update", {
              itineraryDetail: itemData.item,
              from: "update",
            });
          } else {
            navigation.navigate("Itinerary Detail", {
              itineraryDetail: itemData.item,
              from: from,
              bookingStatus: itemData.item.bookingStatus,
            });
          }
        }}
      >
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.startPlace}</Text>
          <Text style={styles.cardText}>{itemData.item.startDate}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.endPlace}</Text>
          <Text style={styles.cardText}>{itemData.item.endDate}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.reason}</Text>
          {(deleteItinerary || deleteCreateItinerary) && (
            <Pressable
              onPress={() => {
                if (itemData.item.from == "API") {
                  deleteItinerary(
                    itemData.item.id != "" ? itemData.item.id : null,
                    itemData.item.from
                  );
                } else if (itemData.item.from == "Create") {
                  deleteCreateItinerary(
                    itemData.item.randomItineraryId,
                    itemData.item.from
                  );
                }
              }}
            >
              <MaterialIcons name="delete" size={24} color="#FE5886" />
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  cardItem: {
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 1,
    backgroundColor: CustomColors.primary_white,
    padding: 6,
    borderRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 3,
  },
  cardText: {
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
});
