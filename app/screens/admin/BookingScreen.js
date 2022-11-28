import { useState, useEffect, useContext } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../data/Auth-Context";
import { useNavigation } from "@react-navigation/native";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import SubmitCancelButton from "../../components/ui/SubmitCancelButton";
import * as WebBrowser from "expo-web-browser";
import { CustomColors } from "../../utilities/CustomColors";
import DocumentBox from "../../components/ui/DocumentBox";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  LogBox,
  Alert,
  Image,
} from "react-native";
import SearchablePopUp from "../../components/ui/SearchablePopUp";
import LabelTextView from "../../components/ui/LabelTextView";
import TimeSelector from "../../components/ui/TimeSelector";
import DateSelectRow from "../../components/ui/DeteSelectRow";
import DeleteDialog from "../../components/dialog/DeleteDialog";
import InputText from "../../components/ui/InputText";
import SearchDialog from "../../components/dialog/SearchDialog";
import InputSelect from "../../components/ui/InputSelect";
import SingleDatePicker from "../../components/ui/SingleDatePicker";
import { URL } from "../../utilities/UrlBase";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import AttachmentDialog from "../../components/dialog/AttachmentDialog";
import ToastMessage from "../../components/toast/ToastMessage";
import * as MediaLibrary from "expo-media-library";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import PopUpPicker from "../../components/ui/PopUpPicker";

let attachmentArray = [];

