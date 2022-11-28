import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import { useEffect, useLayoutEffect, useState, useContext } from "react";
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
import SearchDialog from "../../components/dialog/SearchDialog";
import InputTextC from "../../components/ui/InputTextC";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import InputSelectColumn from "../../components/ui/InputSelectColumn";
import PopUpPickerColumn from "../../components/ui/PopUpPickerColumn";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import SubmitButton from "../../components/ui/SubmitButton";
import DateSelector from "../../components/ui/DateSelector";
import HeaderBox from "../../components/ui/HeaderBox";
import RequirementsListCard from "../../components/cards/RequirementsListCard";

let requirementsDetailsArray = [];

export default function AddItineraryScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const itineraryFrom = route.params.itineraryFrom;
  const [deleteDialogStatus, setDeleteDialogStatus] = useState(false);
  const [randomReqId, setRandomReqId] = useState(null);
  const [startDatePicker, setStartDatePicker] = useState(false);
  const [endDatePicker, setEndDatePicker] = useState(false);
  const [startPlaceDialog, setStartPlaceDialog] = useState(false);
  const [endPlaceDialog, setEndPlaceDialog] = useState(false);
  const [clientDialog, setClientDialog] = useState(false);
  const [typeOfTravel, setTypeOfTravel] = useState([]);
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();
  const [reqEligible, setReqEligible] = useState(false);
  const [itineraryData, setItineraryData] = useState({
    randomItineraryId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    startDate: "",
    endDate: "",
    startDateJson: "",
    endDateJson: "",
    typeOfTravel: "Official",
    typeOfTravelId: "1",
    startPlace: "",
    endPlace: "",
    reason: "",
    client: "",
    clientId: "",
    otherClient: "",
    requirement_details: [],
    from: "Create",
  });

  let typeOfTravelList = [];

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
      inputChangedHandler(
        "startDateJson",
        route.params.itineraryDetail.startDateJson
      );
      dateCompare(
        moment(route.params.itineraryDetail.startDateJson).format("YYYY-MM-DD")
      );
      inputChangedHandler(
        "endDateJson",
        route.params.itineraryDetail.endDateJson
      );
      inputChangedHandler("startDate", route.params.itineraryDetail.startDate);
      inputChangedHandler("endDate", route.params.itineraryDetail.endDate);
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

    if (route.params.requirementsDetails != null) {
      let position = "NEW";
      if (itineraryData.requirement_details.length != 0) {
        for (let i = 0; i < itineraryData.requirement_details.length; i++) {
          if (
            itineraryData.requirement_details[i].randomReqId ==
            route.params.requirementsDetails.randomReqId
          ) {
            position = i;
          }
        }
      } else {
        position = "NEW";
      }

      if (position == "NEW") {
        requirementsDetailsArray.push(route.params.requirementsDetails);
        inputChangedHandler("requirement_details", [
          ...itineraryData.requirement_details,
          ...requirementsDetailsArray,
        ]);
      } else {
        itineraryData.requirement_details[position] =
          route.params.requirementsDetails;
      }
    }
  }, [route]);

  useEffect(() => {
    GetTypeOfTravel();
  }, [route]);

  async function GetTypeOfTravel() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "official", {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.length; i++) {
        const obj = {
          id: json[i].value,
          name: json[i].name,
        };
        typeOfTravelList.push(obj);
      }
      setTypeOfTravel(typeOfTravelList);
    } catch (error) {
      console.error(error);
    }
  }

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
    dateCompare(moment(selectedDate).format("YYYY-MM-DD"));
  };

  const handleConfirmEndDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    setEndDatePicker(false);
    inputChangedHandler("endDate", currentDate);
    inputChangedHandler("endDateJson", selectedDate);
  };

  function AddRequirements() {
    if (itineraryData.endDate != "") {
      navigation.navigate("AddRequirementsScreen", {
        reqFrom: "create",
        requirementsDetail: null,
        maxDate: itineraryData.endDateJson,
        minDate: itineraryData.startDateJson,
      });
    } else {
      Alert.alert("Select date");
    }
  }

  function DeleteRequirementItem() {
    const position = itineraryData.requirement_details.filter(
      (item) => {
        console.log("item.randomReqId :>> " + JSON.stringify(item.randomReqId))
        console.log("randomReqId :>> " + JSON.stringify(item.randomReqId))
        item.randomReqId !== randomReqId}
    );

    inputChangedHandler("requirement_details", position);
  }

  function dateCompare(date2) {
    const date = moment(new Date()).format("YYYY-MM-DD");
    var d1 = Date.parse(new Date(date));
    var d2 = Date.parse(new Date(date2));

    if (d2 == d1) {
      setReqEligible(true);
    }

    if (d2 > d1) {
      setReqEligible(true);
    }
  }

  function AddItinerary() {
    if (itineraryData.startDate != "") {
      if (itineraryData.endDate != "") {
        if (itineraryData.typeOfTravel != "") {
          if (itineraryData.startPlace != "") {
            if (itineraryData.endPlace != "") {
              if (itineraryData.reason != "") {
                if (itineraryData.client != "") {
                  if (itineraryData.client != "OTHERS") {
                    navigation.navigate("Travel Creation", {
                      itineraryDetails: itineraryData,
                    });
                  } else {
                    if (itineraryData.otherClient != "") {
                      navigation.navigate("Travel Creation", {
                        itineraryDetails: itineraryData,
                      });
                    } else {
                      Alert.alert("Enter client name");
                    }
                  }
                } else {
                  Alert.alert("Select client");
                }
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
          Alert.alert("Choose type of travel");
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
          <PopUpPickerColumn
            listData={typeOfTravel}
            label="Type of Travel:*"
            title="Type of Travel"
            hint="Type of Travel"
            pickerId="type_of_travel"
            selectedName={itineraryData.typeOfTravel}
            setSelectedName={inputChangedHandler.bind(this, "typeOfTravel")}
            setSelectedId={inputChangedHandler.bind(this, "typeOfTravelId")}
          />
          <InputSelectColumn
            label="Start Place:*"
            hint="Choose place"
            selected={itineraryData.startPlace}
            onPressEvent={() => setStartPlaceDialog(!startPlaceDialog)}
          />
          {startPlaceDialog && (
            <SearchDialog
              dialogstatus={startPlaceDialog}
              setdialogstatus={setStartPlaceDialog}
              from="startPlace"
              setValue={inputChangedHandler.bind(this, "startPlace")}
            />
          )}
          <InputSelectColumn
            label="End Place:*"
            hint="Choose place"
            selected={itineraryData.endPlace}
            onPressEvent={() => setEndPlaceDialog(!endPlaceDialog)}
          />
          {endPlaceDialog && (
            <SearchDialog
              dialogstatus={endPlaceDialog}
              setdialogstatus={setEndPlaceDialog}
              from="toPlace"
              setValue={inputChangedHandler.bind(this, "endPlace")}
            />
          )}
          <InputTextC
            label="Purpose Of Visit:*"
            hint="Purpose"
            value={itineraryData.reason}
            onChangeValue={inputChangedHandler.bind(this, "reason")}
          />
          <InputSelectColumn
            label="Client:*"
            hint="Choose Client"
            selected={itineraryData.client}
            onPressEvent={() => {
              setClientDialog(!clientDialog);
            }}
          />
          {clientDialog && (
            <SearchDialog
              dialogstatus={clientDialog}
              setdialogstatus={setClientDialog}
              from="client"
              setId={inputChangedHandler.bind(this, "clientId")}
              setValue={(value) => {
                if (value != "OTHERS") {
                  inputChangedHandler("otherClient", "");
                }
                inputChangedHandler("client", value);
              }}
            />
          )}
          {itineraryData.client == "OTHERS" && (
            <InputTextC
              label="Client Name:*"
              hint="Client Name"
              value={itineraryData.otherClient}
              onChangeValue={inputChangedHandler.bind(this, "otherClient")}
            />
          )}
          {reqEligible && (
            <HeaderBox
              onPressEvent={AddRequirements}
              label="Requirements"
              icon="add-circle-outline"
            />
          )}
          <RequirementsListCard
            deleteCreatedReq={(value) => {
              // setRandomReqId(value);
              setDeleteDialogStatus(!deleteDialogStatus);
            }}
            data={itineraryData.requirement_details}
            from="travel_creation"
          />
          {deleteDialogStatus && (
            <DeleteDialog
              dialogstatus={deleteDialogStatus}
              setDialogstatus={() => {
                setDeleteDialogStatus(!deleteDialogStatus);
              }}
              onPressDelete={() => {
                DeleteRequirementItem();
              }}
            />
          )}
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
