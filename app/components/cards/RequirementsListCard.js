import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CustomColors } from "../../utilities/CustomColors";
import { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Alert,
} from "react-native";

export default function RequirementsListCard({
  data,
  deleteRequirement,
  deleteCreatedReq,
  from,
  maxDate,
  minDate,
  typeOfTravel,
}) {
  const navigation = useNavigation();

  function Booked() {
    return (
      <View>
        <Text style={{ fontSize: 14, color: CustomColors.primary_green }}>
          Booked
        </Text>
      </View>
    );
  }
  function NotBooked() {
    return (
      <View>
        <Text style={{ fontSize: 14, color: CustomColors.primary_violet }}>
          Not Booked
        </Text>
      </View>
    );
  }
  function Rejected() {
    return (
      <View>
        <Text style={{ fontSize: 14, color: CustomColors.primary_red }}>
          Rejected
        </Text>
      </View>
    );
  }
  function CancelRequested() {
    return (
      <View>
        <Text style={{ fontSize: 14, color: CustomColors.primary_red }}>
          Cancel Requested
        </Text>
      </View>
    );
  }
  function InProgress(inProgressName) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {inProgressName != "" && (
          <Text
            style={{
              fontSize: 14,
              color: CustomColors.primary_gray,
              marginRight: 5,
            }}
          >
            {inProgressName} -
          </Text>
        )}
        <Text style={{ fontSize: 14, color: CustomColors.primary_yellow }}>
          IP
        </Text>
      </View>
    );
  }
  function Cancelled() {
    return (
      <View>
        <Text style={{ fontSize: 14, color: CustomColors.primary_red }}>
          Cancelled
        </Text>
      </View>
    );
  }

  function AccommodataionCard({ ...itemData }) {
    return (
      <View style={styles.cardItem}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.bookingNeeded}</Text>
          <Text style={styles.cardText}>{itemData.item.checkInDate}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.placeOfStay}</Text>
          <Text style={styles.cardText}>{itemData.item.checkOutDate}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.comments}</Text>
          {itemData.item.bookingStatus === -1 &&
            InProgress(itemData.item.inProgressName)}
          {itemData.item.bookingStatus === 0 && NotBooked()}
          {itemData.item.bookingStatus === 3 && Booked()}
          {itemData.item.bookingStatus === 2 && CancelRequested()}
          {itemData.item.bookingStatus === 4 && Cancelled()}
          {itemData.item.bookingStatus === 5 && Rejected()}
          {(deleteRequirement || deleteCreatedReq) && (
            <Pressable
              onPress={() => {
                if (itemData.item.from == "API") {
                  deleteRequirement(
                    itemData.item.id,
                    itemData.item.bookingNeededId,
                    itemData.item.from
                  );
                } else if (itemData.item.from == "Create") {
                  deleteCreatedReq(
                    itemData.item.randomReqId,
                    itemData.item.from
                  );
                }
              }}
            >
              <MaterialIcons name="delete" size={24} color="#FE5886" />
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  function OthersCard({ ...itemData }) {
    return (
      <View style={styles.cardItem}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.bookingNeeded}</Text>
          <Text style={styles.cardText}>{itemData.item.fromDate}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.fromPlace}</Text>
          <Text style={styles.cardText}>{itemData.item.fromTime}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>{itemData.item.toPlace}</Text>
          {itemData.item.bookingStatus === -1 &&
            InProgress() &&
            InProgress(itemData.item.inProgressName)}
          {itemData.item.bookingStatus === 0 && NotBooked()}
          {itemData.item.bookingStatus === 3 && Booked()}
          {itemData.item.bookingStatus === 2 && CancelRequested()}
          {itemData.item.bookingStatus === 4 && Cancelled()}
          {itemData.item.bookingStatus === 5 && Rejected()}
          {(deleteRequirement || deleteCreatedReq) && (
            <Pressable
              onPress={() => {
                if (itemData.item.from == "API") {
                  deleteRequirement(
                    itemData.item.id,
                    itemData.item.bookingNeededId,
                    itemData.item.from
                  );
                } else if (itemData.item.from == "Create") {
                  deleteCreatedReq(
                    itemData.item.randomReqId,
                    itemData.item.from
                  );
                }
              }}
            >
              <MaterialIcons name="delete" size={24} color="#FE5886" />
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  function RequirementsListItem({ ...itemData }) {
    return (
      <Pressable
        onPress={() => {
          if (from === "travel_creation") {
            navigation.navigate("AddRequirementsScreen", {
              requirementsDetail: itemData.item,
              reqFrom: "update",
            });
          } else if (
            from === "travel_update" &&
            (itemData.item.status == 2 ||
              itemData.item.status == 5 ||
              itemData.item.status == 0)
          ) {
            navigation.navigate("Requirement Update", {
              requirementsDetail: itemData.item,
              maxDate: maxDate,
              minDate: minDate,
              from: "update",
            });
          } else {
            navigation.navigate("Requirement Detail", {
              requirementsDetail: itemData.item,
              from: from,
              maxDate: maxDate,
              minDate: minDate,
              bookingStatus: itemData.item.bookingStatus,
              typeOfTravel: typeOfTravel ? typeOfTravel : "",
            });
          }
        }}
      >
        {itemData.item.bookingNeededId == 1
          ? AccommodataionCard({ ...itemData })
          : OthersCard({ ...itemData })}
      </Pressable>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={RequirementsListItem}
      keyExtractor={(item, index) => {
        return index;
      }}
      showsVerticalScrollIndicator={false}
      overScrollMode="never"
      bounces={false}
    />
  );
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
