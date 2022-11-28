import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState, useLayoutEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import LabelTextView from "../../components/ui/LabelTextView";
import {
  View,
  StyleSheet,
  ScrollView,
  LogBox,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import moment from "moment";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import InputText from "../../components/ui/InputText";
import CommentBox from "../../components/ui/CommentBox";
import InputNumber from "../../components/ui/InputNumber";
import StartEndDatePicker from "../../components/ui/StartEndDatePicker";
import SubmitButton from "../../components/ui/SubmitButton";
import HeaderBox from "../../components/ui/HeaderBox";
import ItineraryListCard from "../../components/cards/ItineraryListCard";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import PopUpPicker from "../../components/ui/PopUpPicker";
import AttachmentDialog from "../../components/dialog/AttachmentDialog";
import { CustomColors } from "../../utilities/CustomColors";
import ToastMessage from "../../components/toast/ToastMessage";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import RMtoFM from "../../components/dialog/RMtoFM";
import * as MediaLibrary from "expo-media-library";
import DocumentBox from "../../components/ui/DocumentBox";

let itineraryArray = [];
let requirementsArray = [];
let attachmentArray = [];

let requirementsJsonArray = [];
let itineraryJsonArray = [];
let req_count = 0;
let itinerary_count = 0;

export default function TravelUpdateScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  let travelNo;
  if ("travelNo" in route.params) {
    travelNo = route.params.travelNo;
  }
  const [from, setFrom] = useState("");
  useEffect(() => {
    if ("from" in route.params) {
      setFrom(route.params.from);
    }
  }, [route]);

  const [summaryFrom, setSummaryFrom] = useState("");
  useEffect(() => {
    if ("summaryFrom" in route.params) {
      setSummaryFrom(route.params.summaryFrom);
    }
  }, [route]);

  const [empCode, setEmpCode] = useState("");
  const [empName, setEmpName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [designation, setDesignation] = useState("");

  const [isFirst, setIsFirst] = useState(true);
  const [skipDialog, setSkipDialog] = useState(false);
  const [itineraryId, setItineraryId] = useState(null);
  const [createItineraryId, setCreateItineraryId] = useState(null);
  const [progressBar, setProgressBar] = useState(true);
  const [startDateHoliday, setStartDateHoliday] = useState();
  const [endDateHoliday, setEndDateHoliday] = useState();
  const [holiday, setHoliday] = useState();
  const [nonBaseLocation, setNonBaseLocation] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [documentDeleteDialog, setDocumentDeleteDialog] = useState(false);
  const [itineraryEligible, setItineraryEligible] = useState(true);
  const [docId, setDocId] = useState("");
  const [docName, setDocName] = useState(null);
  const [docFrom, setDocFrom] = useState(null);
  const [deleteFrom, setDeleteFrom] = useState("");
  const [deleteDialogStatus, setDeleteDialogStatus] = useState(false);
  const [startDateStatus, setStartDateStatus] = useState(false);
  const [endDateStatus, setEndDateStatus] = useState(false);
  const [attachmentDialogStatus, setAttachmentDialogStatus] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [nonBaseReason, setNonBaseReason] = useState([]);
  const [travelReason, setTravelReason] = useState([]);
  const [travelData, setTravelData] = useState({
    startDate: "",
    endDate: "",
    startDateJson: "",
    endDateJson: "",
    travelId: "",
    reqDate: "",
    reqDateJson: "",
    noOfDays: "",
    travelReason: "",
    travelReasonId: "",
    travelStatus: "",
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
    itinerary_details: [],
  });

  let nonBaseReasonArray = [];
  let tarvelReasonArray = [];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ marginRight: 20 }}>
              <MaterialIcons
                name="skip-next"
                size={24}
                color="white"
                onPress={() => {
                  setSkipDialog(true);
                }}
              />
            </View>
            <View>
              <MaterialIcons
                name="remove-red-eye"
                size={22}
                color="white"
                onPress={() => {
                  navigation.navigate("Approval Flow", { travelNo: travelNo });
                }}
              />
            </View>
          </View>
        );
      },
    });
  });

  useEffect(() => {
    if (docId != "") {
      DownloadAttachment(docId, docName);
    }
  }, [docName]);

  async function SkipToFH() {
    setProgressBar(true);

    try {
      const response = await fetch(URL.SKIP_APPROVER + travelNo, {
        method: "POST",
        body: JSON.stringify({}),
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
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Maker Summary");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  function DownloadAttachment(id, name) {
    let url =
      URL.DOCUMENT_DOWNLOAD +
      "doc_option=download" +
      "&id=" +
      parseInt(id) +
      "&token=" +
      authCtx.auth_token.split(" ")[1];

    WebBrowser.openBrowserAsync(url);

    setDocId("");
    setDocName("");
    /*  const uri =
      URL.DOCUMENT_DOWNLOAD +
      "doc_option=download" +
      "&id=" +
      id +
      "&token=" +
      authCtx.auth_token.split(" ")[1];
    console.log(uri);
    let fileUri = FileSystem.documentDirectory + name;
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        SaveFile(uri, fileUri);
      })
      .catch((error) => {
        console.error(error);
      }); */
  }

  async function SaveFile(uri, fileUri) {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(uri);
      const save = await MediaLibrary.createAlbumAsync("Download", asset, true);

      if (save) {
        setDocId("");
        setDocName("");
        Alert.alert("Download completed");
        //  Linking.openURL(uri);
      }
    }
  }

  useEffect(() => {
    if ("onBehalfOfName" in route.params) {
      inputChangedHandler("onBehalfOfName", route.params.onBehalfOfName);
    }
    if ("onBehalfOfId" in route.params) {
      inputChangedHandler("onBehalfOfId", route.params.onBehalfOfId);
    }
    if ("onBehalfOfDesigination" in route.params) {
      inputChangedHandler(
        "onBehalfOfDesigination",
        route.params.onBehalfOfDesigination
      );
    }
  }, [route]);

  useLayoutEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  });

  useEffect(() => {
    if (travelData.itinerary_details.length == 1) {
      NonBaseLocationCheck();
    }
  }, [travelData]);

  useEffect(() => {
    if (isFirst) {
      DocumentGet();
      TravelDetail();
    }
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
  async function DocumentGet() {
    try {
      const response = await fetch(
        URL.DOCUMENT_GET + travelNo + "&ref_type=1",
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

      if (json.description != "NO FILE PRESENT") {
        for (let i = 0; i < json.data.length; i++) {
          const obj = {
            id: json.data[i].id,
            fileId: json.data[i].file_id,
            fileName: json.data[i].file_name,
            fileType: json.data[i].file_type,
            from: "API",
          };
          attachmentArray.push(obj);
        }
      }
      setAttachment([...attachment, ...attachmentArray]);
      attachmentArray = [];
    } catch (error) {
      console.error(error);
    }
  }

  function DateFormate(d) {
    var date = d.split("-");
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (var j = 0; j < months.length; j++) {
      if (date[1] == months[j]) {
        date[1] = months.indexOf(months[j]) + 1;
      }
    }
    if (date[1] < 10) {
      date[1] = "0" + date[1];
    }
    // var formattedDate = date[2] + date[1] + date[0];
    var mydate = `${date[2]}-${date[1]}-${date[0]}`;
    return mydate;
  }

  function DateFormate2(d) {
    var date = d.split("-");
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (var j = 0; j < months.length; j++) {
      if (date[1] == months[j]) {
        date[1] = months.indexOf(months[j]) + 1;
      }
    }
    if (date[1] < 10) {
      date[1] = "0" + date[1];
    }
    var mydate = `${date[0]}-${date[1]}-${date[2]}`;
    return mydate;
  }

  async function TravelDetail() {
    const url = URL.TRAVEL_DETAILS_GET + travelNo;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });
      let json = await response.json();

      console.log("Travel update details :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      }

      setBranchCode(json.branch_code);
      setBranchName(json.branch_name);
      setEmpCode(json.employee_code);
      setEmpName(json.employee_name);
      setDesignation(json.empdesignation);

      inputChangedHandler(
        "startDate",
        moment(json.startdate_ms).format("DD-MM-YYYY")
      );
      inputChangedHandler(
        "endDate",
        moment(json.enddate_ms).format("DD-MM-YYYY")
      );
      inputChangedHandler("startDateJson", json.startdate_ms);
      inputChangedHandler("endDateJson", json.enddate_ms);
      inputChangedHandler(
        "reqDate",
        moment(json.requestdate_ms).format("DD-MM-YYYY")
      );
      inputChangedHandler(
        "reqDateJson",
        moment(json.requestdate_ms).format("YYYY-MM-DD")
      );
      inputChangedHandler("travelReason", json.reason_data.name);
      inputChangedHandler("travelReasonId", json.reason_data.id);
      if (json.air_cost != null) {
        inputChangedHandler("airCost", json.air_cost.toString());
      } else {
        inputChangedHandler("airCost", "");
      }
      if (json.accommodation_cost != null) {
        inputChangedHandler(
          "accommodationCost",
          json.accommodation_cost.toString()
        );
      } else {
        inputChangedHandler("accommodationCost", "");
      }
      if (json.other_cost != null) {
        inputChangedHandler("otherCost", json.other_cost.toString());
      } else {
        inputChangedHandler("otherCost", "");
      }
      inputChangedHandler("weekEndExplaination", json.week_end_travel);
      inputChangedHandler("nonBaseReason", json.non_base_location);
      inputChangedHandler("comments", json.ordernoremarks);
      inputChangedHandler("travelId", json.id.toString());
      inputChangedHandler("travelStatus", json.tour_status_id);

      const travelStatus = json.tour_status_id;

      const s = new Date(json.startdate_ms);
      const e = new Date(json.enddate_ms);

      const start = `${s.getMonth() + 1}/${s.getDate()}/${s.getFullYear()}`;

      const end = `${e.getMonth() + 1}/${e.getDate()}/${e.getFullYear()}`;

      NoOfDays(start, end);

      if (json.week_end_travel != null) {
        setHoliday(true);
      }

      if (json.non_base_location != null) {
        setNonBaseLocation(true);
      }

      for (let i = 0; i < json.detail.length; i++) {
        for (let j = 0; j < json.detail[i].requirement.length; j++) {
          req_count = req_count + 1;
          let bookingNeeded = "";

          if (json.detail[i].requirement[j].booking_needed === 1) {
            bookingNeeded = "Accommodation";
          } else if (json.detail[i].requirement[j].booking_needed === 2) {
            bookingNeeded = "Cab";
          } else if (json.detail[i].requirement[j].booking_needed === 3) {
            bookingNeeded = "Bus";
          } else if (json.detail[i].requirement[j].booking_needed === 4) {
            bookingNeeded = "Train";
          } else if (json.detail[i].requirement[j].booking_needed === 5) {
            bookingNeeded = "Flight";
          }

          let requirementObj;

          if (json.detail[i].requirement[j].booking_needed == 1) {
            requirementObj = {
              randomReqId: req_count,
              from: "API",
              status: travelStatus,
              id: json.detail[i].requirement[j].id,
              bookingNeededId: json.detail[i].requirement[j].booking_needed,
              bookingNeeded: bookingNeeded,
              comments: json.detail[i].requirement[j].comments,
              roomType: json.detail[i].requirement[j].room_type,
              placeOfStay: json.detail[i].requirement[j].place_of_stay,
              bookingStatus: json.detail[i].requirement[j].booking_status,
              requirementCode: json.detail[i].requirement[j].requirement_code,
              checkInDateJson:
                json.detail[i].requirement[j].checkin_time != null
                  ? DateFormate2(
                      json.detail[i].requirement[j].checkin_time.split(" ")[0]
                    )
                  : "",
              checkOutDateJson:
                json.detail[i].requirement[j].checkout_time != null
                  ? DateFormate2(
                      json.detail[i].requirement[j].checkout_time.split(" ")[0]
                    )
                  : "",
              checkInDate:
                json.detail[i].requirement[j].checkin_time != null
                  ? DateFormate(
                      json.detail[i].requirement[j].checkin_time.split(" ")[0]
                    )
                  : "",
              checkOutDate:
                json.detail[i].requirement[j].checkout_time != null
                  ? DateFormate(
                      json.detail[i].requirement[j].checkout_time.split(" ")[0]
                    )
                  : "",
              checkInTime:
                json.detail[i].requirement[j].checkin_time != null
                  ? json.detail[i].requirement[j].checkin_time
                      .split(" ")[1]
                      .substring(
                        0,
                        json.detail[i].requirement[j].checkin_time.split(" ")[1]
                          .length - 3
                      )
                  : "",
              checkOutTime:
                json.detail[i].requirement[j].checkout_time != null
                  ? json.detail[i].requirement[j].checkout_time
                      .split(" ")[1]
                      .substring(
                        0,
                        json.detail[i].requirement[j].checkout_time.split(
                          " "
                        )[1].length - 3
                      )
                  : "",
            };
          } else if (json.detail[i].requirement[j].booking_needed == 2) {
            requirementObj = {
              randomReqId: req_count,
              from: "API",
              status: travelStatus,
              id: json.detail[i].requirement[j].id,
              bookingNeededId: json.detail[i].requirement[j].booking_needed,
              bookingNeeded: bookingNeeded,
              travelTypeCabId: json.detail[i].requirement[j].travel_type_cab,
              comments: json.detail[i].requirement[j].comments,
              fromPlace: json.detail[i].requirement[j].from_place,
              toPlace: json.detail[i].requirement[j].to_place,
              instructions: json.detail[i].requirement[j].instructions,
              cabSegment: json.detail[i].requirement[j].cab_segment,
              cabType: json.detail[i].requirement[j].travel_type_cab_value,
              bookingStatus: json.detail[i].requirement[j].booking_status,
              requirementCode: json.detail[i].requirement[j].requirement_code,
              fromTime:
                json.detail[i].requirement[j].from_time != null
                  ? json.detail[i].requirement[j].from_time
                      .split(" ")[1]
                      .substring(
                        0,
                        json.detail[i].requirement[j].from_time.split(" ")[1]
                          .length - 3
                      )
                  : "",
              fromDate:
                json.detail[i].requirement[j].from_time != null
                  ? DateFormate(
                      json.detail[i].requirement[j].from_time.split(" ")[0]
                    )
                  : "",
              fromDateJson:
                json.detail[i].requirement[j].from_time != null
                  ? DateFormate2(
                      json.detail[i].requirement[j].from_time.split(" ")[0]
                    )
                  : "",
            };
          } else {
            requirementObj = {
              randomReqId: req_count,
              from: "API",
              status: travelStatus,
              id: json.detail[i].requirement[j].id,
              bookingNeededId: json.detail[i].requirement[j].booking_needed,
              bookingNeeded: bookingNeeded,
              comments: json.detail[i].requirement[j].comments,
              fromPlace: json.detail[i].requirement[j].from_place,
              toPlace: json.detail[i].requirement[j].to_place,
              bookingStatus: json.detail[i].requirement[j].booking_status,
              requirementCode: json.detail[i].requirement[j].requirement_code,
              fromTime:
                json.detail[i].requirement[j].from_time != null
                  ? json.detail[i].requirement[j].from_time
                      .split(" ")[1]
                      .substring(
                        0,
                        json.detail[i].requirement[j].from_time.split(" ")[1]
                          .length - 3
                      )
                  : "",
              fromDate:
                json.detail[i].requirement[j].from_time != null
                  ? DateFormate(
                      json.detail[i].requirement[j].from_time.split(" ")[0]
                    )
                  : "",
              fromDateJson:
                json.detail[i].requirement[j].from_time != null
                  ? DateFormate2(
                      json.detail[i].requirement[j].from_time.split(" ")[0]
                    )
                  : "",
            };
          }

          requirementsArray.push(requirementObj);
        }

        itinerary_count = itinerary_count + 1;

        const itinerarylObj = {
          randomItineraryId: itinerary_count,
          from: "API",
          id: json.detail[i].id,
          client: json.detail[i].client.client_name,
          clientId: json.detail[i].client.id,
          typeOfTravelId: json.detail[i].official + "",
          typeOfTravel:
            json.detail[i].official == 1
              ? "Official"
              : json.detail[i].official == 2
              ? "Personal"
              : "Official/Personal",
          startPlace: json.detail[i].startingpoint,
          endPlace: json.detail[i].placeofvisit,
          startDate: moment(json.detail[i].startdate_ms).format("DD-MM-YYYY"),
          endDate: moment(json.detail[i].enddate_ms).format("DD-MM-YYYY"),
          startDateJson: json.detail[i].startdate_ms,
          endDateJson: json.detail[i].enddate_ms,
          reason: json.detail[i].purposeofvisit,
          requirement_details: [...requirementsArray],
        };

        itineraryArray.push(itinerarylObj);
        requirementsArray = [];
      }

      inputChangedHandler("itinerary_details", [
        ...travelData.itinerary_details,
        ...itineraryArray,
      ]);
      itineraryArray = [];
      setProgressBar(false);
      setIsFirst(false);
    } catch (error) {
      setProgressBar(false);
      console.error("Error ::: " + error);
    } finally {
    }
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

      if (json.name != travelData.itinerary_details.startPlace) {
        setNonBaseLocation(true);
      }
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
    let result = await DocumentPicker.getDocumentAsync({ type: type });
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
        from: "DEVICE",
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
        from: "DEVICE",
      };

      attachmentArray.push(file);
      setAttachment([...attachment, ...attachmentArray]);
    }
  };

  async function GetNonBaseReason() {
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
        Alert.alert("Previous travel not completed");
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
    const currentDate = new Date(selectedDate);
    setStartDateStatus(!startDateStatus);
    setItineraryEligible(true);
    inputChangedHandler("startDate", moment(selectedDate).format("DD-MM-YYYY"));
    const date = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    setStartDate(date);
    setStartDateHoliday(moment(selectedDate).format("YYYY-MM-DD"));
    inputChangedHandler("startDateJson", selectedDate);
    inputChangedHandler("endDate", "End Date");
    inputChangedHandler("noOfDays", "");
  };
  const handleConfirmEndDate = (selectedDate) => {
    const currentDate = new Date(selectedDate);
    setEndDateStatus(!endDateStatus);
    inputChangedHandler("endDate", moment(selectedDate).format("DD-MM-YYYY"));
    const date = `${
      currentDate.getMonth() + 1
    }/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    setEndDate(date);
    setEndDateHoliday(moment(selectedDate).format("YYYY-MM-DD"));
    inputChangedHandler("endDateJson", selectedDate);
    itineraryArray = [];
    inputChangedHandler("itinerary_details", []);
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
      if (travelData.itinerary_details.length > 0) {
        navigation.navigate("Itinerary Update", {
          maxDate: travelData.endDateJson,
          minDate:
            travelData.itinerary_details[
              travelData.itinerary_details.length - 1
            ].endDateJson,
          requirementsDetails: null,
          from: "create",
        });
      } else {
        navigation.navigate("Itinerary Update", {
          maxDate: travelData.endDateJson,
          minDate: travelData.startDateJson,
          requirementsDetails: null,
          from: "create",
        });
      }
    } else {
      Alert.alert("Select date");
    }
  }

  async function DeleteItinerary() {
    try {
      const response = await fetch(URL.ITINERARY_DELETE + itineraryId, {
        method: "DELETE",
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

      if (json) {
        if (json.status) {
          ItineraryRowDelete();
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function ItineraryRowDelete() {
    const position = travelData.itinerary_details.filter(
      (item) => item.id !== itineraryId
    );
    inputChangedHandler("itinerary_details", position);
    setItineraryId(null);
  }

  function CreatedItineraryRowDelete() {
    const position = travelData.itinerary_details.filter(
      (item) => item.randomItineraryId !== createItineraryId
    );
    inputChangedHandler("itinerary_details", position);
    setCreateItineraryId(null);
  }

  async function TravelUpdate() {
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
            booking_needed: parseInt(reqData.bookingNeededId),
            comments: reqData.comments,
            checkin_time: `${reqData.checkInDateJson} ${reqData.checkInTime}:00`,
            checkout_time: `${reqData.checkOutDateJson} ${reqData.checkOutTime}:00`,
            place_of_stay: reqData.placeOfStay,
            room_type: reqData.roomType,
          };
        } else if (reqData.bookingNeededId == 2) {
          reqObj = {
            booking_needed: parseInt(reqData.bookingNeededId),
            comments: reqData.comments,
            cab_segment: reqData.cabSegment,
            instructions: reqData.instructions,
            travel_type_cab: parseInt(reqData.travelTypeCabId),
            from_time: `${reqData.fromDateJson} ${reqData.fromTime}:00`,
            from_place: reqData.fromPlace,
            to_place: reqData.toPlace,
          };
        } else {
          reqObj = {
            booking_needed: parseInt(reqData.bookingNeededId),
            comments: reqData.comments,
            from_time: `${reqData.fromDateJson} ${reqData.fromTime}:00`,
            from_place: reqData.fromPlace,
            to_place: reqData.toPlace,
          };
        }

        if (reqData.id != "") {
          reqObj["id"] = parseInt(reqData.id);
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

      if (itineraryData.id != "") {
        itineraryObj["id"] = parseInt(itineraryData.id);
      }

      itineraryJsonArray.push(itineraryObj);
      requirementsJsonArray = [];
    }

    let travelObj = {
      id: parseInt(travelData.travelId),
      requestdate: `${travelData.reqDateJson} 00:00:00`,
      reason: travelData.travelReasonId,
      startdate: `${moment(travelData.startDateJson).format(
        "YYYY-MM-DD"
      )} 00:00:00`,
      enddate: `${moment(travelData.endDateJson).format(
        "YYYY-MM-DD"
      )} 00:00:00`,
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

      if (attachment[i].from == "DEVICE") {
        fileobj = {
          uri: attachment[i].uri,
          name: attachment[i].name,
          type: attachment[i].type,
        };
      }

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
          setIsFirst(false);
          attachmentArray = [];
          if (summaryFrom == "travel_update") {
            navigation.goBack();
            navigation.goBack();
            navigation.navigate("Maker Summary");
          } else if (summaryFrom == "on_behalf_of") {
            navigation.goBack();
            navigation.goBack();
            navigation.navigate("On Behalf Of");
          }
        } else {
          setProgressBar(false);
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function DeleteDocument() {
    if (docFrom == "API") {
      try {
        const response = await fetch(URL.DOCUMENT_DELETE + docId, {
          method: "DELETE",
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

        if (json) {
          if (json.status) {
            const position = attachment.filter((item) => item.id !== docId);
            setAttachment(position);
          } else {
            Alert.alert(json.description);
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      const position = attachment.filter(
        (item) => item.randomDocumentId !== docId
      );
      setAttachment(position);
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
                    TravelUpdate();
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

  return (
    <View style={styles.safeAreaContainer}>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset="35"
        style={styles.screenContainer}
      >
        {progressBar ? (
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
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              bounces={false}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 14, color: CustomColors.primary_dark }}
                >
                  Travel No: {travelData.travelId}
                </Text>
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
              </View>
              <StartEndDatePicker
                onPressStart={() => {
                  if (travelData.itinerary_details.length == 0) {
                    setStartDateStatus(true);
                  } else {
                    Alert.alert("Delete all itineraries");
                  }
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

              <DateTimePickerModal
                isVisible={startDateStatus}
                mode="date"
                onConfirm={handleConfirmStartDate}
                onCancel={() => {
                  setStartDateStatus(false);
                }}
                display={Platform.OS == "ios" ? "inline" : "default"}
              />
              <DateTimePickerModal
                isVisible={endDateStatus}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={() => {
                  setEndDateStatus(false);
                }}
                display={Platform.OS == "ios" ? "inline" : "default"}
              />

              <View>
                <LabelTextView
                  label="Employee Name"
                  hint="Employee"
                  value={`(${empCode}) ${empName}`}
                />
                <LabelTextView
                  label="Designation"
                  value={designation}
                  hint="Designation"
                />
                <LabelTextView
                  label="Branch"
                  value={`(${branchCode}) ${branchName}`}
                  hint="Branch"
                />
              </View>
              <PopUpPicker
                listData={travelReason}
                label="Travel Reason:*"
                hint="Choose reason"
                title="Choose travel reason"
                pickerId="travel_reason"
                selectedName={travelData.travelReason}
                setSelectedName={inputChangedHandler.bind(this, "travelReason")}
                setSelectedId={inputChangedHandler.bind(this, "travelReasonId")}
              />

              <InputNumber
                label="Accommodation Cost:"
                hint="Approx Amount"
                value={travelData.accommodationCost}
                onChangeEvent={inputChangedHandler.bind(
                  this,
                  "accommodationCost"
                )}
              ></InputNumber>
              <InputNumber
                label="Flight Cost:"
                hint="Approx Amount"
                value={travelData.airCost}
                onChangeEvent={inputChangedHandler.bind(this, "airCost")}
              ></InputNumber>

              <InputNumber
                label="Other Cost:"
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
                label="Comments"
                hint="Leave Your Comments..."
                inputComment={travelData.comments}
                onInputCommentChanged={inputChangedHandler.bind(
                  this,
                  "comments"
                )}
              />

              <DocumentBox
                documentData={attachment}
                from="create_update"
                pressCamera={OpenCamera}
                pressFolder={PickDocument}
                setDocId={(id) => {
                  setDocId(id);
                }}
                setDocName={(name) => {
                  setDocName(name);
                }}
                deleteEvent={(id, from) => {
                  setDocId(id);
                  setDocFrom(from);
                  setDocumentDeleteDialog(!documentDeleteDialog);
                }}
              />

              {attachmentDialogStatus && (
                <AttachmentDialog
                  dialogstatus={attachmentDialogStatus}
                  setDialogstatus={() => {
                    setAttachmentDialogStatus(!attachmentDialogStatus);
                  }}
                  onPressCamera={OpenCamera}
                  onPressFiles={PickDocument}
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
                deleteItinerary={(id, from) => {
                  setItineraryId(id);
                  setDeleteFrom(from);
                  setDeleteDialogStatus(!deleteDialogStatus);
                }}
                deleteCreateItinerary={(id, from) => {
                  setCreateItineraryId(id);
                  setDeleteFrom(from);
                  setDeleteDialogStatus(!deleteDialogStatus);
                }}
                data={travelData.itinerary_details}
                status={travelData.travelStatus}
                from="travel_update"
              />
              {deleteDialogStatus && (
                <DeleteDialog
                  dialogstatus={deleteDialogStatus}
                  setDialogstatus={setDeleteDialogStatus}
                  onPressDelete={() => {
                    if (deleteFrom == "API") {
                      DeleteItinerary();
                    } else if (deleteFrom == "Create") {
                      CreatedItineraryRowDelete();
                    }
                  }}
                />
              )}
              {skipDialog && (
                <RMtoFM
                  dialogstatus={skipDialog}
                  setDialogstatus={() => {
                    setSkipDialog(!skipDialog);
                  }}
                  onPress={() => {
                    SkipToFH();
                  }}
                />
              )}
            </ScrollView>
            <View>
              <SubmitButton onPressEvent={Create}>Update</SubmitButton>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
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