export default function BookingScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const from = route.params.from;
  const typeOfTravel = route.params.typeOfTravel;
  let roomTypeTypeArray = [];
  let cabTypeArray = [];
  let cabSegmentArray = [];
  let paymentModeArray = [];
  let classOfTravelArray = [];
  let trainClassOfTravelArray = [];
  let trainQuotaArray = [];

  const [progressBar, setProgressBar] = useState(false);

  const [checkInDatePicker, setCheckInDatePicker] = useState(false);
  const [checkOutDatePicker, setCheckOutDatePicker] = useState(false);
  const [checkInTimePicker, setCheckInTimePicker] = useState(false);
  const [checkOutTimePicker, setCheckOutTimePicker] = useState(false);

  const [startPlaceDialog, setStartPlaceDialog] = useState(false);
  const [endPlaceDialog, setEndPlaceDialog] = useState(false);

  const [bookingDatePickerStatus, setBookingDatePickerStatus] = useState(false);

  const [invoiceDatePicker, setInvoiceDatePicker] = useState(false);
  const [attachmentDialogStatus, setAttachmentDialogStatus] = useState(false);
  const [documentDeleteDialog, setDocumentDeleteDialog] = useState(false);
  const [docName, setDocName] = useState(null);
  const [docId, setDocId] = useState(null);
  const [docFrom, setDocFrom] = useState(null);
  const [attachment, setAttachment] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [cabTypeList, setCabTypeList] = useState([]);
  const [cabSegmentList, setCabSegmentList] = useState([]);
  const [paymentModeList, setPaymentModeList] = useState([]);
  const [classOfTravelList, setClassOfTravelList] = useState([]);
  const [trainClassOfTravelList, setTrainClassOfTravelList] = useState([]);
  const [trainQuotaList, setTrainQuotaList] = useState([]);
  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();

  const paidByAdminList = [
    {
      id: 1,
      name: "YES",
    },
    {
      id: 2,
      name: "NO",
    },
  ];

  const [bookingDetails, setBookingDetails] = useState([]);

  const [accommodationBooking, setAccommodationBooking] = useState({
    requirement_id: null,
    checkin_time: "",
    checkout_time: "",
    place_of_stay: "",
    booking_status: 3,
    ticket_amount: 0,
    ticket_amount_personal: 0,
    comments: "",
    admin_paid: 1,
    vendor_name: "",
    amount_saved: "0",
    nac_rate: "0",
    rack_rate_night: "0",
    room_type: "",
    total_a: "0",
    total_b: "0",
    no_of_nights: "0",
    website: "via.com",
    PNR: "",
    requirement_code: "",
    payment_mode: "",
    booking_date: "",
    booking_date_json: "",
    checkinDate: "",
    checkinTime: "",
    checkoutDate: "",
    checkoutTime: "",
    checkInDateJson: "",
    checkOutDateJson: "",
  });

  const [cabBooking, setCabBooking] = useState({
    requirement_id: [],
    from_date: "",
    from_time: "",
    from_date_json: "",
    from_place: "",
    to_place: "",
    booking_status: 3,
    ticket_amount: 0,
    ticket_amount_personal: 0,
    comments: "",
    admin_paid: 1,
    vendor_name: "",
    travel_type_cab: "",
    cabType: "",
    cab_segment: "",
    cab_number: "",
    booking_date: "",
    booking_date_json: "",
    PNR: "",
    invoice_date: "",
    invoice_date_json: "",
    issuance_type: "",
    website: "via.com",
    requirement_code: "",
  });

  const [busBooking, setBusBooking] = useState({
    requirement_id: null,
    from_date: "",
    from_time: "",
    from_date_json: "",
    from_place: "",
    to_place: "",
    booking_status: 3,
    ticket_amount: 0,
    ticket_amount_personal: 0,
    comments: "",
    admin_paid: 1,
    vendor_name: "",
    bus_number: "",
    issuance_type: "",
    website: "via.com",
    PNR: "",
    requirement_code: "",
    class_of_travel: "",
    booking_date: "",
    booking_date_json: "",
  });

  const [trainBooking, setTrainBooking] = useState({
    requirement_id: null,
    from_date: "",
    from_time: "",
    from_date_json: "",
    from_place: "",
    to_place: "",
    booking_status: 3,
    train_number: "",
    ticket_amount: 0,
    ticket_amount_personal: 0,
    vendor_name: "",
    comments: "",
    admin_paid: 1,
    issuance_type: "",
    difference_inamount: 0,
    fare_quoted: 0,
    website: "via.com",
    ticket_no: "",
    PNR: "",
    requirement_code: "",
    train_quota: "",
    class_of_travel: "",
    booking_date: "",
    booking_date_json: "",
  });

  const [flightBooking, setFlightBooking] = useState({
    requirement_id: null,
    from_date: "",
    from_time: "",
    from_date_json: "",
    from_place: "",
    to_place: "",
    ref_no: "",
    booking_status: 3,
    ticket_amount: 0,
    vendor_name: "",
    comments: "",
    admin_paid: "",
    issuance_type: "",
    website: "via.com",
    ticket_no: "",
    PNR: "",
    requirement_code: "",
    booking_date: "",
  });

  console.log(
    "No of Nights :>> " + JSON.stringify(accommodationBooking.no_of_nights)
  );

  useEffect(() => {
    setMaxDate(route.params.maxDate);
    setMinDate(route.params.minDate);
  }, []);

  function NoOfDays(date1, date2) {
    const new_date1 = new Date(date1);
    const new_date2 = new Date(date2);
    const diffTime = Math.abs(new_date2 - new_date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const days = diffDays;
    AccommodationCalculation1(days);
    changedHandlerAccommodation("no_of_nights", days.toString());
  }

  const handleConfirmStartDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const d = moment(selectedDate).format("YYYY-MM-DD");
    setCheckInDatePicker(false);
    if (bookingDetails.bookingNeededId == 3) {
      changedHandlerBus("from_date", currentDate);
      changedHandlerBus("from_date_json", d);
    } else if (bookingDetails.bookingNeededId == 2) {
      changedHandlerCab("from_date", currentDate);
      changedHandlerCab("from_date_json", d);
    } else if (bookingDetails.bookingNeededId == 4) {
      changedHandlerTrain("from_date", currentDate);
      changedHandlerTrain("from_date_json", d);
    } else if (bookingDetails.bookingNeededId == 5) {
      changedHandlerFlight("from_date", currentDate);
      changedHandlerFlight("from_date_json", d);
    }
  };
  const handleConfirmStartTime = (selectedTime) => {
    const currentTime = moment(selectedTime).format("HH:mm");
    setCheckInTimePicker(false);
    if (bookingDetails.bookingNeededId == 3) {
      changedHandlerBus("from_time", currentTime);
    } else if (bookingDetails.bookingNeededId == 2) {
      changedHandlerCab("from_time", currentTime);
    } else if (bookingDetails.bookingNeededId == 4) {
      changedHandlerTrain("from_time", currentTime);
    } else if (bookingDetails.bookingNeededId == 5) {
      changedHandlerFlight("from_time", currentTime);
    }
  };

  const handleConfirmBookingDate = (selectedDate, from) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const jDate = moment(selectedDate).format("YYYY-MM-DD");
    setBookingDatePickerStatus(!bookingDatePickerStatus);
    if (from == "acc") {
      changedHandlerAccommodation("booking_date", currentDate);
      changedHandlerAccommodation("booking_date_json", jDate);
    } else if (from == "cab") {
      changedHandlerCab("booking_date", currentDate);
      changedHandlerCab("booking_date_json", jDate);
    } else if (from == "bus") {
      changedHandlerBus("booking_date", currentDate);
      changedHandlerBus("booking_date_json", jDate);
    } else if (from == "train") {
      changedHandlerTrain("booking_date", currentDate);
      changedHandlerTrain("booking_date_json", jDate);
    } else if (from == "flight") {
      changedHandlerFlight("booking_date", currentDate);
      changedHandlerFlight("booking_date_json", jDate);
    }
  };

  const handleConfirmCheckInDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const jDate = moment(selectedDate).format("YYYY-MM-DD");
    setCheckInDatePicker(false);
    changedHandlerAccommodation("checkinDate", currentDate);
    changedHandlerAccommodation("checkInDateJson", jDate);
  };
  const handleConfirmCheckOutDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const jDate = moment(selectedDate).format("YYYY-MM-DD");
    setCheckOutDatePicker(false);
    changedHandlerAccommodation("checkoutDate", currentDate);
    changedHandlerAccommodation("checkOutDateJson", jDate);
  };
  const handleConfirmCheckInTime = (selectedTime) => {
    const currentTime = moment(selectedTime).format("HH:mm");
    setCheckInTimePicker(false);
    changedHandlerAccommodation("checkinTime", currentTime);
  };
  const handleConfirmCheckOutTime = (selectedTime) => {
    const currentTime = moment(selectedTime).format("HH:mm");
    setCheckOutTimePicker(false);
    changedHandlerAccommodation("checkoutTime", currentTime);
  };

  async function getRoomType() {
    try {
      const response = await fetch(
        URL.COMMON_DROPDOWN + "accommondation_type",
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

      for (let i = 0; i < json.length; i++) {
        const obj = {
          id: json[i].value,
          name: json[i].name,
        };
        roomTypeTypeArray.push(obj);
      }
      setRoomTypeList(roomTypeTypeArray);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCabType() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "cab_type", {
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
        cabTypeArray.push(obj);
      }
      setCabTypeList(cabTypeArray);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCabSegment() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "cab_dropdown", {
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
        cabSegmentArray.push(obj);
      }
      setCabSegmentList(cabSegmentArray);
    } catch (error) {
      console.error(error);
    }
  }

  async function getPaymentMode() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "acc_payment", {
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
        paymentModeArray.push(obj);
      }
      setPaymentModeList(paymentModeArray);
    } catch (error) {
      console.error(error);
    }
  }

  async function getClassOfTravel() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "bus_class", {
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
        classOfTravelArray.push(obj);
      }
      setClassOfTravelList(classOfTravelArray);
    } catch (error) {
      console.error(error);
    }
  }

  async function getClassOfTravelTrain() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "train_class", {
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
        trainClassOfTravelArray.push(obj);
      }
      setTrainClassOfTravelList(trainClassOfTravelArray);
    } catch (error) {
      console.error(error);
    }
  }
  async function getTrainQuota() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "train_quota", {
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
        trainQuotaArray.push(obj);
      }
      setTrainQuotaList(trainQuotaArray);
    } catch (error) {
      console.error(error);
    }
  }

  function changedHandlerTrain(inputIdentifier, enteredValue) {
    setTrainBooking((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function changedHandlerAccommodation(inputIdentifier, enteredValue) {
    setAccommodationBooking((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function changedHandlerBus(inputIdentifier, enteredValue) {
    setBusBooking((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function changedHandlerCab(inputIdentifier, enteredValue) {
    setCabBooking((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  function changedHandlerFlight(inputIdentifier, enteredValue) {
    setFlightBooking((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  const onInvoiceDateChange = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const jdate = moment(selectedDate).format("YYYY-MM-DD");
    setInvoiceDatePicker(false);
    changedHandlerCab("invoice_date", currentDate);
    changedHandlerCab("invoice_date_json", jdate);
  };

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

  useEffect(() => {
    navigation.setOptions({
      title: "Booking",
    });
    setBookingDetails(route.params.details);

    LogBox.ignoreLogs(["Failed props"]);
  }, [route]);

  useEffect(() => {
    if (docId != null) {
      DownloadAttachment(docId, docName);
    }
  }, [docName]);

  function DownloadAttachment(id, name) {
    let url =
      URL.DOCUMENT_DOWNLOAD +
      "doc_option=download" +
      "&id=" +
      id +
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

  async function DocumentGet(reqId, reqType) {
    try {
      const response = await fetch(
        URL.REQUIREMENT_DOCUMENT_GET +
          reqId +
          "&ref_type=1" +
          "&requirement_type=" +
          reqType,
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

  useEffect(() => {
    if (bookingDetails.bookingNeededId == 1) {
      const inDate = new Date(bookingDetails.checkInDateJson);
      const outDate = new Date(bookingDetails.checkOutDateJson);

      const start = `${
        inDate.getMonth() + 1
      }/${inDate.getDate()}/${inDate.getFullYear()}`;
      const end = `${
        outDate.getMonth() + 1
      }/${outDate.getDate()}/${outDate.getFullYear()}`;

      NoOfDays(start, end);
    }
  }, [bookingDetails]);

  useEffect(() => {
    getRoomType();
    getCabSegment();
    getCabType();
    getPaymentMode();
    getClassOfTravel();
    getClassOfTravelTrain();
    getTrainQuota();
    // accommodation
    if (bookingDetails.bookingNeededId === 1) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      if (from === "book") {
        /*    changedHandlerAccommodation(
        "checkin_time",
        `${moment(bookingDetails.checkInDateMilliSec).format("YYYY-MM-DD")} ${
          bookingDetails.checkInTime
        }:00`
      );
      changedHandlerAccommodation(
        "checkout_time",
        `${moment(bookingDetails.checkOutDateMilliSec).format("YYYY-MM-DD")} ${
          bookingDetails.checkOutTime
        }:00`
      ); */

        changedHandlerAccommodation(
          "checkInDateJson",
          bookingDetails.checkInDateJson
        );
        changedHandlerAccommodation(
          "checkOutDateJson",
          bookingDetails.checkOutDateJson
        );

        changedHandlerAccommodation("checkinDate", bookingDetails.checkInDate);
        changedHandlerAccommodation(
          "checkoutDate",
          bookingDetails.checkOutDate
        );
        changedHandlerAccommodation("checkinTime", bookingDetails.checkInTime);
        changedHandlerAccommodation(
          "checkoutTime",
          bookingDetails.checkOutTime
        );

        changedHandlerAccommodation("room_type", bookingDetails.roomType);
        changedHandlerAccommodation(
          "place_of_stay",
          bookingDetails.placeOfStay
        );
        changedHandlerAccommodation("comments", bookingDetails.comments);
        changedHandlerAccommodation("requirement_id", bookingDetails.id);
        changedHandlerAccommodation(
          "requirement_code",
          bookingDetails.requirementCode
        );
      }
      if (from === "update") {
        GetAccommodation();
      }
    }

    // Cab
    if (bookingDetails.bookingNeededId === 2) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      if (from === "book") {
        /* changedHandlerCab(
        "from_time",
        `${moment(bookingDetails.fromDateMilliSec).format("YYYY-MM-DD")} ${
          bookingDetails.fromTime
        }:00`
      ); */

        changedHandlerCab("from_date", bookingDetails.fromDate);
        changedHandlerCab("from_date_json", bookingDetails.fromDateJson);
        changedHandlerCab("from_time", bookingDetails.fromTime);

        changedHandlerCab("from_place", bookingDetails.fromPlace);
        changedHandlerCab("to_place", bookingDetails.toPlace);
        changedHandlerCab("comments", bookingDetails.comments);
        changedHandlerCab("requirement_id", [bookingDetails.id]);
        changedHandlerCab("travel_type_cab", bookingDetails.travelTypeCabId);
        changedHandlerCab("cabType", bookingDetails.cabType);
        changedHandlerCab("cab_segment", bookingDetails.cabSegment);
        changedHandlerCab("requirement_code", bookingDetails.requirementCode);
      }

      if (from === "update") {
        GetCab();
      }
    }

    // Bus
    if (bookingDetails.bookingNeededId === 3) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      if (from === "book") {
        /* changedHandlerBus(
        "from_time",
        `${moment(bookingDetails.fromDateMilliSec).format("YYYY-MM-DD")} ${
          bookingDetails.fromTime
        }:00`
      ); */

        changedHandlerBus("from_date", bookingDetails.fromDate);
        changedHandlerBus("from_date_json", bookingDetails.fromDateJson);
        changedHandlerBus("from_time", bookingDetails.fromTime);
        changedHandlerBus("from_place", bookingDetails.fromPlace);
        changedHandlerBus("to_place", bookingDetails.toPlace);
        changedHandlerBus("comments", bookingDetails.comments);
        changedHandlerBus("requirement_id", bookingDetails.id);
        changedHandlerBus("requirement_code", bookingDetails.requirementCode);
      }

      if (from === "update") {
        GetBus();
      }
    }

    // Train
    if (bookingDetails.bookingNeededId === 4) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      if (from === "book") {
        /*  changedHandlerTrain(
        "from_time",
        `${moment(bookingDetails.fromDateMilliSec).format("YYYY-MM-DD")} ${
          bookingDetails.fromTime
        }:00`
      ); */

        changedHandlerTrain("from_date", bookingDetails.fromDate);
        changedHandlerTrain("from_date_json", bookingDetails.fromDateJson);
        changedHandlerTrain("from_time", bookingDetails.fromTime);

        changedHandlerTrain("from_place", bookingDetails.fromPlace);
        changedHandlerTrain("to_place", bookingDetails.toPlace);
        changedHandlerTrain("comments", bookingDetails.comments);
        changedHandlerTrain("requirement_id", bookingDetails.id);
        changedHandlerTrain("requirement_code", bookingDetails.requirementCode);
      }

      if (from === "update") {
        GetTrain();
      }
    }

    // Flight
    if (bookingDetails.bookingNeededId === 5) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      if (from === "book") {
        /* changedHandlerFlight(
        "from_time",
        `${moment(bookingDetails.fromDateMilliSec).format("YYYY-MM-DD")} ${
          bookingDetails.fromTime
        }:00`
      ); */

        changedHandlerFlight("from_date", bookingDetails.fromDate);
        changedHandlerFlight("from_date_json", bookingDetails.fromDateJson);
        changedHandlerFlight("from_time", bookingDetails.fromTime);

        changedHandlerFlight("from_place", bookingDetails.fromPlace);
        changedHandlerFlight("to_place", bookingDetails.toPlace);
        changedHandlerFlight("comments", bookingDetails.comments);
        changedHandlerFlight("requirement_id", bookingDetails.id);
        changedHandlerFlight(
          "requirement_code",
          bookingDetails.requirementCode
        );
      }

      if (from === "update") {
        GetFlight();
      }
    }
  }, [bookingDetails]);

  async function GetAccommodation() {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET +
          "requirement_id=" +
          bookingDetails.id +
          "&type=1",
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

      console.log("Accommodation Data :>> " + JSON.stringify(json));

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

        changedHandlerAccommodation(
          "requirement_code",
          json.data[position].requirement_code
        );
        changedHandlerAccommodation("requirement_id", bookingDetails.id);
        changedHandlerAccommodation(
          "checkinDate",
          DateFormate(json.data[position].checkin_time.split(" ")[0])
        );
        changedHandlerAccommodation(
          "checkinTime",
          json.data[position].checkin_time
            .split(" ")[1]
            .substring(
              0,
              json.data[position].checkin_time.split(" ")[1].length - 3
            )
        );
        changedHandlerAccommodation(
          "checkoutDate",
          DateFormate(json.data[position].checkout_time.split(" ")[0])
        );
        changedHandlerAccommodation(
          "checkoutTime",
          json.data[position].checkout_time
            .split(" ")[1]
            .substring(
              0,
              json.data[position].checkout_time.split(" ")[1].length - 3
            )
        );
        changedHandlerAccommodation(
          "checkInDateJson",
          DateFormate2(json.data[position].checkin_time.split(" ")[0])
        );
        changedHandlerAccommodation(
          "checkOutDateJson",
          DateFormate2(json.data[position].checkout_time.split(" ")[0])
        );

        changedHandlerAccommodation("comments", json.data[position].comments);
        changedHandlerAccommodation(
          "place_of_stay",
          json.data[position].place_of_stay
        );
        changedHandlerAccommodation(
          "vendor_name",
          json.data[position].vendor_name
        );
        changedHandlerAccommodation("room_type", json.data[position].room_type);

        changedHandlerAccommodation("PNR", json.data[position].PNR);
        changedHandlerAccommodation(
          "ticket_amount",
          json.data[position].ticket_amount.toString()
        );
        changedHandlerAccommodation(
          "ticket_amount_personal",
          json.data[position].ticket_amount_personal.toString()
        );
        changedHandlerAccommodation(
          "vendor_name",
          json.data[position].vendor_name
        );
        changedHandlerAccommodation(
          "admin_paid",
          json.data[position].admin_paid
        );
        changedHandlerAccommodation(
          "amount_saved",
          json.data[position].amount_saved.toString()
        );
        changedHandlerAccommodation("website", json.data[position].website);
        changedHandlerAccommodation(
          "nac_rate",
          json.data[position].nac_rate.toString()
        );
        changedHandlerAccommodation(
          "rack_rate_night",
          json.data[position].rack_rate_night.toString()
        );
        changedHandlerAccommodation(
          "total_a",
          json.data[position].total_a.toString()
        );
        changedHandlerAccommodation(
          "total_b",
          json.data[position].total_b.toString()
        );
        changedHandlerAccommodation(
          "no_of_nights",
          json.data[position].no_of_nights.toString()
        );
        changedHandlerAccommodation(
          "booking_date",
          DateFormate(json.data[position].booking_date.toString().split(" ")[0])
        );
        changedHandlerAccommodation(
          "booking_date_json",
          DateFormate2(
            json.data[position].booking_date.toString().split(" ")[0]
          )
        );
        changedHandlerAccommodation(
          "payment_mode",
          json.data[position].mode_of_payment.toString()
        );
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function GetCab() {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET +
          "requirement_id=" +
          bookingDetails.id +
          "&type=2",
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

      console.log("Cab Data :>> " + JSON.stringify(json));

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

        changedHandlerCab(
          "requirement_code",
          json.data[position].requirement_code
        );

        changedHandlerCab(
          "from_date",
          DateFormate(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerCab(
          "from_time",
          json.data[position].from_time
            .split(" ")[1]
            .substring(
              0,
              json.data[position].from_time.split(" ")[1].length - 3
            )
        );
        changedHandlerCab(
          "from_date_json",
          DateFormate2(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerCab("comments", json.data[position].comments);
        changedHandlerCab("from_place", json.data[position].from_place);
        changedHandlerCab("to_place", json.data[position].to_place);

        changedHandlerCab(
          "travel_type_cab",
          json.data[position].travel_type_cab
        );
        changedHandlerCab("cabType", json.data[position].travel_type_cab_value);
        changedHandlerCab("cab_segment", json.data[position].cab_segment);

        changedHandlerCab("PNR", json.data[position].PNR);
        changedHandlerCab(
          "ticket_amount",
          json.data[position].ticket_amount.toString()
        );
        changedHandlerCab(
          "ticket_amount_personal",
          json.data[position].ticket_amount_personal.toString()
        );
        changedHandlerCab("vendor_name", json.data[position].vendor_name);
        changedHandlerCab("admin_paid", json.data[position].admin_paid);
        changedHandlerCab("issuance_type", json.data[position].issuance_type);
        changedHandlerCab("website", json.data[position].website);
        changedHandlerCab("cab_number", json.data[position].cab_number);
        changedHandlerCab(
          "invoice_date",
          DateFormate(json.data[position].invoice_date.toString().split(" ")[0])
        );
        changedHandlerCab(
          "invoice_date_json",
          DateFormate2(
            json.data[position].invoice_date.toString().split(" ")[0]
          )
        );
        changedHandlerCab(
          "booking_date",
          DateFormate(json.data[position].booking_date.toString().split(" ")[0])
        );
        changedHandlerCab(
          "booking_date_json",
          DateFormate2(
            json.data[position].booking_date.toString().split(" ")[0]
          )
        );
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function GetBus() {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET +
          "requirement_id=" +
          bookingDetails.id +
          "&type=3",
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

      console.log("Bus Data :>> " + JSON.stringify(json));

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

        changedHandlerBus(
          "from_date",
          DateFormate(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerBus(
          "from_time",
          json.data[position].from_time
            .split(" ")[1]
            .substring(
              0,
              json.data[position].from_time.split(" ")[1].length - 3
            )
        );
        changedHandlerBus(
          "from_date_json",
          DateFormate2(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerBus("comments", json.data[position].comments);
        changedHandlerBus(
          "requirement_code",
          json.data[position].requirement_code
        );
        changedHandlerBus("from_place", json.data[position].from_place);
        changedHandlerBus("to_place", json.data[position].to_place);

        changedHandlerBus("PNR", json.data[position].PNR);
        changedHandlerBus(
          "ticket_amount",
          json.data[position].ticket_amount.toString()
        );
        changedHandlerBus(
          "ticket_amount_personal",
          json.data[position].ticket_amount_personal.toString()
        );
        changedHandlerBus("vendor_name", json.data[position].vendor_name);
        changedHandlerBus("admin_paid", json.data[position].admin_paid);
        changedHandlerBus("issuance_type", json.data[position].issuance_type);
        changedHandlerBus("website", json.data[position].website);
        changedHandlerBus("bus_number", json.data[position].bus_number);
        changedHandlerBus(
          "booking_date",
          DateFormate(json.data[position].booking_date.toString().split(" ")[0])
        );
        changedHandlerBus(
          "booking_date_json",
          DateFormate2(
            json.data[position].booking_date.toString().split(" ")[0]
          )
        );
        changedHandlerBus(
          "class_of_travel",
          json.data[position].class_of_travel
        );
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function GetTrain() {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET +
          "requirement_id=" +
          bookingDetails.id +
          "&type=4",
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

      console.log("Train Data :>> " + JSON.stringify(json));

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

        changedHandlerTrain(
          "requirement_code",
          json.data[position].requirement_code
        );

        changedHandlerTrain(
          "from_date",
          DateFormate(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerTrain(
          "from_time",
          json.data[position].from_time
            .split(" ")[1]
            .substring(
              0,
              json.data[position].from_time.split(" ")[1].length - 3
            )
        );
        changedHandlerTrain(
          "from_date_json",
          DateFormate2(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerTrain("comments", json.data[position].comments);
        changedHandlerTrain("from_place", json.data[position].from_place);
        changedHandlerTrain("to_place", json.data[position].to_place);

        changedHandlerTrain("PNR", json.data[position].PNR);
        changedHandlerTrain("train_number", json.data[position].train_number);
        changedHandlerTrain(
          "ticket_amount",
          json.data[position].ticket_amount.toString()
        );
        changedHandlerTrain(
          "ticket_amount_personal",
          json.data[position].ticket_amount_personal.toString()
        );
        changedHandlerTrain("vendor_name", json.data[position].vendor_name);
        changedHandlerTrain("admin_paid", json.data[position].admin_paid);
        changedHandlerTrain("issuance_type", json.data[position].issuance_type);
        changedHandlerTrain("website", json.data[position].website);
        changedHandlerTrain("ticket_no", json.data[position].ticket_no);
        changedHandlerTrain("train_quota", json.data[position].train_quota);
        changedHandlerTrain(
          "class_of_travel",
          json.data[position].class_of_travel
        );
        changedHandlerTrain(
          "booking_date",
          DateFormate(json.data[position].booking_date.toString().split(" ")[0])
        );
        changedHandlerTrain(
          "booking_date_json",
          DateFormate2(
            json.data[position].booking_date.toString().split(" ")[0]
          )
        );
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function GetFlight() {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET +
          "requirement_id=" +
          bookingDetails.id +
          "&type=5",
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

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

        changedHandlerFlight(
          "requirement_code",
          json.data[position].requirement_code
        );

        changedHandlerFlight(
          "from_date",
          DateFormate(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerFlight(
          "from_time",
          json.data[position].from_time
            .split(" ")[1]
            .substring(
              0,
              json.data[position].from_time.split(" ")[1].length - 3
            )
        );
        changedHandlerFlight(
          "from_date_json",
          DateFormate2(json.data[position].from_time.split(" ")[0])
        );
        changedHandlerFlight("comments", json.data[position].comments);
        changedHandlerFlight("from_place", json.data[position].from_place);
        changedHandlerFlight("to_place", json.data[position].to_place);

        changedHandlerFlight("PNR", json.data[position].PNR);
        changedHandlerFlight("ref_no", json.data[position].ref_no);
        changedHandlerFlight(
          "ticket_amount",
          json.data[position].ticket_amount.toString()
        );
        changedHandlerFlight("vendor_name", json.data[position].vendor_name);
        changedHandlerFlight("admin_paid", json.data[position].admin_paid);
        changedHandlerFlight(
          "issuance_type",
          json.data[position].issuance_type
        );
        changedHandlerFlight("website", json.data[position].website);
        changedHandlerFlight("ticket_no", json.data[position].ticket_no);
        changedHandlerFlight(
          "booking_date",
          DateFormate(json.data[position].booking_date.toString().split(" ")[0])
        );
        changedHandlerFlight(
          "booking_date_json",
          DateFormate2(
            json.data[position].booking_date.toString().split(" ")[0]
          )
        );
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
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

  useEffect(() => {
    changedHandlerAccommodation(
      "amount_saved",
      (
        parseInt(accommodationBooking.total_a) -
        parseInt(accommodationBooking.total_b)
      ).toString()
    );
  }, [accommodationBooking.total_a, accommodationBooking.total_b]);

  function AccommodationCalculation1(value) {
    changedHandlerAccommodation(
      "total_a",
      (
        parseInt(accommodationBooking.rack_rate_night) * parseInt(value)
      ).toString()
    );
    changedHandlerAccommodation(
      "total_b",
      (parseInt(accommodationBooking.nac_rate) * parseInt(value)).toString()
    );
  }

  function AccommodationCalculation2(value) {
    changedHandlerAccommodation(
      "total_a",
      (parseInt(accommodationBooking.no_of_nights) * parseInt(value)).toString()
    );
  }

  function AccommodationCalculation3(value) {
    changedHandlerAccommodation(
      "total_b",
      (parseInt(accommodationBooking.no_of_nights) * parseInt(value)).toString()
    );
  }

  function AccommodationBookingScreen() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.travelHeader}>
          <View style={styles.travelNo}>
            <Text>Travel No: </Text>
            <Text>{bookingDetails.travelNo}</Text>
          </View>

          <View style={styles.travelNo}>
            <Text>Req Code: </Text>
            <Text style={{ color: "#FE5886" }}>
              {accommodationBooking.requirement_code}
            </Text>
          </View>
        </View>

        <DateTimeSelector
          inDateLabel="Check-In Date:*"
          inDateLabelhint="In Date"
          inTimeLabel="Check-In Time:*"
          inTimeLabelhint="In Time"
          outDateLabel="Check-Out Date:*"
          outDateLabelhint="Out Date"
          outTimeLabel="Check-Out Time:*"
          outTimeLabelhint="Out Time"
          inDate={accommodationBooking.checkinDate}
          outDate={accommodationBooking.checkoutDate}
          inTime={accommodationBooking.checkinTime}
          outTime={accommodationBooking.checkoutTime}
          inDateOnPress={() => {
            setCheckInDatePicker(!checkInDatePicker);
          }}
          outDateOnPress={() => {
            setCheckOutDatePicker(!checkOutDatePicker);
          }}
          inTimeOnPress={() => setCheckInTimePicker(!checkInTimePicker)}
          outTimeOnPress={() => setCheckOutTimePicker(!checkOutTimePicker)}
        />

        <DateTimePickerModal
          isVisible={checkInDatePicker}
          mode="date"
          onConfirm={handleConfirmCheckInDate}
          onCancel={() => {
            setCheckInDatePicker(false);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <DateTimePickerModal
          isVisible={checkOutDatePicker}
          mode="date"
          onConfirm={handleConfirmCheckOutDate}
          onCancel={() => {
            setCheckOutDatePicker(false);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <DateTimePickerModal
          isVisible={checkInTimePicker}
          mode="time"
          locale="en_GB"
          date={new Date()}
          display={Platform.OS == "ios" ? "spinner" : "default"}
          is24Hour={true}
          minuteInterval={15}
          onConfirm={handleConfirmCheckInTime}
          onCancel={() => {
            setCheckInTimePicker(false);
          }}
        />

        <DateTimePickerModal
          isVisible={checkOutTimePicker}
          mode="time"
          locale="en_GB"
          date={new Date()}
          display={Platform.OS == "ios" ? "spinner" : "default"}
          is24Hour={true}
          minuteInterval={15}
          onConfirm={handleConfirmCheckOutTime}
          onCancel={() => {
            setCheckOutTimePicker(false);
          }}
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

        <InputText
          label="Place of stay:*"
          hint="Place of stay"
          value={accommodationBooking.place_of_stay}
          onChangeEvent={changedHandlerAccommodation.bind(
            this,
            "place_of_stay"
          )}
        />

        <InputText
          label="Remarks:"
          hint="Leave your remarks"
          value={accommodationBooking.comments}
          onChangeEvent={changedHandlerAccommodation.bind(this, "comments")}
        />

        <InputText
          label="Vendor Name:"
          hint="Vendor Name"
          value={accommodationBooking.vendor_name}
          onChangeEvent={changedHandlerAccommodation.bind(this, "vendor_name")}
        />

        <SearchablePopUp
          listData={paidByAdminList}
          label="Paid by Admin:*"
          title="Paid by Admin?"
          hint="Paid by Admin?"
          pickerId="paid_by_admin"
          selected={accommodationBooking.admin_paid}
          setSelected={changedHandlerAccommodation.bind(this, "admin_paid")}
        />

        <InputText
          label="PNR No:*"
          hint="PNR No"
          value={accommodationBooking.PNR}
          onChangeEvent={changedHandlerAccommodation.bind(this, "PNR")}
        />

        <InputText
          label="Booking site:"
          hint="Booking site"
          value={accommodationBooking.website}
          onChangeEvent={changedHandlerAccommodation.bind(this, "website")}
        />

        <PopUpPicker
          listData={roomTypeList}
          label="Room Type:*"
          title="Select Room Type"
          hint="Room Type"
          pickerId="room_type"
          selectedName={accommodationBooking.room_type}
          setSelectedName={changedHandlerAccommodation.bind(this, "room_type")}
          // setSelectedId={inputChangedHandler.bind(this, "roomTypeId")}
        />

        <InputText
          label="No of nights:*"
          hint="No of nights"
          keyboard="numeric"
          value={accommodationBooking.no_of_nights}
          onChangeEvent={(value) => {
            AccommodationCalculation1(value);
            changedHandlerAccommodation("no_of_nights", value);
          }}
        />

        <InputText
          label="NAC Rate:*"
          hint="Enter ammount"
          keyboard="numeric"
          value={accommodationBooking.nac_rate}
          onChangeEvent={(value) => {
            AccommodationCalculation3(value);
            changedHandlerAccommodation("nac_rate", value);
          }}
        />

        <InputText
          label="Rack rate/night:*"
          hint="rate/night"
          keyboard="numeric"
          value={accommodationBooking.rack_rate_night}
          onChangeEvent={(value) => {
            AccommodationCalculation2(value);
            changedHandlerAccommodation("rack_rate_night", value);
          }}
        />
        <LabelTextView
          label="Total (A)"
          hint="Total (A)"
          value={accommodationBooking.total_a}
        />
        <LabelTextView
          label="Total (B)"
          hint="Total (B)"
          value={accommodationBooking.total_b}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Official Booked Ammount:*"
            hint="Booking Amount"
            value={accommodationBooking.ticket_amount}
            onChangeEvent={(text) => {
              changedHandlerAccommodation("ticket_amount", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Personal Booked Ammount:*"
            hint="Booking Amount"
            value={accommodationBooking.ticket_amount_personal}
            onChangeEvent={(text) => {
              changedHandlerAccommodation(
                "ticket_amount_personal",
                parseInt(text)
              );
            }}
            keyboard="numeric"
          />
        )}

        <LabelTextView
          label="Cost Saved (A-B)"
          hint="Cost Saved (A-B)"
          value={accommodationBooking.amount_saved}
        />

        <DateSelectRow
          label="Booking Date:*"
          hint="Select Booking Date"
          selected={accommodationBooking.booking_date}
          onPressEvent={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
        />

        <DateTimePickerModal
          isVisible={bookingDatePickerStatus}
          mode="date"
          onConfirm={(value) => {
            handleConfirmBookingDate(value, "acc");
          }}
          onCancel={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
        />

        <PopUpPicker
          listData={paymentModeList}
          label="Payment Mode:*"
          title="Select Payment Mode"
          hint="Payment Mode"
          pickerId="payment_mode"
          selectedName={accommodationBooking.payment_mode}
          /*  setSelectedName={changedHandlerAccommodation.bind(
            this,
            "payment_mode"
          )} */
          setSelectedId={changedHandlerAccommodation.bind(this, "payment_mode")}
        />
      </ScrollView>
    );
  }

  function CabBookingScreen() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.travelHeader}>
          <View style={styles.travelNo}>
            <Text>Travel No: </Text>
            <Text>{bookingDetails.travelNo}</Text>
          </View>

          <View style={styles.travelNo}>
            <Text>Req Code: </Text>
            <Text style={{ color: "#FE5886" }}>
              {cabBooking.requirement_code}
            </Text>
          </View>
        </View>

        <TimeSelector
          startDate={cabBooking.from_date}
          startTime={cabBooking.from_time}
          startDateOnPress={() => setCheckInDatePicker(!checkInDatePicker)}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
        />

        <DateTimePickerModal
          isVisible={checkInDatePicker}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={() => {
            setCheckInDatePicker(false);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <DateTimePickerModal
          isVisible={checkInTimePicker}
          mode="time"
          locale="en_GB"
          date={new Date()}
          display={Platform.OS == "ios" ? "spinner" : "default"}
          is24Hour={true}
          minuteInterval={15}
          onConfirm={handleConfirmStartTime}
          onCancel={() => {
            setCheckInTimePicker(false);
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

        <InputText
          label="From Place:"
          hint="From Place"
          value={cabBooking.from_place}
          onChangeEvent={changedHandlerCab.bind(this, "from_place")}
        />
        <InputText
          label="To Place:"
          hint="To Place"
          value={cabBooking.to_place}
          onChangeEvent={changedHandlerCab.bind(this, "to_place")}
        />

        <PopUpPicker
          listData={cabSegmentList}
          label="Cab Segment:*"
          title="Select Cab Segment"
          hint="Cab Segment"
          pickerId="cab_segment"
          selectedName={cabBooking.cab_segment}
          setSelectedName={changedHandlerCab.bind(this, "cab_segment")}
          //  setSelectedId={inputChangedHandler.bind(this, "cabSegmentId")}
        />

        <PopUpPicker
          listData={cabTypeList}
          label="Cab Type:*"
          title="Select Cab Type"
          hint="Cab Type"
          pickerId="cab_type"
          selectedName={cabBooking.cabType}
          setSelectedName={changedHandlerCab.bind(this, "cabType")}
          setSelectedId={changedHandlerCab.bind(this, "travel_type_cab")}
        />

        <InputText
          label="Remarks:"
          hint="Leave your remarks"
          value={cabBooking.comments}
          onChangeEvent={changedHandlerCab.bind(this, "comments")}
        />

        <InputText
          label="Cab No:*"
          hint="Cab No"
          value={cabBooking.cab_number}
          onChangeEvent={changedHandlerCab.bind(this, "cab_number")}
        />

        <InputText
          label="Vendor Name:*"
          hint="Vendor"
          value={cabBooking.vendor_name}
          onChangeEvent={changedHandlerCab.bind(this, "vendor_name")}
        />

        <SearchablePopUp
          listData={paidByAdminList}
          label="Paid by Admin:*"
          title="Paid by Admin?"
          hint="Paid by Admin?"
          pickerId="paid_by_admin"
          selected={cabBooking.admin_paid}
          setSelected={changedHandlerCab.bind(this, "admin_paid")}
        />

        <InputText
          label="Invoice No:"
          hint="Invoice No"
          value={cabBooking.PNR}
          onChangeEvent={changedHandlerCab.bind(this, "PNR")}
        />

        <SingleDatePicker
          label="Invoice Date:"
          hint="Invoice Date"
          dateValue={cabBooking.invoice_date}
          dateOnPress={() => {
            setInvoiceDatePicker(true);
          }}
        />

        {invoiceDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            display="default"
            onChange={onInvoiceDateChange}
          ></DateTimePicker>
        )}

        <InputText
          label="Booking site:"
          hint="Booking site"
          value={cabBooking.website}
          onChangeEvent={changedHandlerCab.bind(this, "website")}
        />

        <InputText
          label="Issuance Type:"
          hint="Issuance"
          value={cabBooking.issuance_type}
          onChangeEvent={changedHandlerCab.bind(this, "issuance_type")}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Official Booked Ammount:*"
            hint="Booking Amount"
            value={cabBooking.ticket_amount}
            onChangeEvent={(text) => {
              changedHandlerCab("ticket_amount", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Personal Booked Ammount:*"
            hint="Booking Amount"
            value={cabBooking.ticket_amount_personal}
            onChangeEvent={(text) => {
              changedHandlerCab("ticket_amount_personal", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        <DateSelectRow
          label="Booking Date:*"
          hint="Select Booking Date"
          selected={cabBooking.booking_date}
          onPressEvent={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
        />

        <DateTimePickerModal
          isVisible={bookingDatePickerStatus}
          mode="date"
          onConfirm={(value) => {
            handleConfirmBookingDate(value, "cab");
          }}
          onCancel={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
        />
      </ScrollView>
    );
  }

  function BusBookingScreen() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.travelHeader}>
          <View style={styles.travelNo}>
            <Text>Travel No: </Text>
            <Text>{bookingDetails.travelNo}</Text>
          </View>

          <View style={styles.travelNo}>
            <Text>Req Code: </Text>
            <Text style={{ color: "#FE5886" }}>
              {busBooking.requirement_code}
            </Text>
          </View>
        </View>

        <TimeSelector
          startDate={busBooking.from_date}
          startTime={busBooking.from_time}
          startDateOnPress={() => setCheckInDatePicker(!checkInDatePicker)}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
        />

        <DateTimePickerModal
          isVisible={checkInDatePicker}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={() => {
            setCheckInDatePicker(false);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <DateTimePickerModal
          isVisible={checkInTimePicker}
          mode="time"
          locale="en_GB"
          date={new Date()}
          display={Platform.OS == "ios" ? "spinner" : "default"}
          is24Hour={true}
          minuteInterval={15}
          onConfirm={handleConfirmStartTime}
          onCancel={() => {
            setCheckInTimePicker(false);
          }}
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

        <InputText
          label="From Place:*"
          hint="From Place"
          value={busBooking.from_place}
          onChangeEvent={changedHandlerBus.bind(this, "from_place")}
        />

        <InputText
          label="To Place:*"
          hint="To Place"
          value={busBooking.to_place}
          onChangeEvent={changedHandlerBus.bind(this, "to_place")}
        />

        <InputText
          label="Remarks:"
          hint="Leave your remarks"
          value={busBooking.comments}
          onChangeEvent={changedHandlerBus.bind(this, "comments")}
        />

        <InputText
          label="PNR No:*"
          hint="PNR No"
          value={busBooking.PNR}
          onChangeEvent={changedHandlerBus.bind(this, "PNR")}
        />

        <InputText
          label="Bus No:*"
          hint="Bus No"
          value={busBooking.bus_number}
          onChangeEvent={changedHandlerBus.bind(this, "bus_number")}
        />

        <InputText
          label="Vendor Name:*"
          hint="Vendor"
          value={busBooking.vendor_name}
          onChangeEvent={changedHandlerBus.bind(this, "vendor_name")}
        />

        <SearchablePopUp
          listData={paidByAdminList}
          label="Paid by Admin:*"
          title="Paid by Admin?"
          hint="Paid by Admin?"
          pickerId="paid_by_admin"
          selected={busBooking.admin_paid}
          setSelected={changedHandlerBus.bind(this, "admin_paid")}
        />

        <InputText
          label="Booking site:"
          hint="Booking site"
          value={busBooking.website}
          onChangeEvent={changedHandlerBus.bind(this, "website")}
        />

        <InputText
          label="Issuance Type:"
          hint="Issuance"
          value={busBooking.issuance_type}
          onChangeEvent={changedHandlerBus.bind(this, "issuance_type")}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Official Booked Ammount:*"
            hint="Booking Amount"
            value={busBooking.ticket_amount}
            onChangeEvent={(text) => {
              changedHandlerBus("ticket_amount", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Personal Booked Ammount:*"
            hint="Booking Amount"
            value={busBooking.ticket_amount_personal}
            onChangeEvent={(text) => {
              changedHandlerBus("ticket_amount_personal", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        <DateSelectRow
          label="Booking Date:*"
          hint="Select Booking Date"
          selected={busBooking.booking_date}
          onPressEvent={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
        />

        <DateTimePickerModal
          isVisible={bookingDatePickerStatus}
          mode="date"
          onConfirm={(value) => {
            handleConfirmBookingDate(value, "bus");
          }}
          onCancel={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
        />

        <PopUpPicker
          listData={classOfTravelList}
          label="Class Of Travel:*"
          title="Choose class of travel"
          hint="Choose class"
          pickerId="class_of_travel"
          selectedName={busBooking.class_of_travel}
          setSelectedName={changedHandlerBus.bind(this, "class_of_travel")}
          /*  setSelectedId={changedHandlerAccommodation.bind(this, "class_of_travel")} */
        />
      </ScrollView>
    );
  }

  function TrainBookingScreen() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.travelHeader}>
          <View style={styles.travelNo}>
            <Text>Travel No: </Text>
            <Text>{bookingDetails.travelNo}</Text>
          </View>

          <View style={styles.travelNo}>
            <Text>Req Code: </Text>
            <Text style={{ color: "#FE5886" }}>
              {trainBooking.requirement_code}
            </Text>
          </View>
        </View>

        <TimeSelector
          startDate={trainBooking.from_date}
          startTime={trainBooking.from_time}
          startDateOnPress={() => setCheckInDatePicker(!checkInDatePicker)}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
        />

        <DateTimePickerModal
          isVisible={checkInDatePicker}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={() => {
            setCheckInDatePicker(false);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <DateTimePickerModal
          isVisible={checkInTimePicker}
          mode="time"
          locale="en_GB"
          date={new Date()}
          display={Platform.OS == "ios" ? "spinner" : "default"}
          is24Hour={true}
          minuteInterval={15}
          onConfirm={handleConfirmStartTime}
          onCancel={() => {
            setCheckInTimePicker(false);
          }}
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

        <InputText
          label="From Place:*"
          hint="From Place"
          value={trainBooking.from_place}
          onChangeEvent={changedHandlerTrain.bind(this, "from_place")}
        />

        <InputText
          label="To Place:*"
          hint="To Place"
          value={trainBooking.to_place}
          onChangeEvent={changedHandlerTrain.bind(this, "to_place")}
        />

        <InputText
          label="Remarks:"
          hint="Leave your remarks"
          value={trainBooking.comments}
          onChangeEvent={changedHandlerTrain.bind(this, "comments")}
        />

        <InputText
          label="Train No:*"
          hint="Train"
          value={trainBooking.train_number}
          onChangeEvent={changedHandlerTrain.bind(this, "train_number")}
        />

        <InputText
          label="PNR No:"
          hint="PNR No"
          value={trainBooking.PNR}
          onChangeEvent={changedHandlerTrain.bind(this, "PNR")}
        />

        <InputText
          label="Vendor Name:"
          hint="Vendor"
          value={trainBooking.vendor_name}
          onChangeEvent={changedHandlerTrain.bind(this, "vendor_name")}
        />

        <SearchablePopUp
          listData={paidByAdminList}
          label="Paid by Admin:*"
          title="Paid by Admin?"
          hint="Paid by Admin?"
          pickerId="paid_by_admin"
          selected={trainBooking.admin_paid}
          setSelected={changedHandlerTrain.bind(this, "admin_paid")}
        />

        <InputText
          label="Booking site:"
          hint="Booking site"
          value={trainBooking.website}
          onChangeEvent={changedHandlerTrain.bind(this, "website")}
        />

        <InputText
          label="Issuance Type:"
          hint="Issuance"
          value={trainBooking.issuance_type}
          onChangeEvent={changedHandlerTrain.bind(this, "issuance_type")}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Official Booked Ammount:*"
            hint="Booking Amount"
            value={trainBooking.ticket_amount}
            onChangeEvent={(text) => {
              changedHandlerTrain("ticket_amount", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Personal Booked Ammount:*"
            hint="Booking Amount"
            value={trainBooking.ticket_amount_personal}
            onChangeEvent={(text) => {
              changedHandlerTrain("ticket_amount_personal", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        <DateSelectRow
          label="Booking Date:*"
          hint="Select Booking Date"
          selected={trainBooking.booking_date}
          onPressEvent={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
        />

        <DateTimePickerModal
          isVisible={bookingDatePickerStatus}
          mode="date"
          onConfirm={(value) => {
            handleConfirmBookingDate(value, "train");
          }}
          onCancel={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
        />

        <PopUpPicker
          listData={trainClassOfTravelList}
          label="Class Of Travel:*"
          title="Choose class of travel"
          hint="Choose class"
          pickerId="class_of_travel"
          selectedName={trainBooking.class_of_travel}
          setSelectedName={changedHandlerTrain.bind(this, "class_of_travel")}
          /*  setSelectedId={changedHandlerTrain.bind(this, "class_of_travel")} */
        />

        <PopUpPicker
          listData={trainQuotaList}
          label="Train Quota:*"
          title="Choose Train Quota"
          hint="Choose Train Quota"
          pickerId="train_quota"
          selectedName={trainBooking.train_quota}
          setSelectedName={changedHandlerTrain.bind(this, "train_quota")}
          /*  setSelectedId={changedHandlerTrain.bind(this, "class_of_travel")} */
        />
      </ScrollView>
    );
  }

  function FlightBookingScreen() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        <View style={styles.travelHeader}>
          <View style={styles.travelNo}>
            <Text>Travel No: </Text>
            <Text>{bookingDetails.travelNo}</Text>
          </View>

          <View style={styles.travelNo}>
            <Text>Req Code: </Text>
            <Text style={{ color: "#FE5886" }}>
              {flightBooking.requirement_code}
            </Text>
          </View>
        </View>

        <TimeSelector
          startDate={flightBooking.from_date}
          startTime={flightBooking.from_time}
          startDateOnPress={() => setCheckInDatePicker(!checkInDatePicker)}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
        />

        <DateTimePickerModal
          isVisible={checkInDatePicker}
          mode="date"
          onConfirm={handleConfirmStartDate}
          onCancel={() => {
            setCheckInDatePicker(false);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        <DateTimePickerModal
          isVisible={checkInTimePicker}
          mode="time"
          locale="en_GB"
          date={new Date()}
          display={Platform.OS == "ios" ? "spinner" : "default"}
          is24Hour={true}
          minuteInterval={15}
          onConfirm={handleConfirmStartTime}
          onCancel={() => {
            setCheckInTimePicker(false);
          }}
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

        <InputSelect
          label="Start Place:*"
          hint="Choose Start Place"
          selected={flightBooking.from_place}
          onPressEvent={() => setStartPlaceDialog(!startPlaceDialog)}
        />
        <InputSelect
          label="End Place:*"
          hint="Choose End Place"
          selected={flightBooking.to_place}
          onPressEvent={() => setEndPlaceDialog(!endPlaceDialog)}
        />
        {startPlaceDialog && (
          <SearchDialog
            dialogstatus={startPlaceDialog}
            setdialogstatus={setStartPlaceDialog}
            from="startPlace"
            setValue={changedHandlerFlight.bind(this, "from_place")}
          />
        )}

        {endPlaceDialog && (
          <SearchDialog
            dialogstatus={endPlaceDialog}
            setdialogstatus={setEndPlaceDialog}
            from="toPlace"
            setValue={changedHandlerFlight.bind(this, "to_place")}
          />
        )}

        <InputText
          label="Remarks:"
          hint="Leave your remarks"
          value={flightBooking.comments}
          onChangeEvent={changedHandlerFlight.bind(this, "comments")}
        />

        <InputText
          label="PNR No:*"
          hint="PNR No"
          value={flightBooking.PNR}
          onChangeEvent={changedHandlerFlight.bind(this, "PNR")}
        />

        <InputText
          label="Vendor Name:*"
          hint="Vendor"
          value={flightBooking.vendor_name}
          onChangeEvent={changedHandlerFlight.bind(this, "vendor_name")}
        />

        <SearchablePopUp
          listData={paidByAdminList}
          label="Paid by Admin:*"
          title="Paid by Admin?"
          hint="Paid by Admin?"
          pickerId="paid_by_admin"
          selected={flightBooking.admin_paid}
          setSelected={changedHandlerFlight.bind(this, "admin_paid")}
        />

        <InputText
          label="Booking site:"
          hint="Booking site"
          value={flightBooking.website}
          onChangeEvent={changedHandlerFlight.bind(this, "website")}
        />

        <InputText
          label="Issuance Type:"
          hint="Issuance"
          value={flightBooking.issuance_type}
          onChangeEvent={changedHandlerFlight.bind(this, "issuance_type")}
        />

        <InputText
          label="Ticket No:*"
          hint="Ticket No"
          value={flightBooking.ticket_no}
          onChangeEvent={changedHandlerFlight.bind(this, "ticket_no")}
        />

        <InputText
          label="Reference No:*"
          hint="Reference No"
          value={flightBooking.ref_no}
          onChangeEvent={changedHandlerFlight.bind(this, "ref_no")}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Official Booked Ammount:*"
            hint="Booking Amount"
            value={flightBooking.ticket_amount}
            onChangeEvent={(text) => {
              changedHandlerFlight("ticket_amount", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <InputText
            label="Personal Booked Ammount:*"
            hint="Booking Amount"
            value={flightBooking.ticket_amount_personal}
            onChangeEvent={(text) => {
              changedHandlerFlight("ticket_amount_personal", parseInt(text));
            }}
            keyboard="numeric"
          />
        )}
        <DateSelectRow
          label="Booking Date:*"
          hint="Select Booking Date"
          selected={flightBooking.booking_date}
          onPressEvent={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
        />

        <DateTimePickerModal
          isVisible={bookingDatePickerStatus}
          mode="date"
          onConfirm={(value) => {
            handleConfirmBookingDate(value, "flight");
          }}
          onCancel={() => {
            setBookingDatePickerStatus(!bookingDatePickerStatus);
          }}
          display={Platform.OS == "ios" ? "inline" : "default"}
        />
      </ScrollView>
    );
  }

  function AccommodationBookingValidation() {
    if (accommodationBooking.admin_paid != null) {
      if (accommodationBooking.PNR != "") {
        if (accommodationBooking.no_of_nights != "") {
          if (accommodationBooking.nac_rate != "") {
            if (accommodationBooking.rack_rate_night != "") {
              AccommodationBooking();
            } else {
              Alert.alert("Check rate/night");
            }
          } else {
            Alert.alert("Check NAC rate");
          }
        } else {
          Alert.alert("Check no of nights");
        }
      } else {
        Alert.alert("Check PNR number");
      }
    } else {
      Alert.alert("Select Paid by admin");
    }
  }

  function CabBookingValidation() {
    if (cabBooking.cab_number != "") {
      if (cabBooking.vendor_name != "") {
        if (cabBooking.admin_paid != null) {
          CabBooking();
        } else {
          Alert.alert("Select Paid by admin");
        }
      } else {
        Alert.alert("Check vendor name");
      }
    } else {
      Alert.alert("Check cab number");
    }
  }

  function BusBookingValidation() {
    if (busBooking.PNR != "") {
      if (busBooking.bus_number != "") {
        if (busBooking.vendor_name != "") {
          if (busBooking.admin_paid != "") {
            BusBooking();
          } else {
            Alert.alert("Select Paid by admin");
          }
        } else {
          Alert.alert("Check vendor name");
        }
      } else {
        Alert.alert("Check bus number");
      }
    } else {
      Alert.alert("Check PNR number");
    }
  }

  function TrainBookingValidation() {
    if (trainBooking.train_number != "") {
      if (trainBooking.admin_paid != null) {
        TrainBooking();
      } else {
        Alert.alert("Select Paid by admin");
      }
    } else {
      Alert.alert("Check train number");
    }
  }

  function FlightBookingValidation() {
    if (flightBooking.PNR != "") {
      if (flightBooking.vendor_name != "") {
        if (flightBooking.admin_paid != "") {
          if (flightBooking.ticket_no != "") {
            if (flightBooking.ref_no != "") {
              FlightBooking();
            } else {
              Alert.alert("Check reference number");
            }
          } else {
            Alert.alert("Check ticket number");
          }
        } else {
          Alert.alert("Select Paid by admin");
        }
      } else {
        Alert.alert("Check vendor name");
      }
    } else {
      Alert.alert("Check PNR number");
    }
  }

  async function AccommodationBooking() {
    setProgressBar(true);
    const accObj = {
      // requirement_id: parseInt(accommodationBooking.requirement_id),
      requirement_id: parseInt(bookingDetails.id),
      checkin_time: `${accommodationBooking.checkInDateJson} ${accommodationBooking.checkinTime}:00`,
      checkout_time: `${accommodationBooking.checkOutDateJson} ${accommodationBooking.checkoutTime}:00`,
      place_of_stay: accommodationBooking.place_of_stay,
      booking_status: parseInt(accommodationBooking.booking_status),
      travel_detail: 1,
      ticket_amount: parseInt(accommodationBooking.ticket_amount),
      ticket_amount_personal: parseInt(
        accommodationBooking.ticket_amount_personal
      ),
      comments: accommodationBooking.comments,
      admin_paid: accommodationBooking.admin_paid,
      vendor_name: accommodationBooking.vendor_name,
      amount_saved: parseInt(accommodationBooking.amount_saved),
      nac_rate: parseInt(accommodationBooking.nac_rate),
      rack_rate_night: parseInt(accommodationBooking.rack_rate_night),
      room_type: accommodationBooking.room_type,
      total_a: parseInt(accommodationBooking.total_a),
      total_b: parseInt(accommodationBooking.total_b),
      no_of_nights: parseInt(accommodationBooking.no_of_nights),
      website: accommodationBooking.website,
      PNR: accommodationBooking.PNR,
      requirement_code: accommodationBooking.requirement_code,
      booking_date: `${accommodationBooking.booking_date_json} 00:00:00`,
      mode_of_payment: accommodationBooking.payment_mode,
    };

    console.log("accObj :>> " + JSON.stringify(accObj));

    const data = new FormData();
    data.append("data", JSON.stringify(accObj));

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
      const response = await fetch(URL.ACCOMMODATION_BOOKING_ADMIN, {
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
          attachmentArray = [];
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function CabBooking() {
    setProgressBar(true);
    const cabObj = {
      requirement_id: parseInt(bookingDetails.id),
      from_time: `${cabBooking.from_date_json} ${cabBooking.from_time}:00`,
      from_place: cabBooking.from_place,
      to_place: cabBooking.to_place,
      booking_status: parseInt(cabBooking.booking_status),
      ticket_amount: parseInt(cabBooking.ticket_amount),
      ticket_amount_personal: parseInt(cabBooking.ticket_amount_personal),
      comments: cabBooking.comments,
      admin_paid: cabBooking.admin_paid,
      vendor_name: cabBooking.vendor_name,
      travel_type_cab: cabBooking.travel_type_cab,
      cab_segment: cabBooking.cab_segment,
      cab_number: cabBooking.cab_number,
      PNR: cabBooking.PNR,
      invoice_date: `${cabBooking.invoice_date_json} 00:00:00`,
      issuance_type: cabBooking.issuance_type,
      website: cabBooking.website,
      requirement_code: cabBooking.requirement_code,
      booking_date: `${cabBooking.booking_date_json} 00:00:00`,
    };

    console.log("Cab booking : >> " + JSON.stringify());

    const data = new FormData();
    data.append("data", JSON.stringify(cabObj));

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
      const response = await fetch(URL.CAB_BOOKING_ADMIN, {
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
          attachmentArray = [];
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function BusBooking() {
    setProgressBar(true);
    const busObj = {
      requirement_id: parseInt(bookingDetails.id),
      from_time: `${busBooking.from_date_json} ${busBooking.from_time}:00`,
      from_place: busBooking.from_place,
      to_place: busBooking.to_place,
      booking_status: parseInt(busBooking.booking_status),
      ticket_amount: parseInt(busBooking.ticket_amount),
      ticket_amount_personal: parseInt(busBooking.ticket_amount_personal),
      comments: busBooking.comments,
      admin_paid: busBooking.admin_paid,
      vendor_name: busBooking.vendor_name,
      bus_number: busBooking.bus_number,
      issuance_type: busBooking.issuance_type,
      website: busBooking.website,
      PNR: busBooking.PNR,
      requirement_code: busBooking.requirement_code,
      booking_date: `${busBooking.booking_date_json} 00:00:00`,
      class_of_travel: busBooking.class_of_travel,
    };

    console.log("busObj :>> " + JSON.stringify(busObj));

    const data = new FormData();
    data.append("data", JSON.stringify(busObj));

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
      const response = await fetch(URL.BUS_BOOKING_ADMIN, {
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

      console.log("json :>> " + JSON.stringify(json));

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          attachmentArray = [];
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      setProgressBar(false);
      console.error("Bus Booking Error :>> " + error);
    }
  }

  async function TrainBooking() {
    setProgressBar(true);
    const trainObj = {
      requirement_id: parseInt(bookingDetails.id),
      from_time: `${trainBooking.from_date_json} ${trainBooking.from_time}:00`,
      from_place: trainBooking.from_place,
      to_place: trainBooking.to_place,
      booking_status: parseInt(trainBooking.booking_status),
      train_number: trainBooking.train_number,
      ticket_amount: parseInt(trainBooking.ticket_amount),
      ticket_amount_personal: parseInt(trainBooking.ticket_amount_personal),
      vendor_name: trainBooking.vendor_name,
      comments: trainBooking.comments,
      admin_paid: trainBooking.admin_paid,
      issuance_type: trainBooking.issuance_type,
      difference_inamount: trainBooking.difference_inamount,
      fare_quoted: trainBooking.fare_quoted,
      website: trainBooking.website,
      ticket_no: trainBooking.ticket_no,
      PNR: trainBooking.PNR,
      requirement_code: trainBooking.requirement_code,
      booking_date: `${trainBooking.booking_date_json} 00:00:00`,
      class_of_travel: trainBooking.class_of_travel,
      train_quota: trainBooking.train_quota,
    };

    console.log("trainObj :>> " + JSON.stringify(trainObj));

    const data = new FormData();
    data.append("data", JSON.stringify(trainObj));

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
      const response = await fetch(URL.TRAIN_BOOKING_ADMIN, {
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
          attachmentArray = [];
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function FlightBooking() {
    setProgressBar(true);
    const flightObj = {
      requirement_id: parseInt(bookingDetails.id),
      from_time: `${flightBooking.from_date_json} ${flightBooking.from_time}:00`,
      from_place: flightBooking.from_place,
      to_place: flightBooking.to_place,
      ref_no: flightBooking.ref_no,
      booking_status: parseInt(flightBooking.booking_status),
      ticket_amount: parseInt(flightBooking.ticket_amount),
      vendor_name: flightBooking.vendor_name,
      comments: flightBooking.comments,
      admin_paid: flightBooking.admin_paid,
      issuance_type: flightBooking.issuance_type,
      website: flightBooking.website,
      ticket_no: flightBooking.ticket_no,
      PNR: flightBooking.PNR,
      requirement_code: flightBooking.requirement_code,
      booking_date: `${flightBooking.booking_date_json} 00:00:00`,
    };

    const data = new FormData();
    data.append("data", JSON.stringify(flightObj));

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
      const response = await fetch(URL.AIR_BOOKING_ADMIN, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
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
          attachmentArray = [];
          navigation.navigate("Admin Screen");
        } else {
          Alert.alert(json.description);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  function Submit() {
    if (bookingDetails.bookingNeededId === 1) {
      AccommodationBookingValidation();
    } else if (bookingDetails.bookingNeededId === 2) {
      CabBookingValidation();
    } else if (bookingDetails.bookingNeededId === 3) {
      BusBookingValidation();
    } else if (bookingDetails.bookingNeededId === 4) {
      TrainBookingValidation();
    } else if (bookingDetails.bookingNeededId === 5) {
      FlightBookingValidation();
    }
  }

  return (
    <View style={styles.safeAreaView}>
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
        <View style={{ flex: 1 }}>
          {bookingDetails.bookingNeededId && (
            <View style={styles.screenContainer}>
              {accommodationBooking &&
                bookingDetails.bookingNeededId === 1 &&
                AccommodationBookingScreen()}
              {cabBooking &&
                bookingDetails.bookingNeededId === 2 &&
                CabBookingScreen()}
              {busBooking &&
                bookingDetails.bookingNeededId === 3 &&
                BusBookingScreen()}
              {trainBooking &&
                bookingDetails.bookingNeededId === 4 &&
                TrainBookingScreen()}
              {flightBooking &&
                bookingDetails.bookingNeededId === 5 &&
                FlightBookingScreen()}
              {(from == "book" || from == "update") && (
                <View>
                  <SubmitCancelButton
                    button1={from == "book" ? "Book" : "Update"}
                    button2="Back"
                    button1Press={Submit}
                    button2Press={() => {
                      navigation.goBack();
                    }}
                  />
                </View>
              )}
            </View>
          )}
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
  travelNo: {
    flexDirection: "row",
    marginBottom: 20,
  },
  travelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
