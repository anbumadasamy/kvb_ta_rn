import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import { FloatingAction } from "react-native-floating-action";
import TimeSelector from "../../components/ui/TimeSelector";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import LabelTextView from "../../components/ui/LabelTextView";
import { Ionicons } from "@expo/vector-icons";
import ToastMessage from "../../components/toast/ToastMessage";
import CommentBoxView from "../../components/ui/CommentBoxView";

export default function RequirementsDetailScreen({ route }) {
  const navigation = useNavigation();
  const [from, setFrom] = useState();
  const authCtx = useContext(AuthContext);
  const [requirementsData, setRequirementsData] = useState();
  const [bookingStatus, setBookingStatus] = useState();
  const [status, setStatus] = useState();
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();
  let typeOfTravel;

  if ("typeOfTravel" in route.params && route.params.typeOfTravel != "") {
    typeOfTravel = route.params.typeOfTravel;
  }

  useEffect(() => {
    setMaxDate(route.params.maxDate);
    setMinDate(route.params.minDate);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View>
            {from === "travel_update" &&
              (route.params.bookingStatus == 3 ||
                route.params.bookingStatus == 2) && (
                <View>
                  <Ionicons
                    name="receipt"
                    size={22}
                    color="white"
                    onPress={() => {
                      navigation.navigate("My Booking", {
                        reqTypeId: requirementsData.bookingNeededId,
                        status: route.params.bookingStatus,
                        reqId: requirementsData.id,
                        reqType: requirementsData.bookingNeeded,
                      });
                    }}
                  />
                </View>
              )}
          </View>
        );
      },
    });
  });

  const NotBookedList = [
    {
      position: 1,
      name: "Book",
      text: "Book",
      icon: require("../../assets/icons/approve.png"),
      color: CustomColors.primary_green,
    },
    {
      position: 2,
      name: "In Progress",
      text: "In Progress",
      icon: require("../../assets/icons/progress.png"),
      color: CustomColors.primary_yellow,
    },
    {
      position: 3,
      name: "Reject",
      text: "Reject",
      icon: require("../../assets/icons/reject.png"),
      color: CustomColors.primary_red,
    },
    {
      position: 4,
      name: "Not Booked",
      text: "Not Booked",
      icon: require("../../assets/icons/down.png"),
      color: CustomColors.primary_blue,
    },
  ];

  const BookedList = [
    {
      position: 1,
      name: "Cancel",
      text: "Cancel",
      icon: require("../../assets/icons/reject.png"),
      color: CustomColors.primary_red,
    },
    {
      position: 2,
      name: "View",
      text: "View",
      icon: require("../../assets/icons/document.png"),
      color: CustomColors.primary_green,
    },
  ];

  function FloatingActionButton() {
    return (
      <View>
        <FloatingAction
          actions={
            from === "admin_screen" && requirementsData.bookingStatus === 0
              ? NotBookedList
              : from === "admin_screen" && requirementsData.bookingStatus === 3
              ? BookedList
              : from === "admin_screen" && requirementsData.bookingStatus === -1
              ? NotBookedList
              : null
          }
          distanceToEdge={{ vertical: 0, horizontal: 5 }}
          onPressItem={(name) => {
            AdminBooking(name);
          }}
          color="#FFBB4F"
          tintColor="white"
        />
      </View>
    );
  }

  function AdminBooking(action) {
    switch (action) {
      case "Book":
        navigation.navigate("Booking", {
          details: requirementsData,
          typeOfTravel: typeOfTravel,
          maxDate: maxDate,
          minDate: minDate,
          from: "book",
        });
        break;
      case "In Progress":
        RequirementsReserved();
        break;
      case "Reject":
        RequirementsReject();
        break;
      case "Cancel":
        navigation.navigate("Requirements Cancel", {
          reqId: requirementsData.id,
          bookingNeeded: requirementsData.bookingNeededId,
          travelNo: requirementsData.travelNo,
        });
        break;
      case "View":
        navigation.navigate("Booking", {
          details: requirementsData,
          typeOfTravel: typeOfTravel,
          maxDate: maxDate,
          minDate: minDate,
          from: "update",
        });

        /*  navigation.navigate("Booking Detail", {
          details: requirementsData,
          typeOfTravel: typeOfTravel,
        }); */

        break;
      case "Not Booked":
        if (requirementsData.inProgressId == authCtx.user_id) {
          RequirementsNotBooked();
        }
        break;
    }
  }

  useEffect(() => {
    navigation.setOptions({
      title: "Requirement Detail",
    });
  });

  useEffect(() => {
    setFrom(route.params.from);
    setRequirementsData(route.params.requirementsDetail);
    setBookingStatus(route.params.bookingStatus);
  }, [route]);

  useEffect(() => {
    if (bookingStatus === -1) {
      setStatus("In Progress");
    } else if (bookingStatus === 0) {
      setStatus("Not Booked");
    } else if (bookingStatus === 3) {
      setStatus("Booked");
    } else if (bookingStatus === 4) {
      setStatus("Cancelled");
    } else if (bookingStatus === 5) {
      setStatus("Rejected");
    }
  }, [bookingStatus]);

  async function RequirementsReserved() {
    try {
      const response = await fetch(URL.ADMIN_RESERVED, {
        method: "POST",
        body: JSON.stringify({
          requirement_id: requirementsData.id,
          requirement_type: requirementsData.bookingNeededId,
          reserv_status: 1,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function RequirementsNotBooked() {
    try {
      const response = await fetch(URL.ADMIN_RESERVED, {
        method: "POST",
        body: JSON.stringify({
          requirement_id: requirementsData.id,
          requirement_type: requirementsData.bookingNeededId,
          reserv_status: 0,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function RequirementsReject() {
    try {
      const response = await fetch(URL.REQUIREMENTS_REJECT, {
        method: "POST",
        body: JSON.stringify({
          requirement_id: requirementsData.id,
          requirement_type: requirementsData.bookingNeededId,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        if (json.message) {
          ToastMessage(json.message);
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const Cab = () => {
    return (
      <View>
        <LabelTextView
          label="Cab Segment"
          value={requirementsData.cabSegment}
        ></LabelTextView>

        <LabelTextView
          label="Cab Type"
          value={requirementsData.cabType}
        ></LabelTextView>

        <LabelTextView
          label="Start Place"
          value={requirementsData.fromPlace}
        ></LabelTextView>

        <LabelTextView
          label="End Place"
          value={requirementsData.toPlace}
        ></LabelTextView>

        <TimeSelector
          startDate={requirementsData.fromDate}
          startTime={requirementsData.fromTime}
        />
        <CommentBoxView
          label="Instructions:"
          hint="No instructions"
          inputComment={requirementsData.instructions}
        />
      </View>
    );
  };

  const Accommodation = () => {
    return (
      <View>
        <LabelTextView
          label="Room Type"
          value={requirementsData.roomType}
        ></LabelTextView>
        <LabelTextView
          label="Place Of Stay"
          value={requirementsData.placeOfStay}
        ></LabelTextView>

        <DateTimeSelector
          inDateLabel="Check-In Date:"
          inDateLabelhint="In Date"
          inTimeLabel="Check-In Time"
          inTimeLabelhint="In Time"
          outDateLabel="Check-Out Date"
          outDateLabelhint="Out Date"
          outTimeLabel="Check-Out Time"
          outTimeLabelhint="Out Time"
          inDate={requirementsData.checkInDate}
          outDate={requirementsData.checkOutDate}
          inTime={requirementsData.checkInTime}
          outTime={requirementsData.checkOutTime}
        />
      </View>
    );
  };

  const Others = () => {
    return (
      <View>
        <LabelTextView
          label="Start Place"
          value={requirementsData.fromPlace}
        ></LabelTextView>

        <LabelTextView
          label="End Place"
          value={requirementsData.toPlace}
        ></LabelTextView>

        <TimeSelector
          startDate={requirementsData.fromDate}
          startTime={requirementsData.fromTime}
        />
      </View>
    );
  };

  return (
    <View style={styles.safeAreaView}>
      {requirementsData && (
        <View style={styles.screenContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          >
            {from === "admin_screen" && (
              <LabelTextView label="Booking Status" value={status} />
            )}
            <LabelTextView
              label="Booking Needed"
              value={requirementsData.bookingNeeded}
            ></LabelTextView>
            {requirementsData.bookingNeededId == 2 && Cab()}
            {requirementsData.bookingNeededId == 1 && Accommodation()}
            {(requirementsData.bookingNeededId == 3 ||
              requirementsData.bookingNeededId == 4 ||
              requirementsData.bookingNeededId == 5) &&
              Others()}
            {/*   {requirementsData.comments && ( */}
            <CommentBoxView
              label="Comments:"
              hint="No comments"
              inputComment={requirementsData.comments}
            />
            {/*   )} */}
          </ScrollView>

          {from === "admin_screen" &&
            (requirementsData.bookingStatus === 0 ||
              requirementsData.bookingStatus === 3) &&
            FloatingActionButton()}

          {from === "admin_screen" &&
            requirementsData.bookingStatus == -1 &&
            requirementsData.inProgressId == authCtx.user_id &&
            FloatingActionButton()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    marginTop: 20,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
  },
});
