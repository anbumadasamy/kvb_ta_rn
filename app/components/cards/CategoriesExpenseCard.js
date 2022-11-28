import { View, Text, StyleSheet, FlatList, Pressable, Alert } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function CategoriesExpenseCard({
  data,
  scroll,
  TourId,
  FromDate,
  ToDate,
  ReqDate,
  Pressed,
  selectedposition,
  listiconpressed,
  setcalled,
  position,
  called,
}) {
  const navigation = useNavigation();

  console.log("Here Came");
  return (
    <FlatList
      data={data}
      overScrollMode="never"
      bounces={false}
      // onScrollBeginDrag={scroll}
      // onEndReached={scroll}
      /* onScrollEndDrag={() => console.log('from')}
      onScroll={() => console.log('end')} */
      renderItem={renderLocationsItem}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.position}
    />
  );
  function renderLocationsItem({ ...itemData }) {
    return (
      <View style={styles.item}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Pressable
            style={styles.row}
            onPress={Pressed}
            onPressIn={() => {
              selectedposition(itemData.item.position);
              if (position == itemData.item.position) {
                setcalled(!called);
              }
            }}
          >
            <View
              style={styles.boxcontainer}
              backgroundColor={itemData.item.colour}
            >
              {itemData.item.position == 1 ? (
                <FontAwesome5
                  name={itemData.item.icon}
                  size={24}
                  color="white"
                />
              ) : (
                <MaterialIcons
                  name={itemData.item.icon}
                  size={24}
                  color="white"
                />
              )}
            </View>
            <View>
              <Text style={styles.text}>{itemData.item.text}</Text>
            </View>
          </Pressable>
        {/*   <View
            style={{
              padding: 20,
            }}
          >
            {itemData.item.position != 1 && (
              <MaterialIcons
                name={itemData.item.list}
                size={24}
                color="black"
                onPress={listiconpressed}
                onPressIn={() => selectedposition(itemData.item.position)}
              />
            )}
          </View> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    padding: 2,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    fontWeight: "normal",
    color: "black",
    fontSize: 15,
    marginLeft: 20,
  },
  boxcontainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
