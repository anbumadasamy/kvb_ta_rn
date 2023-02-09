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
import InputSelect from "../../components/ui/InputSelect";
import CommentBox from "../../components/ui/CommentBox";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import InputNumber from "../../components/ui/InputNumber";
import StartEndDatePicker from "../../components/ui/StartEndDatePicker";
import SearchDialog from "../../components/dialog/SearchDialog";
import { FloatingAction } from "react-native-floating-action";
import ApprovelReasonDialog from "../../components/dialog/ApprovelReasonDialog";
import SubmitButton from "../../components/ui/SubmitButton";
import LabelTextView from "../../components/ui/LabelTextView";
import HeaderBox from "../../components/ui/HeaderBox";
import ItineraryListCard from "../../components/cards/ItineraryListCard";
import PopUpPicker from "../../components/ui/PopUpPicker";
import Onbehalfofradiobutton from "../../components/ui/Onbehalfofradiobutton";
import ToastMessage from "../../components/toast/ToastMessage";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import AttachmentDialog from "../../components/dialog/AttachmentDialog";
import ApproverSelectDialog from "../../components/dialog/ApproverSelectDialog";
import CustomizedRadioButton from "../../components/ui/CustomizedRadiobutton";
import DocumentBox from "../../components/ui/DocumentBox";

let itineraryArray = [];
let attachmentArray = [];

let itineraryJsonArray = [];

