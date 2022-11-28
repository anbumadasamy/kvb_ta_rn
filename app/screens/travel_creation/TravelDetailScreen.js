import { useEffect, useState, useContext, useLayoutEffect } from "react";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { URL } from "../../utilities/UrlBase";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import {
  View,
  StyleSheet,
  ScrollView,
  LogBox,
  Text,
  Alert,
  Image,
} from "react-native";
import { AuthContext } from "../../data/Auth-Context";
import ToastMessage from "../../components/toast/ToastMessage";
import LabelTextView from "../../components/ui/LabelTextView";
import LabelNumberView from "../../components/ui/LabelNumberView";
import WebViewDialog from "../../components/dialog/WebViewDialog";
import HeaderBox from "../../components/ui/HeaderBox";
import StartEndDatePicker from "../../components/ui/StartEndDatePicker";
import ItineraryListCard from "../../components/cards/ItineraryListCard";
import ApprovelReasonDialog from "../../components/dialog/ApprovelReasonDialog";
import { FloatingAction } from "react-native-floating-action";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import { onOpen, Picker } from "react-native-actions-sheet-picker";
import CommentBoxView from "../../components/ui/CommentBoxView";
import DocumentBox from "../../components/ui/DocumentBox";

import * as MediaLibrary from "expo-media-library";

let attachmentArray = [];

