import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  ScrollView,
  StyleSheet,
  LogBox,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import InputTextC from "../../components/ui/InputTextC";
import SubmitButton from "../../components/ui/SubmitButton";
import DateSelector from "../../components/ui/DateSelector";

let requirementsDetailsArray = [];

export default function AddItineraryScreen({ route }) {
  const navigation = useNavigation();
  const itineraryFrom = route.params.itineraryFrom;
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();
  const [itineraryData, setItineraryData] = useState({
    randomItineraryId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    startDate: "",
    endDate: "",
    startDateMs: "",
    endDateMs: "",
    startDateJson: "",
    endDateJson: "",
    startPlace: "",
    endPlace: "",
    reason: "",
    from: "Create",
    id: null,
  });

  useEffect(() => {
    LogBox.ignoreLogs([
      "Non-serializable values were found in the navigation state.",
    ]);
    LogBox.ignoreLogs([
      "Can't perform a React state update on an unmounted component.",
    ]);
    setMaxDate(route.params.maxDate);
    setMinDate(route.params.minDate);
  }, [route]);

  console.log("Max Date :>> " + maxDate);
  console.log("Min Date :>> " + minDate);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add Itinerary",
    });

    requirementsDetailsArray = [];

    if ("itineraryDetail" in route.params) {
      if ("requirement_details" in route.params.itineraryDetail) {
        for (
          let i = 0;
          i < route.params.itineraryDetail.requirement_details.length;
          i++
        ) {
          requirementsDetailsArray.push(
            route.params.itineraryDetail.requirement_details[i]
          );
        }
        inputChangedHandler("requirement_details", [
          ...itineraryData.requirement_details,
          ...route.params.itineraryDetail.requirement_details,
        ]);
      }
      inputChangedHandler(
        "randomItineraryId",
        route.params.itineraryDetail.randomItineraryId
      );
      inputChangedHandler("id", route.params.itineraryDetail.id);
      inputChangedHandler(
        "startDateJson",
        route.params.itineraryDetail.startDateJson
      );
      inputChangedHandler(
        "endDateJson",
        route.params.itineraryDetail.endDateJson
      );
      inputChangedHandler("startDate", route.params.itineraryDetail.startDate);
      inputChangedHandler("endDate", route.params.itineraryDetail.endDate);
      inputChangedHandler(
        "startDateMs",
        route.params.itineraryDetail.startDateMs
      );
      inputChangedHandler("endDateMs", route.params.itineraryDetail.endDateMs);
      inputChangedHandler(
        "startPlace",
        route.params.itineraryDetail.startPlace
      );
      inputChangedHandler("endPlace", route.params.itineraryDetail.endPlace);
      inputChangedHandler(
        "typeOfTravel",
        route.params.itineraryDetail.typeOfTravel
      );
      inputChangedHandler(
        "typeOfTravelId",
        route.params.itineraryDetail.typeOfTravelId
      );
      inputChangedHandler("reason", route.params.itineraryDetail.reason);
      inputChangedHandler("client", route.params.itineraryDetail.client);
      inputChangedHandler("clientId", route.params.itineraryDetail.clientId);
      if (route.params.otherClient != "") {
        inputChangedHandler(
          "otherClient",
          route.params.itineraryDetail.otherClient
        );
      }
    }
  }, [route]);

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setItineraryData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  const handleConfirmStartDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    setStartDatePicker(false);
    inputChangedHandler("startDate", currentDate);
    inputChangedHandler("startDateJson", selectedDate);
  };

  const handleConfirmEndDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    setEndDatePicker(false);
    inputChangedHandler("endDate", currentDate);
    inputChangedHandler("endDateJson", selectedDate);
  };

  function AddItinerary() {
    if (itineraryData.startDate != "") {
      if (itineraryData.endDate != "") {
        if (itineraryData.startPlace != "") {
          if (itineraryData.endPlace != "") {
            if (itineraryData.reason != "") {
              navigation.navigate("Travel Creation", {
                itineraryDetails: itineraryData,
              });
            } else {
              Alert.alert("Enter purpose of visit");
            }
          } else {
            Alert.alert("choose end place");
          }
        } else {
          Alert.alert("Choose start place");
        }
      } else {
        Alert.alert("Select end date");
      }
    } else {
      Alert.alert("Select start date");
    }
  }

  return (
    <View style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset="35"
        style={styles.screenContainer}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        >
          <DateSelector
            mandatory="*"
            startDateOnPress={() => {
              setStartDatePicker(true);
            }}
            endDateOnPress={() => {
              if (itineraryData.startDate != "") {
                setEndDatePicker(true);
              } else {
                Alert.alert("Select start date");
              }
            }}
            startDateValue={itineraryData.startDate}
            endDateValue={itineraryData.endDate}
          />

          {itineraryFrom == "create" && (
            <DateTimePickerModal
              isVisible={startDatePicker}
              mode="date"
              onConfirm={handleConfirmStartDate}
              onCancel={() => {
                setStartDatePicker(false);
              }}
              display={Platform.OS == "ios" ? "inline" : "default"}
              maximumDate={maxDate}
              minimumDate={minDate}
            />
          )}
          {itineraryFrom == "create" && (
            <DateTimePickerModal
              isVisible={endDatePicker}
              mode="date"
              onConfirm={handleConfirmEndDate}
              onCancel={() => {
                setEndDatePicker(false);
              }}
              display={Platform.OS == "ios" ? "inline" : "default"}
              maximumDate={maxDate}
              minimumDate={minDate}
            />
          )}
          <InputTextC
            label="Starting Point:*"
            hint="Enter Starting Point"
            value={itineraryData.startPlace}
            onChangeValue={inputChangedHandler.bind(this, "startPlace")}
          />
          <InputTextC
            label="Place Of Visit:*"
            hint="Enter Place Of Visit"
            value={itineraryData.endPlace}
            onChangeValue={inputChangedHandler.bind(this, "endPlace")}
          />
          <InputTextC
            label="Purpose Of Visit:*"
            hint="Enter Purpose"
            value={itineraryData.reason}
            onChangeValue={inputChangedHandler.bind(this, "reason")}
          />
        </ScrollView>
        <View>
          <SubmitButton onPressEvent={AddItinerary}>Submit</SubmitButton>
        </View>
      </KeyboardAvoidingView>
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