export default function TravelCreationScreen({ route }) {
  const [status] = useState(route.params.status);
  const [travelNo] = useState(route.params.travelNo);
  const [from] = useState(route.params.from);
  const [appGid] = useState(
    "appGid" in route.params ? route.params.appGid : ""
  );

  console.log("Screen from :>> " + JSON.stringify(from));

  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [editable] = useState(
    (from == "travel_maker_summary" || from == "travel_creation") &&
      (status == 101 || status == 2 || status == 5)
  );
  const [minimumDate, setMinimumDate] = useState("");
  const [onBehalfofDialog, setOnbehalfOfDialog] = useState(false);
  const [onBehalfOf, setOnBehalfOf] = useState(false);
  const [self, setSelf] = useState(true);
  const [fundsTransfer, setFundsTransfer] = useState(false);
  const [transferRadioButton, setTransferRadioButton] = useState(false);
  const [onBehalfOfId, setOnbehalfOfId] = useState(null);
  const [onBehalfOfName, setOnBehalfOfName] = useState("");
  const [onBehalfOfDesigination, setOnBehalfOfDesigination] = useState("");
  const [deleteDialogStatus, setDeleteDialogStatus] = useState(false);
  const [documentDeleteDialog, setDocumentDeleteDialog] = useState(false);
  const [randomDocumentId, setRandomDocumentId] = useState(null);
  const [randomItineraryId, setRandomItineraryId] = useState(null);
  const [deleteFrom, setDeleteFrom] = useState(null);
  const [itineraryEligible, setItineraryEligible] = useState(true);
  const [progressBar, setProgressBar] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateStatus, setStartDateStatus] = useState(false);
  const [endDateStatus, setEndDateStatus] = useState(false);
  const [attachmentDialogStatus, setAttachmentDialogStatus] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [travelReason, setTravelReason] = useState([]);
  const [transferStatus, setTransferStatus] = useState(false);
  const [approvelDialogStatus, setApprovelDialogStatus] = useState(false);
  const [reason, setReason] = useState("");
  const [buttontext, setButtontext] = useState("");
  const [actionPosition, setActionPosition] = useState("");
  const [approverSelectDialogStatus, setApproverSelectDialogStatus] =
    useState(false);

  const [startDateMs, setStartDateMs] = useState("");
  const [endDateMs, setEndDateMs] = useState("");

  const [permittedByDialogStatus, setPermittedByDialogStatus] = useState(false);
  const [approverBranchDialogStatus, setApproverBranchDialogStatus] =
    useState(false);
  const [approverNameDialogStatus, setApproverNameDialogStatus] =
    useState(false);
  const [forwardApproverBranch, setForwardApproverBranch] = useState(null);
  const [forwardApproverName, setForwardApproverName] = useState(null);
  const [forwardApproverId, setForwardApproverId] = useState(null);
  const [forwardApproverBranchId, setForwardApproverBranchId] = useState(null);

  const [travelData, setTravelData] = useState({
    startDate: "Start Date",
    endDate: "End Date",
    startDateJson: "",
    endDateJson: "",
    reqDate: status == 101 ? moment(new Date()).format("DD-MM-YYYY") : "",
    reqDateJson: status == 101 ? moment(new Date()).format("YYYY-MM-DD") : "",
    noOfDays: "",
    travelReason: "",
    travelReasonId: "",
    comments: "",
    onBehalfOfName: "",
    onBehalfOfDesigination: "",
    onBehalfOfId: "",
    onBehalfOfCode: "",
    onBehalfOfBranch: "",
    onBehalfOfBranchCode: "",
    permittedByName: "",
    approverBranch: "",
    approverName: "",
    permittedById: "",
    approverBranchId: null,
    approverId: "",
    quantumOfFunds: "0",
    openingBalance: "0",
    transferOnPromotion: "0",
    itinerary_details: [],
  });

  let tarvelReasonArray = [];

  console.log("Travel Data :>> " + JSON.stringify(travelData));

  useEffect(() => {
    minimumDateValidation();
    GetTravelReason();
    if (status != 101) {
      TravelDetail();
    }
  }, []);

  useEffect(() => {
    if (
      travelData.travelReasonId == 6 ||
      travelData.travelReasonId == 7 ||
      travelData.travelReasonId == 8
    ) {
      setTransferRadioButton(true);
    } else {
      setTransferRadioButton(false);
    }
  }, [travelData.travelReasonId]);

  useEffect(() => {
    let title = "";

    if (route.params.from == "travel_maker_summary") {
      if (status == 2 || status == 4) {
        title = "Travel Update";
      } else if (status == 3) {
        title = "Travel Detail";
      }
    } else if (
      route.params.from == "travel_approvel_summary" ||
      route.params.from == "travel_Cancel_approvel_summary"
    ) {
      title = "Travel Detail";
    } else {
      title = "eClaim Travel Creation";
    }

    navigation.setOptions({
      title: title,
    });
  });

  useEffect(() => {
    if ("onBehalfOf" in route.params) {
      setOnBehalfOf(route.params.onBehalfOf);
    }
  }, [route]);

  useLayoutEffect(() => {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.",
    ]);
    LogBox.ignoreLogs([
      "Non-serializable values were found in the navigation state.",
    ]);
    LogBox.ignoreLogs([
      "Can't perform a React state update on an unmounted component.",
    ]);
  });

  useEffect(() => {
    if (onBehalfOfId != null) {
      GetOnBehalfOfEmpDetail(onBehalfOfId);
    }
  }, [onBehalfOfId]);

  useEffect(() => {
    if (status == 101) {
      inputChangedHandler("onBehalfOfBranch", "");
      inputChangedHandler("onBehalfOfBranchCode", "");
      if (self) {
        inputChangedHandler("onBehalfOfId", "");
        inputChangedHandler("onBehalfOfName", "");
        inputChangedHandler("onBehalfOfDesigination", "");
        GetEmpDetail(authCtx.user_id);
      }
    }
  }, [self]);

  useEffect(() => {
    if (endDate) {
      NoOfDays(startDate, endDate);
    }
  }, [endDate]);

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

  function TransferStatus(radioButtonsArray) {
    setTransferStatus(radioButtonsArray[0].selected);
  }

  function minimumDateValidation() {
    const miniDate = new Date().getTime() - 150 * 24 * 60 * 60 * 1000;
    setMinimumDate(new Date(miniDate));
  }

  const cancelAction = [
    {
      text: "Approve",
      icon: require("../../assets/icons/approve.png"),
      name: "Approve",
      position: 1,
      color: CustomColors.fab_approve,
    },
    {
      text: "Reject",
      icon: require("../../assets/icons/reject.png"),
      name: "Reject",
      position: 4,
      color: CustomColors.fab_reject,
    },
  ];

  const action = [
    {
      text: "Approve",
      icon: require("../../assets/icons/approve.png"),
      name: "Approve",
      position: 1,
      color: CustomColors.fab_approve,
    },
    {
      text: "Forward",
      icon: require("../../assets/icons/forward.png"),
      name: "Forward",
      position: 2,
      color: CustomColors.fab_forward,
    },
    {
      text: "Return",
      icon: require("../../assets/icons/return.png"),
      name: "Return",
      position: 3,
      color: CustomColors.fab_return,
    },
    {
      text: "Reject",
      icon: require("../../assets/icons/reject.png"),
      name: "Reject",
      position: 4,
      color: CustomColors.fab_reject,
    },
  ];

  function FloatingActionButton() {
    return (
      <View>
        <FloatingAction
          actions={action}
          distanceToEdge={{ vertical: 0, horizontal: 5 }}
          onPressItem={(name) => {
            setActionPosition(name);
            if (name != "Forward") {
              setApprovelDialogStatus(true);
            } else {
              setApproverSelectDialogStatus(true);
            }
            setButtontext(name);
          }}
          color="#6c3483"
          tintColor="white"
        />
      </View>
    );
  }

  function FloatingActionButton2() {
    return (
      <View>
        <FloatingAction
          actions={cancelAction}
          distanceToEdge={{ vertical: 0, horizontal: 5 }}
          onPressItem={(name) => {
            setActionPosition(name);
            setApprovelDialogStatus(true);
            setButtontext(name);
          }}
          color="#6c3483"
          tintColor="white"
        />
      </View>
    );
  }

  function MemberAction(name) {
    switch (name) {
      case "Approve":
        if (from === "travel_approvel_summary") {
          TravelApprove();
        } else if (from === "travel_Cancel_approvel_summary") {
          CancelApprove();
        }
        break;
      case "Return":
        if (from === "travel_approvel_summary") {
          TravelReturn();
        }
        break;
      case "Reject":
        if (from === "travel_approvel_summary") {
          TravelReject();
        } else if (from === "travel_Cancel_approvel_summary") {
          CancelReject();
        }
        break;
    }
  }

  function ForwardActions() {
    if (from == "travel_approvel_summary") {
      TravelForward();
    } else if (from == "travel_Cancel_approvel_summary") {
      // TravelCancelForward();
    } else if (from == "advance_approvel_summary") {
      // AdvanceForward();
    } else if (from == "advance_cancel_approvel_summary") {
      // AdvanceCancelForward();
    }
  }

  async function TravelForward() {
    setProgressBar(true);
    let data;

    data = {
      id: appGid,
      tour_id: travelNo,
      appcomment: reason,
      applevel: "2",
      apptype: "tour",
      approvedby: forwardApproverId,
    };

    try {
      const response = await fetch(URL.TRAVEL_FORWARD, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
          Authorization: authCtx.auth_token,
        },
      });

      let json = await response.json();

      // console.log("Forward Data :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
        }
      }

      if (json) {
        setProgressBar(false);
        if (json.message) {
          setForwardApproverBranch(null);
          setForwardApproverBranchId(null);
          setForwardApproverName(null);
          setForwardApproverId(null);
          setReason("");
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          if (
            from == "travel_approvel_summary" ||
            from == "advance_approvel_summary"
          ) {
            navigation.navigate("Checker Summary");
          } else if (
            from == "travel_Cancel_approvel_summary" ||
            from == "advance_cancel_approvel_summary"
          ) {
            navigation.navigate("Cancel Approval");
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
        if (json.detail == "Invalid credentials/token.") {
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
          if (
            from == "travel_approvel_summary" ||
            from == "advance_approvel_summary"
          ) {
            navigation.navigate("Checker Summary");
          } else if (
            from == "travel_Cancel_approvel_summary" ||
            from == "advance_cancel_approvel_summary"
          ) {
            navigation.navigate("Cancel Approval");
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

      //  console.log("Cancel Approve :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
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
          if (
            from == "travel_approvel_summary" ||
            from == "advance_approvel_summary"
          ) {
            navigation.navigate("Checker Summary");
          } else if (
            from == "travel_Cancel_approvel_summary" ||
            from == "advance_cancel_approvel_summary"
          ) {
            navigation.navigate("Cancel Approval");
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
        if (json.detail == "Invalid credentials/token.") {
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
          if (
            from == "travel_approvel_summary" ||
            from == "advance_approvel_summary"
          ) {
            navigation.navigate("Checker Summary");
          } else if (
            from == "travel_Cancel_approvel_summary" ||
            from == "advance_cancel_approvel_summary"
          ) {
            navigation.navigate("Cancel Approval");
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
        if (json.detail == "Invalid credentials/token.") {
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
          if (
            from == "travel_approvel_summary" ||
            from == "advance_approvel_summary"
          ) {
            navigation.navigate("Checker Summary");
          } else if (
            from == "travel_Cancel_approvel_summary" ||
            from == "advance_cancel_approvel_summary"
          ) {
            navigation.navigate("Cancel Approval");
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

      //  console.log("Cancel Reject :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
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
          if (
            from == "travel_approvel_summary" ||
            from == "advance_approvel_summary"
          ) {
            navigation.navigate("Checker Summary");
          } else if (
            from == "travel_Cancel_approvel_summary" ||
            from == "advance_cancel_approvel_summary"
          ) {
            navigation.navigate("Cancel Approval");
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

      //    console.log("Travel update details :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }

      let itinerary_count = 0;

      setStartDateMs(new Date(json.startdate));
      setEndDateMs(new Date(json.enddate));
      inputChangedHandler(
        "startDate",
        moment(json.startdate).format("DD-MM-YYYY")
      );
      inputChangedHandler("endDate", moment(json.enddate).format("DD-MM-YYYY"));
      inputChangedHandler(
        "startDateJson",
        moment(json.startdate).format("YYYY-MM-DD")
      );
      inputChangedHandler(
        "endDateJson",
        moment(json.enddate).format("YYYY-MM-DD")
      );
      inputChangedHandler(
        "reqDate",
        moment(json.requestdate).format("DD-MM-YYYY")
      );
      inputChangedHandler(
        "reqDateJson",
        moment(json.requestdate).format("YYYY-MM-DD")
      );
      inputChangedHandler("travelReason", json.reason_data.name);
      inputChangedHandler("travelReasonId", json.reason_data.id);
      inputChangedHandler("comments", json.ordernoremarks);
      inputChangedHandler("travelId", json.id.toString());
      inputChangedHandler("travelStatus", json.tour_status_id);
      inputChangedHandler("permittedByName", json.permittedby);
      inputChangedHandler("permittedById", json.permittedby_id);

      setOnBehalfOfName(json.employee_name);
      setOnBehalfOfDesigination(json.empdesignation);
      inputChangedHandler("onBehalfOfCode", json.employee_code);
      //  inputChangedHandler("onBehalfOfBranch", json.employee_branch_name);
      //  inputChangedHandler("onBehalfOfBranchCode", json.employee_branch_code);

      if (json.reason_data.id == 2) {
        inputChangedHandler("quantumOfFunds", json.quantum_of_funds.toString());
        inputChangedHandler("openingBalance", json.opening_balance.toString());
        setFundsTransfer(true);
      }

      inputChangedHandler(
        "approverBranch",
        json.approver_branch_data.branch_name
      );
      inputChangedHandler(
        "approverBranchId",
        json.approver_branch_data.branch_code
      );
      inputChangedHandler("approverName", json.approver_branch_data.full_name);
      inputChangedHandler("approverId", json.approver_branch_data.id);

      const s = new Date(json.startdate);
      const e = new Date(json.enddate);

      const start = `${s.getMonth() + 1}/${s.getDate()}/${s.getFullYear()}`;

      const end = `${e.getMonth() + 1}/${e.getDate()}/${e.getFullYear()}`;

      NoOfDays(start, end);

      for (let i = 0; i < json.detail.length; i++) {
        itinerary_count = itinerary_count + 1;

        const itinerarylObj = {
          randomItineraryId: itinerary_count,
          from: "API",
          id: json.detail[i].id,
          startPlace: json.detail[i].startingpoint,
          endPlace: json.detail[i].placeofvisit,
          startDate: moment(json.detail[i].startdate).format("DD-MM-YYYY"),
          endDate: moment(json.detail[i].enddate).format("DD-MM-YYYY"),
          startDateMs: new Date(json.detail[i].startdate),
          endDateMs: new Date(json.detail[i].enddate),
          startDateJson: new Date(json.detail[i].startdate),
          endDateJson: new Date(json.detail[i].enddate),
          reason: json.detail[i].purposeofvisit,
        };

        itineraryArray.push(itinerarylObj);
      }

      inputChangedHandler("itinerary_details", [
        ...travelData.itinerary_details,
        ...itineraryArray,
      ]);
      itineraryArray = [];
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error("Error :>> " + error);
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
        if (json.detail == "Invalid credentials/token.") {
          AlertCredentialError(json.detail, navigation);
        }
      }

      setOnBehalfOfName(json.full_name);
      setOnBehalfOfDesigination(json.designation);
      inputChangedHandler("onBehalfOfCode", json.code);
      inputChangedHandler("onBehalfOfBranch", json.employee_branch_name);
      inputChangedHandler("onBehalfOfBranchCode", json.employee_branch_code);
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
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
        if (json.detail == "Invalid credentials/token.") {
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

      if ("detail" in json) {
        if (json.detail == "Invalid credentials/token.") {
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

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setTravelData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  const handleConfirmStartDate = (selectedDate) => {
    setStartDateMs(selectedDate);
    setStartDateStatus(false);
    setItineraryEligible(true);
    inputChangedHandler("startDate", moment(selectedDate).format("DD-MM-YYYY"));
    itineraryArray = [];
    inputChangedHandler("itinerary_details", []);

    const date = `${
      selectedDate.getMonth() + 1
    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;

    setStartDate(date);
    inputChangedHandler(
      "startDateJson",
      moment(selectedDate).format("YYYY-MM-DD")
    );
    setms(selectedDate);
    inputChangedHandler("endDate", "End Date");
    inputChangedHandler("noOfDays", "");
  };

  const handleConfirmEndDate = (selectedDate) => {
    setEndDateMs(selectedDate);
    setEndDateStatus(false);
    inputChangedHandler("endDate", moment(selectedDate).format("DD-MM-YYYY"));
    itineraryArray = [];
    inputChangedHandler("itinerary_details", []);

    const date = `${
      selectedDate.getMonth() + 1
    }/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;

    setEndDate(date);
    inputChangedHandler(
      "endDateJson",
      moment(selectedDate).format("YYYY-MM-DD")
    );
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
            maxDate: endDateMs,
            minDate:
              travelData.itinerary_details[
                travelData.itinerary_details.length - 1
              ].endDateJson,
            requirementsDetails: null,
            from: "create",
            editable: editable,
          });
        } else {
          navigation.navigate("AddItineraryScreen", {
            maxDate: endDateMs,
            minDate: startDateMs,
            requirementsDetails: null,
            from: "create",
            editable: editable,
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
    if (deleteFrom == "API") {
      DeleteItineraryApi();
    } else if (deleteFrom == "Create") {
      const position = travelData.itinerary_details.filter(
        (item) => item.randomItineraryId !== randomItineraryId
      );
      inputChangedHandler("itinerary_details", position);
      setDeleteFrom(null);
    }
  }

  function DeleteItineraryApi() {
    const position = travelData.itinerary_details.filter(
      (item) => item.id !== randomItineraryId
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
      };

      if (itineraryData.id != null) {
        itineraryObj["id"] = itineraryData.id;
      }

      itineraryJsonArray.push(itineraryObj);
    }

    let travelObj = {
      mobile: 1,
      requestno: "NEW",
      requestdate: `${travelData.reqDateJson} 00:00:00`,
      reason: travelData.travelReasonId,
      startdate: `${travelData.startDateJson} 00:00:00`,
      enddate: `${travelData.endDateJson} 00:00:00`,
      durationdays: travelData.noOfDays,
      ordernoremarks: travelData.comments,
      permittedby: travelData.permittedById,
      empbranchgid: `${travelData.approverBranchId} ${travelData.approverBranch}`,
      transfer_on_promotion: transferStatus,
      quantum_of_funds:
        travelData.quantumOfFunds == 0 ? null : travelData.quantumOfFunds,
      opening_balance:
        travelData.openingBalance == 0 ? null : travelData.openingBalance,
      approval: parseInt(travelData.approverId),
      detail: [...itineraryJsonArray],
    };

    if (status != 101) {
      travelObj["id"] = travelNo;
    }

    /*  if (travelData.onBehalfOfId != "") {
      travelObj["onbehalfof"] = parseInt(travelData.onBehalfOfId);
      travelObj["designation"] = travelData.onBehalfOfDesigination;
    } */

    itineraryJsonArray = [];

    //  console.log("Travel creation post data :>> " + JSON.stringify(travelObj));

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

      //  console.log("Response :>> " + JSON.stringify(json));

      if ("detail" in json) {
        if (json.detail == "Invalid token.") {
          AlertCredentialError(json.detail, navigation);
          return;
        }
      }

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          /* navigation.goBack();
          if (status != 101) {
            navigation.goBack();
          } */

          if (status == 2 || status == 4) {
            inputChangedHandler("itinerary_details", []);
            setProgressBar(true);
            TravelDetail();
          }

          if (status == 101) {
            navigation.goBack();
            if (travelData.onBehalfOfId != "") {
              navigation.navigate("On Behalf Of");
            } else {
              navigation.navigate("Maker Summary");
            }
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
    if (travelData.startDate == "Start Date") {
      ToastMessage("Select start date", null, "error");
      return;
    }

    if (travelData.endDate == "End Date") {
      ToastMessage("Select end date", null, "error");
      return;
    }

    if (travelData.travelReason == "") {
      ToastMessage("Choose travel reason", null, "error");
      return;
    }

    if (travelData.itinerary_details.length == 0) {
      ToastMessage("Add itinerary", null, "error");
      return;
    }

    if (
      travelData.itinerary_details[travelData.itinerary_details.length - 1]
        .endDate != travelData.endDate
    ) {
      ToastMessage("Add itinerary till travel end date", null, "error");
      return;
    }

    TravelCreation();
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
                if (editable) {
                  setStartDateStatus(true);
                }
              }}
              onPressEnd={() => {
                if (editable) {
                  if (travelData.startDate != "Start Date") {
                    setEndDateStatus(true);
                  } else {
                    Alert.alert("Select start date");
                  }
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
            {startDateMs != "" && (
              <DateTimePickerModal
                isVisible={endDateStatus}
                mode="date"
                onConfirm={handleConfirmEndDate}
                onCancel={() => {
                  setEndDateStatus(false);
                }}
                display={Platform.OS == "ios" ? "inline" : "default"}
                minimumDate={startDateMs}
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
                      onPressEvent={() => {
                        if (editable) {
                          setOnbehalfOfDialog(!onBehalfofDialog);
                        }
                      }}
                    />
                    <LabelTextView
                      label="Designation"
                      value={travelData.onBehalfOfDesigination}
                      hint="Designation"
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
              pickerId={editable ? "travel_reason" : null}
              selectedName={travelData.travelReason}
              setSelectedName={inputChangedHandler.bind(this, "travelReason")}
              setSelectedId={(id) => {
                if (id == 2) {
                  setFundsTransfer(true);
                } else {
                  setFundsTransfer(false);
                  inputChangedHandler("openingBalance", "0");
                  inputChangedHandler("quantumOfFunds", "0");
                }
                inputChangedHandler("travelReasonId", id);
                authCtx.SetTravelReason(id);
              }}
            />

            {transferRadioButton && (
              <CustomizedRadioButton
                label="Transfer On Promotion:"
                status={transferStatus}
                buttonpressed={TransferStatus}
              ></CustomizedRadioButton>
            )}

            {fundsTransfer && (
              <View>
                <InputNumber
                  label="Quantum Of Funds:"
                  value={travelData.quantumOfFunds}
                  onChangeEvent={inputChangedHandler.bind(
                    this,
                    "quantumOfFunds"
                  )}
                  editable={editable ? true : false}
                ></InputNumber>

                <InputNumber
                  label="Opening Balance:"
                  value={travelData.openingBalance}
                  onChangeEvent={inputChangedHandler.bind(
                    this,
                    "openingBalance"
                  )}
                  editable={editable ? true : false}
                ></InputNumber>
              </View>
            )}

            <InputSelect
              label="Permitted By:*"
              hint="Choose Employee"
              selected={`${travelData.permittedByName}`}
              onPressEvent={() => {
                if (editable) {
                  setPermittedByDialogStatus(true);
                }
              }}
            />

            <InputSelect
              label="Approver Branch:*"
              hint="Choose Branch"
              selected={`${travelData.approverBranch}`}
              onPressEvent={() => {
                if (editable) {
                  setApproverBranchDialogStatus(true);
                }
              }}
            />
            <InputSelect
              label="Approver Name:*"
              hint="Choose Employee"
              selected={`${travelData.approverName}`}
              onPressEvent={() => {
                if (editable) {
                  if (travelData.approverBranchId != null) {
                    setApproverNameDialogStatus(true);
                  } else {
                    Alert.alert("Choose Approver Branch");
                  }
                }
              }}
            />

            {permittedByDialogStatus && (
              <SearchDialog
                dialogstatus={permittedByDialogStatus}
                setdialogstatus={setPermittedByDialogStatus}
                empId={authCtx.user_id}
                onBehalOfId={onBehalfOfId}
                from="permitted_by"
                setValue={inputChangedHandler.bind(this, "permittedByName")}
                setId={(id) => {
                  inputChangedHandler("permittedById", id);
                  setOnbehalfOfId(id);
                }}
              />
            )}

            {approverBranchDialogStatus && (
              <SearchDialog
                dialogstatus={approverBranchDialogStatus}
                setdialogstatus={setApproverBranchDialogStatus}
                from="approver_branch"
                setValue={inputChangedHandler.bind(this, "approverBranch")}
                setId={(id) => {
                  inputChangedHandler("approverBranchId", id);
                  //   setOnbehalfOfId(id);
                }}
              />
            )}

            {approverNameDialogStatus && (
              <SearchDialog
                dialogstatus={approverNameDialogStatus}
                setdialogstatus={setApproverNameDialogStatus}
                branchId={travelData.approverBranchId}
                from="approver_name"
                setValue={inputChangedHandler.bind(this, "approverName")}
                setId={(id) => {
                  inputChangedHandler("approverId", id);
                  //   setOnbehalfOfId(id);
                }}
              />
            )}

            <CommentBox
              label="Comments:"
              hint="Leave Your Comments..."
              inputComment={travelData.comments}
              onInputCommentChanged={inputChangedHandler.bind(this, "comments")}
              editable={editable ? true : false}
            />

            <DocumentBox
              documentData={attachment}
              pressCamera={OpenCamera}
              pressFolder={PickDocument}
              deleteEvent={(value) => {
                setRandomDocumentId(value);
                setDocumentDeleteDialog(!documentDeleteDialog);
              }}
              editable={editable}
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
                icon={editable ? "add-circle-outline" : null}
              />
            )}
            <ItineraryListCard
              deleteCreateItinerary={(value, from) => {
                setRandomItineraryId(value);
                setDeleteFrom(from);
                setDeleteDialogStatus(!deleteDialogStatus);
              }}
              data={travelData.itinerary_details}
              from={from}
              status={status}
            />
          </ScrollView>
          {deleteDialogStatus && (
            <DeleteDialog
              dialogstatus={deleteDialogStatus}
              setDialogstatus={() => {
                setDeleteDialogStatus(!deleteDialogStatus);
              }}
              onPressDelete={DeleteItinerary}
            />
          )}

          {approverSelectDialogStatus && (
            <ApproverSelectDialog
              dialogStatus={approverSelectDialogStatus}
              setDialogStatus={setApproverSelectDialogStatus}
              title=""
              forwardApproverBranch={forwardApproverBranch}
              forwardApproverBranchId={forwardApproverBranchId}
              forwardApproverName={forwardApproverName}
              setForwardApproverBranch={setForwardApproverBranch}
              setForwardApproverBranchId={setForwardApproverBranchId}
              setForwardApproverName={setForwardApproverName}
              setForwardApproverId={setForwardApproverId}
              remarks={reason}
              setRemarks={setReason}
              buttontext={buttontext}
              onPressEvent={ForwardActions}
            />
          )}
          {approvelDialogStatus && (
            <ApprovelReasonDialog
              dialogStatus={approvelDialogStatus}
              setDialogStatus={setApprovelDialogStatus}
              tittle=""
              setValue={setReason}
              buttontext={buttontext}
              value={reason}
              selectedPosition={setActionPosition}
              onPressEvent={() => {
                MemberAction(actionPosition);
                setApprovelDialogStatus(!approvelDialogStatus);
              }}
            ></ApprovelReasonDialog>
          )}
          <View>
            {editable && (
              <SubmitButton onPressEvent={Create}>
                {status == 101 ? "Submit" : "Update"}
              </SubmitButton>
            )}
          </View>
          {from == "travel_approvel_summary" &&
            status == 2 &&
            FloatingActionButton()}
          {from == "travel_Cancel_approvel_summary" &&
            status == 2 &&
            FloatingActionButton2()}
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