export default function TravelDetailScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const travelNo = route.params.travelNo;
  const appGid = route.params.appGid;

  const [empCode, setEmpCode] = useState("");
  const [empName, setEmpName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [designation, setDesignation] = useState("");
  const [days, setDays] = useState("");

  const [from, setFrom] = useState();
  const [status, setStatus] = useState();
  const [tourCancelStatusId, setTourCancelStatusId] = useState();
  const [dialogStatus, setDialogStatus] = useState(false);
  const [reason, setReason] = useState("");
  const [actionPosition, setActionPosition] = useState();

  const [progressBar, setProgressBar] = useState(true);
  const [travelData, setTravelData] = useState();
  const [itineraryDetail, setItineraryDetail] = useState([]);
  const [adminAction, setAdminAction] = useState();
  const [attachmentData, setAttachmentData] = useState([]);
  const [attachmentId, setAttachmentId] = useState();

  const [fileViewDialog, setFileViewDialog] = useState(false);
  const [fileUri, setFileUri] = useState("");
  const [buttontext, setbuttontext] = useState("");

  const [docName, setDocName] = useState("");
  const [docId, setDocId] = useState("");
  const [onBehalfOfId, setOnBehalfOfId] = useState("");

  const itineraryArray = [];
  let requirementsArray = [];

  const adminActionList = [
    {
      id: 1,
      name: "Return",
    },
    {
      id: 2,
      name: "Reject",
    },
  ];

  useEffect(() => {
    if ("params" in route) {
      if ("onBehalfOfEmpId" in route.params) {
        setOnBehalfOfId(route.params.onBehalfOfEmpId);
      }
    }
  }, [route]);

  useEffect(() => {
    if (fileUri != "") {
      setFileViewDialog(!fileViewDialog);
    }
  }, [fileUri]);

  useEffect(() => {
    if (docName != "") {
      DownloadAttachment(docId, docName);
    }
  }, [docId]);

  function DownloadAttachment(id, name) {
    const url =
      URL.DOCUMENT_DOWNLOAD +
      "doc_option=download" +
      "&id=" +
      parseInt(id) +
      "&token=" +
      authCtx.auth_token.split(" ")[1];
    WebBrowser.openBrowserAsync(url);
    setDocId("");
    setDocName("");
    /* const uri =
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
      }
    }
  }

  async function DocumentGet() {
    let url = URL.DOCUMENT_GET + travelNo + "&ref_type=1";
    try {
      const response = await fetch(url, {
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
      setAttachmentData([...attachmentData, ...attachmentArray]);
      attachmentArray = [];
    } catch (error) {
      console.error(error);
    }
  }

  function AdminAction(action) {
    switch (action) {
      case 1:
        AdminReturn();
        break;
      case 2:
        AdminReject();
        break;
    }
  }

  async function AdminReturn() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.TRAVEl_RETURN, {
        method: "POST",
        body: JSON.stringify({
          appcomment: reason,
          apptype: "tour",
          id: travelData.historyId,
          tour_id: travelNo,
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function AdminReject() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.TRAVEl_REJECT, {
        method: "POST",
        body: JSON.stringify({
          appcomment: reason,
          apptype: "tour",
          id: travelData.historyId,
          tour_id: travelNo,
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  useEffect(() => {
    setFrom(route.params.from);
    setStatus(route.params.status);
    setTourCancelStatusId(route.params.tourCancelStatusId);
  }, [route]);

  useEffect(() => {
    navigation.setOptions({
      title: "Travel Detail",
    });
    TravelDetail();
    DocumentGet();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row" }}>
            {from === "admin_screen" && (
              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name="accessibility"
                  size={22}
                  color="white"
                  onPress={() => {
                    onOpen("admin_action");
                  }}
                />
              </View>
            )}
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

  const action1 = [
    {
      text: "Approve",
      icon: require("../../assets/icons/approve.png"),
      name: "Approve",
      position: 1,
      color: CustomColors.primary_green,
    },
    {
      text: "Return",
      icon: require("../../assets/icons/return.png"),
      name: "Return",
      position: 2,
      color: CustomColors.primary_violet,
    },
    {
      text: "Reject",
      icon: require("../../assets/icons/reject.png"),
      name: "Reject",
      position: 3,
      color: CustomColors.primary_red,
    },
  ];

  const action2 = [
    {
      text: "Approve",
      icon: require("../../assets/icons/approve.png"),
      name: "Approve",
      position: 1,
      color: CustomColors.primary_green,
    },
    {
      text: "Reject",
      icon: require("../../assets/icons/reject.png"),
      name: "Reject",
      position: 2,
      color: CustomColors.primary_red,
    },
  ];

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
    try {
      const response = await fetch(URL.TRAVEL_DETAILS_GET + travelNo, {
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

      setBranchCode(json.branch_code);
      setBranchName(json.branch_name);
      setEmpCode(json.employee_code);
      setEmpName(json.employee_name);
      setDesignation(json.empdesignation);

      let travelId = json.id;
      let historyId = "";

      for (let i = 0; i < json.approve.length; i++) {
        historyId = json.approve[json.approve.length - 1].id;
      }

      const s = new Date(json.startdate_ms);
      const e = new Date(json.enddate_ms);

      const start = `${s.getMonth() + 1}/${s.getDate()}/${s.getFullYear()}`;

      const end = `${e.getMonth() + 1}/${e.getDate()}/${e.getFullYear()}`;

      NoOfDays(start, end);

      const travelObj = {
        id: json.id,
        historyId: historyId,
        startDate: moment(json.startdate_ms).format("DD-MM-YYYY"),
        endDate: moment(json.enddate_ms).format("DD-MM-YYYY"),
        requestDate: moment(json.requestdate_ms).format("DD-MM-YYYY"),
        travelReason: json.reason_data.name,
        travelReasonId: json.reason_data.id,
        airCost: json.air_cost != null ? json.air_cost.toString() : "",
        accommodationCost:
          json.accommodation_cost != null
            ? json.accommodation_cost.toString()
            : "",
        otherCost: json.other_cost != null ? json.other_cost.toString() : "",
        weekEndTravel: json.week_end_travel,
        nonBaseLocation: json.non_base_location,
        orderNoRemarks: json.ordernoremarks,
      };

      for (let i = 0; i < json.detail.length; i++) {
        for (let j = 0; j < json.detail[i].requirement.length; j++) {
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
              id: json.detail[i].requirement[j].id,
              travelNo: travelId,
              bookingNeededId: json.detail[i].requirement[j].booking_needed,
              bookingNeeded: bookingNeeded,
              comments: json.detail[i].requirement[j].comments,
              roomType: json.detail[i].requirement[j].room_type,
              placeOfStay: json.detail[i].requirement[j].place_of_stay,
              bookingStatus: json.detail[i].requirement[j].booking_status,
              requirementCode: json.detail[i].requirement[j].requirement_code,
              checkInDateMilliSec:
                json.detail[i].requirement[j].checkin_time_ms,
              checkOutDateMilliSec:
                json.detail[i].requirement[j].checkout_time_ms,
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
              inProgressName:
                json.detail[i].requirement[j].booked_by.full_name != null
                  ? json.detail[i].requirement[j].booked_by.full_name
                  : "",
              inProgressId:
                json.detail[i].requirement[j].booked_by.id != null
                  ? json.detail[i].requirement[j].booked_by.id
                  : "",

              checkInDateJson: DateFormate2(
                json.detail[i].requirement[j].checkin_time.split(" ")[0]
              ),
              checkOutDateJson: DateFormate2(
                json.detail[i].requirement[j].checkout_time.split(" ")[0]
              ),
            };
          } else if (json.detail[i].requirement[j].booking_needed == 2) {
            requirementObj = {
              id: json.detail[i].requirement[j].id,
              travelNo: travelId,
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
              fromDateMilliSec: json.detail[i].requirement[j].from_time_ms,
              inProgressName:
                json.detail[i].requirement[j].booked_by.full_name != null
                  ? json.detail[i].requirement[j].booked_by.full_name
                  : "",
              inProgressId:
                json.detail[i].requirement[j].booked_by.id != null
                  ? json.detail[i].requirement[j].booked_by.id
                  : "",
            };
          } else {
            requirementObj = {
              id: json.detail[i].requirement[j].id,
              travelNo: travelId,
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
              fromDateMilliSec: json.detail[i].requirement[j].from_time_ms,
              inProgressName:
                json.detail[i].requirement[j].booked_by.full_name != null
                  ? json.detail[i].requirement[j].booked_by.full_name
                  : "",
              inProgressId:
                json.detail[i].requirement[j].booked_by.id != null
                  ? json.detail[i].requirement[j].booked_by.id
                  : "",
            };
          }

          requirementsArray.push(requirementObj);
        }

        const itinerarylObj = {
          id: json.detail[i].id,
          client: json.detail[i].client.client_name,
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
          reason: json.detail[i].purposeofvisit,
          startDateJson: json.detail[i].startdate_ms,
          endDateJson: json.detail[i].enddate_ms,
          requirement: [...requirementsArray],
        };

        itineraryArray.push(itinerarylObj);
        requirementsArray = [];
      }

      setItineraryDetail(itineraryArray);
      setTravelData(travelObj);
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error("Error ::: " + error);
    }
  }

  function NoOfDays(date1, date2) {
    const new_date1 = new Date(date1);
    const new_date2 = new Date(date2);
    const diffTime = Math.abs(new_date2 - new_date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays + 1;
    setDays(days);
  }

  function dateReqFormat(dateValue) {
    let format1 = new SimpleDateFormat("dd-MM-yyyy");
    let format2 = new SimpleDateFormat("yyyy-MMM-dd");
    var date = null;
    try {
      date = format2.parse(dateValue);
    } catch (e) {
      e.printStackTrace();
    }
    System.out.println(format1.format(date));
    return format1.format(date);
  }

  function FloatingActionButton() {
    return (
      <View>
        <FloatingAction
          actions={from === "travel_approvel" ? action1 : action2}
          distanceToEdge={{ vertical: 0, horizontal: 5 }}
          onPressItem={(name) => {
            setActionPosition(name);
            setDialogStatus(true);
            setbuttontext(name);
          }}
          color="#FFBB4F"
          tintColor="white"
        />
      </View>
    );
  }

  function MemberAction(name) {
    switch (name) {
      case "Approve":
        if (from === "travel_approvel") {
          TravelApprove();
        } else if (from === "cancel_approvel") {
          CancelApprove();
        }
        break;
      case "Return":
        if (from === "travel_approvel") {
          TravelReturn();
        }
        break;
      case "Reject":
        if (from === "travel_approvel") {
          TravelReject();
        } else if (from === "cancel_approvel") {
          CancelReject();
        }
        break;
    }
  }

  async function TravelApprove() {
    setProgressBar(true);
    let data;
    data = {
      id: appGid,
      tourgid: travelNo,
      status: "3",
      appcomment: reason,
      applevel: "1",
      apptype: "tour",
    };
    if (onBehalfOfId != "") {
      data["onbehalf"] = parseInt(onBehalfOfId);
    }
    try {
      const response = await fetch(URL.TRAVEl_APPROVE, {
        method: "POST",
        body: JSON.stringify(data),
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Travel Approval");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function CancelApprove() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.TRAVEl_APPROVE, {
        method: "POST",
        body: JSON.stringify({
          appcomment: reason,
          apptype: "TourCancel",
          id: appGid,
          status: "3",
          approvedby: 1,
          applevel: "1",
          tourgid: travelNo,
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Travel Approval");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function TravelReturn() {
    setProgressBar(true);
    let data;
    data = {
      id: appGid,
      tour_id: travelNo,
      appcomment: reason,
      apptype: "tour",
    };
    if (onBehalfOfId != "") {
      data["onbehalf"] = parseInt(onBehalfOfId);
    }
    try {
      const response = await fetch(URL.TRAVEl_RETURN, {
        method: "POST",
        body: JSON.stringify(data),
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Travel Approval");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function TravelReject() {
    setProgressBar(true);
    let data;
    data = {
      id: appGid,
      tour_id: travelNo,
      appcomment: reason,
      apptype: "tour",
    };
    if (onBehalfOfId != "") {
      data["onbehalf"] = parseInt(onBehalfOfId);
    }
    try {
      const response = await fetch(URL.TRAVEl_REJECT, {
        method: "POST",
        body: JSON.stringify(data),
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Travel Approval");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function CancelReject() {
    setProgressBar(true);
    try {
      const response = await fetch(URL.TRAVEl_REJECT, {
        method: "POST",
        body: JSON.stringify({
          id: appGid,
          tour_id: travelNo,
          appcomment: reason,
          apptype: "TourCancel",
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
      setReason("");

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.navigate("Travel Approval");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  return (
    <View style={styles.safeAreaView}>
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
              source={require("../../assets/icons/Progressbar.gif")}
            />
          </View>
        </View>
      ) : (
        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Travel No: </Text>
                <Text>{travelNo}</Text>
              </View>
              {/*  <SimpleDateView date={travelData.requestDate} /> */}
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
                  <Text style={{ fontSize: 14 }}>{travelData.requestDate}</Text>
                </View>
              </View>
            </View>
            <StartEndDatePicker
              startDate={travelData.startDate}
              endDate={travelData.endDate}
              noOfDays={days}
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
            <LabelTextView
              label="Travel Reason"
              hint="Travel Reason"
              value={travelData.travelReason}
            ></LabelTextView>

            <LabelNumberView
              label="Accommodation Cost"
              hint="Amount"
              value={travelData.accommodationCost}
            />
            <LabelNumberView
              label="Flight Cost"
              hint="Amount"
              value={travelData.airCost}
            />
            <LabelNumberView
              label="Other Cost"
              hint="Amount"
              value={travelData.otherCost}
            />
            {travelData.weekEndTravel && (
              <LabelTextView
                label="Explaination for weekend travel"
                hint="Choose explaination"
                value={travelData.weekEndTravel}
              ></LabelTextView>
            )}
            {travelData.nonBaseLocation && (
              <LabelTextView
                label="Reason for non base location travel"
                hint="Choose reason"
                value={travelData.nonBaseLocation}
              ></LabelTextView>
            )}
            <CommentBoxView
              label="Comments:"
              hint="No comments"
              inputComment={travelData.orderNoRemarks}
            />
            {attachmentData && (
              <DocumentBox
                documentData={attachmentData}
                from="detail"
                setDocId={(id) => {
                  setDocId(id);
                }}
                setDocName={(name) => {
                  setDocName(name);
                }}
              />
            )}
            {itineraryDetail.length > 0 && <HeaderBox label="Itinerary" />}
            {itineraryDetail.length > 0 && (
              <ItineraryListCard data={itineraryDetail} from={from} />
            )}
            <Picker
              id="admin_action"
              data={adminActionList}
              searchable={false}
              label="Admin Action"
              setSelected={(value) => {
                setAdminAction(value.id);
                setDialogStatus(true);
                setbuttontext(value.name);
              }}
              placeholderTextColor="#A2A2A2"
            />
          </ScrollView>
          {fileViewDialog && (
            <WebViewDialog
              filePath={fileUri}
              dialogStatus={fileViewDialog}
              setDialogStatus={() => {
                setFileViewDialog(!fileViewDialog);
              }}
            />
          )}
          {dialogStatus && (
            <ApprovelReasonDialog
              dialogStatus={dialogStatus}
              setDialogStatus={setDialogStatus}
              tittle=""
              setValue={setReason}
              buttontext={buttontext}
              value={reason}
              selectedPosition={setActionPosition}
              onPressEvent={() => {
                if (from === "admin_screen") {
                  AdminAction(adminAction);
                  setDialogStatus(!dialogStatus);
                } else {
                  MemberAction(actionPosition);
                  setDialogStatus(!dialogStatus);
                }
              }}
            ></ApprovelReasonDialog>
          )}
          {((from === "travel_approvel" && status === 2) ||
            (from === "cancel_approvel" && tourCancelStatusId === 2)) &&
            FloatingActionButton()}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    marginTop: 20,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
  },
});
