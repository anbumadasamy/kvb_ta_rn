import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  LogBox,
  Text,
  Alert,
  Platform,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import moment from "moment";
import { CustomColors } from "../../utilities/CustomColors";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import InputText from "../../components/ui/InputText";
import InputSelect from "../../components/ui/InputSelect";
import CommentBox from "../../components/ui/CommentBox";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import InputNumber from "../../components/ui/InputNumber";
import StartEndDatePicker from "../../components/ui/StartEndDatePicker";
import SearchDialog from "../../components/dialog/SearchDialog";
import SubmitButton from "../../components/ui/SubmitButton";
import LabelTextView from "../../components/ui/LabelTextView";
import HeaderBox from "../../components/ui/HeaderBox";
import ItineraryListCard from "../../components/cards/ItineraryListCard";
import PopUpPicker from "../../components/ui/PopUpPicker";
import Onbehalfofradiobutton from "../../components/ui/Onbehalfofradiobutton";
import ToastMessage from "../../components/toast/ToastMessage";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import AttachmentDialog from "../../components/dialog/AttachmentDialog";
import DocumentBox from "../../components/ui/DocumentBox";

let itineraryArray = [];
let attachmentArray = [];

let requirementsJsonArray = [];
let itineraryJsonArray = [];

export default function TravelCreationScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [minimumDate, setMinimumDate] = useState("");
  const [onBehalfofDialog, setOnbehalfOfDialog] = useState(false);
  const [onBehalfOf, setOnBehalfOf] = useState(false);
  const [self, setSelf] = useState(true);
  const [onBehalfOfId, setOnbehalfOfId] = useState(null);
  const [onBehalfOfName, setOnBehalfOfName] = useState("");
  const [onBehalfOfDesigination, setOnBehalfOfDesigination] = useState("");
  const [deleteDialogStatus, setDeleteDialogStatus] = useState(false);
  const [documentDeleteDialog, setDocumentDeleteDialog] = useState(false);
  const [randomDocumentId, setRandomDocumentId] = useState(null);
  const [randomItineraryId, setRandomItineraryId] = useState(null);
  const [startDateHoliday, setStartDateHoliday] = useState();
  const [endDateHoliday, setEndDateHoliday] = useState();
  const [itineraryEligible, setItineraryEligible] = useState(true);
  const [progressBar, setProgressBar] = useState(false);
  const [holiday, setHoliday] = useState();
  const [nonBaseLocation, setNonBaseLocation] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateStatus, setStartDateStatus] = useState(false);
  const [endDateStatus, setEndDateStatus] = useState(false);
  const [attachmentDialogStatus, setAttachmentDialogStatus] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [nonBaseReason, setNonBaseReason] = useState([]);
  const [travelReason, setTravelReason] = useState([]);
  const [travelData, setTravelData] = useState({
    startDate: "Start Date",
    endDate: "End Date",
    startDateJson: "",
    endDateJson: "",
    reqDate: moment(new Date()).format("DD-MM-YYYY"),
    reqDateJson: moment(new Date()).format("YYYY-MM-DD"),
    noOfDays: "",
    travelReason: "",
    travelReasonId: "",
    airCost: "",
    accommodationCost: "",
    otherCost: "",
    weekEndExplaination: "",
    nonBaseReason: "",
    nonBaseReasonId: "",
    comments: "",
    onBehalfOfName: "",
    onBehalfOfDesigination: "",
    onBehalfOfId: "",
    onBehalfOfCode: "",
    onBehalfOfBranch: "",
    onBehalfOfBranchCode: "",
    itinerary_details: [],
  });

  let nonBaseReasonArray = [];
  let tarvelReasonArray = [];

  useEffect(() => {
    minimumDateValidation();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "eClaim Travel Creation",
    });
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
    ]);
  });

  useEffect(() => {
    if ("onBehalfOf" in route.params) {
      setOnBehalfOf(route.params.onBehalfOf);
    }
  }, [route]);

  useLayoutEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
    LogBox.ignoreLogs([
      "Non-serializable values were found in the navigation state.",
    ]);
    LogBox.ignoreLogs([
      "Can't perform a React state update on an unmounted component.",
    ]);
  });

  useEffect(() => {
    if (travelData.itinerary_details.length == 1) {
      NonBaseLocationCheck();
    }
  }, [travelData]);

  useEffect(() => {
    if (onBehalfOfId != null) {
      GetOnBehalfOfEmpDetail(onBehalfOfId);
    }
  }, [onBehalfOfId]);

  useEffect(() => {
    inputChangedHandler("onBehalfOfBranch", "");
    inputChangedHandler("onBehalfOfBranchCode", "");
    if (self) {
      inputChangedHandler("onBehalfOfId", "");
      inputChangedHandler("onBehalfOfName", "");
      inputChangedHandler("onBehalfOfDesigination", "");
      GetEmpDetail(authCtx.user_id);
    }
  }, [self]);

  useEffect(() => {
    GetNonBaseReason();
    GetTravelReason();
  }, [route]);

  useEffect(() => {
    if (endDate) {
      NoOfDays(startDate, endDate);
    }
  }, [endDate]);

  useEffect(() => {
    if (endDateHoliday) {
      HolidayCheck(startDateHoliday, endDateHoliday);
    }
  }, [endDateHoliday]);

  useEffect(() => {
    itineraryArray = [];

    if (
      route.params.itineraryDetails != null &&
      "itineraryDetails" in route.params
    ) {
      let position = "NEW";
      if (travelData.itinerary_details.length != 0) {
        for (let i = 0; i < travelData.itinerary_details.length; i++) {
          if (
            travelData.itinerary_details[i].randomItineraryId ==
            route.params.itineraryDetails.randomItineraryId
          ) {
            position = i;
          }
        }
      } else {
        position = "NEW";
      }

      if (position == "NEW") {
        itineraryArray.push(route.params.itineraryDetails);
        inputChangedHandler("itinerary_details", [
          ...travelData.itinerary_details,
          ...itineraryArray,
        ]);
      } else {
        travelData.itinerary_details[position] = route.params.itineraryDetails;
      }
    }
  }, [route]);

  function minimumDateValidation() {
    const miniDate = new Date().getTime() - 150 * 24 * 60 * 60 * 1000;
    setMinimumDate(new Date(miniDate));
    console.log("miniDate" + miniDate);
  }

  async function NonBaseLocationCheck() {
    try {
      const response = await fetch(URL.EMPLOYEE_BASE_LOCATION, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (
        json.name !=
        travelData.itinerary_details[travelData.itinerary_details.length - 1]
          .startPlace
      ) {
        setNonBaseLocation(true);
      } else {
        setNonBaseLocation(false);
        inputChangedHandler("nonBaseReason", "");
        inputChangedHandler("nonBaseReasonId", "");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function GetEmpDetail(id) {
    try {
      const response = await fetch(
        URL.ON_BEHALF_OF_EMPLOYEE_DETAIL + parseInt(id),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      setOnBehalfOfName(json.full_name);
      setOnBehalfOfDesigination(json.designation);
      inputChangedHandler("onBehalfOfCode", json.code);
      inputChangedHandler("onBehalfOfBranch", json.employee_branch_name);
      inputChangedHandler("onBehalfOfBranchCode", json.employee_branch_code);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetOnBehalfOfEmpDetail(id) {
    try {
      const response = await fetch(
        URL.ON_BEHALF_OF_EMPLOYEE_DETAIL + parseInt(id),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      inputChangedHandler("onBehalfOfDesigination", json.designation);
      inputChangedHandler("onBehalfOfCode", json.code);
      inputChangedHandler("onBehalfOfBranch", json.employee_branch_name);
      inputChangedHandler("onBehalfOfBranchCode", json.employee_branch_code);
      setOnbehalfOfId(null);
    } catch (error) {
      console.error(error);
    }
  }

  async function GetTravelReason() {
    try {
      const response = await fetch(URL.TRAVEL_REASON, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      console.log("Travel Reasons :>> " + JSON.stringify(json))

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].id,
          name: json.data[i].name,
        };
        tarvelReasonArray.push(obj);
      }
      setTravelReason([...travelReason, ...tarvelReasonArray]);
    } catch (error) {
      console.error(error);
    }
  }

  const PickDocument = async () => {
    const type = [
      "image/*",
      "application/pdf",
      "application/msword",
      "application/xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    attachmentArray = [];
    let result = await DocumentPicker.getDocumentAsync({
      type: type,
    });
    if (result.type == "success") {
      let file = {
        randomDocumentId:
          Math.floor(Math.random() * 100) +
          1 +
          "" +
          Math.floor(Math.random() * 100) +
          1,
        uri: result.uri,
        name: result.name,
        type: result.mimeType,
      };

      attachmentArray.push(file);
      setAttachment([...attachment, ...attachmentArray]);
    }
  };

  const OpenCamera = async () => {
    attachmentArray = [];
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      let mimeType = result.uri.split(".");
      let file = {
        randomDocumentId:
          Math.floor(Math.random() * 100) +
          1 +
          "" +
          Math.floor(Math.random() * 100) +
          1,
        uri: result.uri,
        name: `IMG_${Math.random()}.${mimeType[mimeType.length - 1]}`,
        type: `image/${mimeType[mimeType.length - 1]}`,
      };
      attachmentArray.push(file);
      setAttachment([...attachment, ...attachmentArray]);
    }
  };

  async function GetNonBaseReason() {
    nonBaseReasonArray = [];
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "base_location", {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      for (let i = 0; i < json.length; i++) {
        const obj = {
          id: json[i].value,
          name: json[i].name,
        };
        nonBaseReasonArray.push(obj);
      }
      setNonBaseReason(nonBaseReasonArray);
    } catch (error) {
      console.error(error);
    }
  }

  async function HolidayCheck(start, end) {
    try {
      const response = await fetch(
        URL.HOLIDAY_CHECK + "start_date=" + start + "&end_date=" + end,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );

      let json = await response.json();

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      if (json.data.length > 0) {
        setHoliday(true);
      } else {
        setHoliday(false);
      }

      if (json.ongoing_tour) {
        setItineraryEligible(false);
        Alert.alert("Already you have a travel on these dates");
      } else {
        setItineraryEligible(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setTravelData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  const handleConfirmStartDate = (selectedDate) => {
    setStartDateStatus(false);
    setItineraryEligible(true);
    inputChangedHandler("startDate", moment(selectedDate).format("DD-MM-YYYY"));
    itineraryArray = [];
    inputChangedHandler("itinerary_details", []);

    const date = `${
      selectedDate.getMonth() + 1
    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;

    setStartDate(date);
    setStartDateHoliday(moment(selectedDate).format("YYYY-MM-DD"));
    inputChangedHandler("startDateJson", selectedDate);
    inputChangedHandler("endDate", "End Date");
    inputChangedHandler("noOfDays", "");
  };

  const handleConfirmEndDate = (selectedDate) => {
    setEndDateStatus(false);
    inputChangedHandler("endDate", moment(selectedDate).format("DD-MM-YYYY"));
    itineraryArray = [];
    inputChangedHandler("itinerary_details", []);

    const date = `${
      selectedDate.getMonth() + 1
    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;

    setEndDate(date);
    setEndDateHoliday(moment(selectedDate).format("YYYY-MM-DD"));
    inputChangedHandler("endDateJson", selectedDate);
  };

  function NoOfDays(date1, date2) {
    const new_date1 = new Date(date1);
    const new_date2 = new Date(date2);
    const diffTime = Math.abs(new_date2 - new_date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays + 1;
    inputChangedHandler("noOfDays", days);
  }

  function AddItinerary() {
    if (travelData.endDate != "End Date") {
      if (travelData.travelReason != "") {
        if (travelData.itinerary_details.length > 0) {
          navigation.navigate("AddItineraryScreen", {
            maxDate: travelData.endDateJson,
            minDate:
              travelData.itinerary_details[
                travelData.itinerary_details.length - 1
              ].endDateJson,
            requirementsDetails: null,
            itineraryFrom: "create",
          });
        } else {
          navigation.navigate("AddItineraryScreen", {
            maxDate: travelData.endDateJson,
            minDate: travelData.startDateJson,
            requirementsDetails: null,
            itineraryFrom: "create",
          });
        }
      } else {
        Alert.alert("Choose travel reason");
      }
    } else {
      Alert.alert("Select date");
    }
  }

  function DeleteItinerary() {
    const position = travelData.itinerary_details.filter(
      (item) => item.randomItineraryId !== randomItineraryId
    );
    inputChangedHandler("itinerary_details", position);
  }

  function DeleteDocument() {
    const position = attachment.filter(
      (item) => item.randomDocumentId !== randomDocumentId
    );
    setAttachment(position);
  }

  async function TravelCreation() {
    setProgressBar(true);
    for (let i = 0; i < travelData.itinerary_details.length; i++) {
      const itineraryData = travelData.itinerary_details[i];
      for (
        let j = 0;
        j < travelData.itinerary_details[i].requirement_details.length;
        j++
      ) {
        const reqData = travelData.itinerary_details[i].requirement_details[j];
        let reqObj;
        if (reqData.bookingNeededId == 1) {
          reqObj = {
            booking_needed: reqData.bookingNeededId,
            comments: reqData.comments,
            checkin_time: `${moment(reqData.checkInDateJson).format(
              "YYYY-MM-DD"
            )} ${reqData.checkInTime}:00`,
            checkout_time: `${moment(reqData.checkOutDateJson).format(
              "YYYY-MM-DD"
            )} ${reqData.checkOutTime}:00`,
            place_of_stay: reqData.placeOfStay,
            room_type: reqData.roomType,
          };
        } else if (reqData.bookingNeededId == 2) {
          reqObj = {
            booking_needed: reqData.bookingNeededId,
            comments: reqData.comments,
            cab_segment: reqData.cabSegment,
            instructions: reqData.instructions,
            travel_type_cab: reqData.travelTypeCabId,
            from_time: `${moment(reqData.fromDateJson).format("YYYY-MM-DD")} ${
              reqData.fromTime
            }:00`,
            from_place: reqData.fromPlace,
            to_place: reqData.toPlace,
          };
        } else {
          reqObj = {
            booking_needed: reqData.bookingNeededId,
            comments: reqData.comments,
            from_time: `${moment(reqData.fromDateJson).format("YYYY-MM-DD")} ${
              reqData.fromTime
            }:00`,
            from_place: reqData.fromPlace,
            to_place: reqData.toPlace,
          };
        }
        requirementsJsonArray.push(reqObj);
      }

      let itineraryObj = {
        startdate: `${moment(itineraryData.startDateJson).format(
          "YYYY-MM-DD"
        )} 00:00:00`,
        enddate: `${moment(itineraryData.endDateJson).format(
          "YYYY-MM-DD"
        )} 00:00:00`,
        startingpoint: itineraryData.startPlace,
        placeofvisit: itineraryData.endPlace,
        purposeofvisit: itineraryData.reason,
        client: parseInt(itineraryData.clientId),
        other_client_name:
          itineraryData.otherClient != "" ? itineraryData.otherClient : null,
        official: parseInt(itineraryData.typeOfTravelId),
        requirements: [...requirementsJsonArray],
      };
      itineraryJsonArray.push(itineraryObj);
      requirementsJsonArray = [];
    }

    let travelObj = {
      requestno: "NEW",
      requestdate: `${travelData.reqDateJson} 00:00:00`,
      reason: travelData.travelReasonId,
      startdate: `${startDateHoliday} 00:00:00`,
      enddate: `${endDateHoliday} 00:00:00`,
      durationdays: travelData.noOfDays,
      accommodation_cost:
        travelData.accommodationCost != ""
          ? parseInt(travelData.accommodationCost)
          : 0,
      other_cost:
        travelData.otherCost != "" ? parseInt(travelData.otherCost) : 0,
      air_cost: travelData.airCost != "" ? parseInt(travelData.airCost) : 0,
      ordernoremarks: travelData.comments,
      week_end_travel:
        travelData.weekEndExplaination != ""
          ? travelData.weekEndExplaination
          : null,
      onbehalfof: 0,
      non_base_location:
        travelData.nonBaseReason != "" ? travelData.nonBaseReason : null,
      detail: [...itineraryJsonArray],
    };

    if (travelData.onBehalfOfId != "") {
      travelObj["onbehalfof"] = parseInt(travelData.onBehalfOfId);
      travelObj["designation"] = travelData.onBehalfOfDesigination;
    }

    itineraryJsonArray = [];

    const data = new FormData();
    data.append("data", JSON.stringify(travelObj));

    for (let i = 0; i < attachment.length; i++) {
      let fileobj;

      fileobj = {
        uri: attachment[i].uri,
        name: attachment[i].name,
        type: attachment[i].type,
      };

      data.append("file", fileobj);
    }

    try {
      const response = await fetch(URL.TRAVEL_CREATION, {
        method: "POST",
        body: data,
        headers: {
          "Content-type": "multipart/form-data",
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
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          if (travelData.onBehalfOfId != "") {
            navigation.navigate("On Behalf Of");
          } else {
            navigation.navigate("Maker Summary");
          }
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  function Create() {
    if (travelData.startDate != "Start Date") {
      if (travelData.endDate != "End Date") {
        if (travelData.travelReason != "") {
          if (travelData.accommodationCost != "") {
            if (travelData.airCost != "") {
              if (travelData.otherCost != "") {
                if (travelData.itinerary_details.length > 0) {
                  if (
                    travelData.itinerary_details[
                      travelData.itinerary_details.length - 1
                    ].endDate == travelData.endDate
                  ) {
                    TravelCreation();
                    /*  if (holiday) {
                    } else {
                      Alert.alert("Enter reason for holiday travel");
                    } */
                    /*  if (nonBaseLocation) {
                     
                    } else {
                      Alert.alert("Enter reason for non base location");
                    } */
                  } else {
                    Alert.alert("Check itinerary end date");
                  }
                } else {
                  Alert.alert("Add itinerary");
                }
              } else {
                Alert.alert("Enter other cost");
              }
            } else {
              Alert.alert("Enter air cost");
            }
          } else {
            Alert.alert("Enter accommodation cost");
          }
        } else {
          Alert.alert("Choose travel reason");
        }
      } else {
        Alert.alert("Select end date");
      }
    } else {
      Alert.alert("Select start date");
    }
  }

  const onPressRadioButton = (radioButtonsArray) => {
    setSelf(radioButtonsArray[0].selected);
  };

  return (
    <View style={styles.safeAreaContainer}>
      {progressBar ? (
        <View style={styles.screenContainer}>
          <View
            style={{
              flex: 1,
              backgroundColor: CustomColors.primary_white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View>
              <Image
                style={{ width: 100, height: 100 }}
                source={require("../../assets/icons/Progressbar1.gif")}
              />
            </View>
          </View>
        </View>
      ) : (
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
            <View
              style={{
                flexDirection: "row",
                marginBottom: 20,
                alignSelf: "flex-end",
              }}
            >
              <View>
                <Text style={{ fontSize: 14 }}>Req Date: </Text>
              </View>
              <View>
                <Text style={{ fontSize: 14 }}>{travelData.reqDate}</Text>
              </View>
            </View>

            <StartEndDatePicker
              onPressStart={() => {
                setStartDateStatus(true);
              }}
              onPressEnd={() => {
                if (travelData.startDate != "Start Date") {
                  setEndDateStatus(true);
                } else {
                  Alert.alert("Select start date");
                }
              }}
              startDate={travelData.startDate}
              endDate={travelData.endDate}
              noOfDays={travelData.noOfDays}
            />

            {minimumDate != "" && (
              <DateTimePickerModal
                isVisible={startDateStatus}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={() => {
                  setStartDateStatus(false);
                }}
                display={Platform.OS == "ios" ? "inline" : "default"}
                minimumDate={minimumDate}
              />
            )}
            {travelData.startDateJson != "" && (
              <DateTimePickerModal
                isVisible={endDateStatus}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={() => {
                  setEndDateStatus(false);
                }}
                display={Platform.OS == "ios" ? "inline" : "default"}
                minimumDate={travelData.startDateJson}
              />
            )}

            {!onBehalfOf && (
              <View>
                <LabelTextView
                  label="Employee Name"
                  hint="Choose Employee"
                  value={`(${travelData.onBehalfOfCode}) ${onBehalfOfName}`}
                />
                <LabelTextView
                  label="Designation"
                  value={onBehalfOfDesigination}
                  hint="Designation"
                />
                <LabelTextView
                  label="Branch"
                  value={`(${travelData.onBehalfOfBranchCode}) ${travelData.onBehalfOfBranch}`}
                  hint="Branch"
                />
              </View>
            )}
            {onBehalfOf && (
              <View>
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <Onbehalfofradiobutton
                    buttonpressed={onPressRadioButton}
                    status={self}
                  />
                </View>
                {!self ? (
                  <View>
                    <InputSelect
                      label="Employee Name:*"
                      hint="Choose Employee"
                      selected={`${travelData.onBehalfOfName}`}
                      onPressEvent={() =>
                        setOnbehalfOfDialog(!onBehalfofDialog)
                      }
                    />
                    <LabelTextView
                      label="Designation"
                      value={travelData.onBehalfOfDesigination}
                      hint="Designation"
                    />
                    <LabelTextView
                      label="Branch"
                      value={`(${travelData.onBehalfOfBranchCode}) ${travelData.onBehalfOfBranch}`}
                      hint="Branch"
                    />
                  </View>
                ) : (
                  <View>
                    <LabelTextView
                      label="Employee Name"
                      hint="Choose Employee"
                      value={`(${travelData.onBehalfOfCode}) ${onBehalfOfName}`}
                    />
                    <LabelTextView
                      label="Designation"
                      value={onBehalfOfDesigination}
                      hint="Designation"
                    />
                    <LabelTextView
                      label="Branch"
                      value={`(${travelData.onBehalfOfBranchCode}) ${travelData.onBehalfOfBranch}`}
                      hint="Branch"
                    />
                  </View>
                )}
              </View>
            )}

            {onBehalfofDialog && (
              <SearchDialog
                dialogstatus={onBehalfofDialog}
                setdialogstatus={setOnbehalfOfDialog}
                from="OnBehalfOfEmp"
                setValue={inputChangedHandler.bind(this, "onBehalfOfName")}
                setId={(id) => {
                  inputChangedHandler("onBehalfOfId", id);
                  setOnbehalfOfId(id);
                }}
              />
            )}

            <PopUpPicker
              listData={travelReason}
              label="Travel Reason:*"
              hint="Choose reason"
              title="Choose travel reason"
              pickerId="travel_reason"
              selectedName={travelData.travelReason}
              setSelectedName={inputChangedHandler.bind(this, "travelReason")}
              setSelectedId={(id) => {
                inputChangedHandler("travelReasonId", id);
                authCtx.SetTravelReason(id);
              }}
            />

            <InputNumber
              label="Accommodation Cost:*"
              hint="Approx Amount"
              value={travelData.accommodationCost}
              onChangeEvent={inputChangedHandler.bind(
                this,
                "accommodationCost"
              )}
            ></InputNumber>

            <InputNumber
              label="Flight Cost:*"
              hint="Approx Amount"
              value={travelData.airCost}
              onChangeEvent={inputChangedHandler.bind(this, "airCost")}
            ></InputNumber>
            <InputNumber
              label="Other Cost:*"
              hint="Approx Amount"
              value={travelData.otherCost}
              onChangeEvent={inputChangedHandler.bind(this, "otherCost")}
            />
            {holiday && (
              <InputText
                label="Explaination for weekend travel:*"
                hint="Choose explaination"
                value={travelData.weekEndExplaination}
                onChangeEvent={inputChangedHandler.bind(
                  this,
                  "weekEndExplaination"
                )}
              />
            )}
            {nonBaseLocation && (
              <PopUpPicker
                listData={nonBaseReason}
                label="Reason for non base location travel:*"
                hint="Choose reason"
                title="Choose reason"
                pickerId="non_base_reason"
                selectedName={travelData.nonBaseReason}
                setSelectedName={inputChangedHandler.bind(
                  this,
                  "nonBaseReason"
                )}
                setSelectedId={inputChangedHandler.bind(
                  this,
                  "nonBaseReasonId"
                )}
              />
            )}
            <CommentBox
              label="Comments:"
              hint="Leave Your Comments..."
              inputComment={travelData.comments}
              onInputCommentChanged={inputChangedHandler.bind(this, "comments")}
            />
            <DocumentBox
              documentData={attachment}
              from="create_update"
              pressCamera={OpenCamera}
              pressFolder={PickDocument}
              deleteEvent={(value) => {
                setRandomDocumentId(value);
                setDocumentDeleteDialog(!documentDeleteDialog);
              }}
            />

            {attachmentDialogStatus && (
              <AttachmentDialog
                dialogstatus={attachmentDialogStatus}
                setDialogstatus={() => {
                  setAttachmentDialogStatus(!attachmentDialogStatus);
                }}
                onPressCamera={() => {
                  OpenCamera();
                }}
                onPressFiles={() => {
                  PickDocument();
                }}
              />
            )}
            {documentDeleteDialog && (
              <DeleteDialog
                dialogstatus={documentDeleteDialog}
                setDialogstatus={() => {
                  setDocumentDeleteDialog(!documentDeleteDialog);
                }}
                onPressDelete={DeleteDocument}
              />
            )}
            {itineraryEligible && (
              <HeaderBox
                onPressEvent={AddItinerary}
                label="Itinerary"
                icon="add-circle-outline"
              />
            )}
            <ItineraryListCard
              deleteCreateItinerary={(value) => {
                setRandomItineraryId(value);
                setDeleteDialogStatus(!deleteDialogStatus);
              }}
              data={travelData.itinerary_details}
              from="travel_creation"
            />
            {deleteDialogStatus && (
              <DeleteDialog
                dialogstatus={deleteDialogStatus}
                setDialogstatus={() => {
                  setDeleteDialogStatus(!deleteDialogStatus);
                }}
                onPressDelete={DeleteItinerary}
              />
            )}
          </ScrollView>
          <View>
            <SubmitButton onPressEvent={Create}>Submit</SubmitButton>
          </View>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
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
