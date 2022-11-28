import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../data/Auth-Context";
import { useNavigation } from "@react-navigation/native";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
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
import LabelTextView from "../../components/ui/LabelTextView";
import TimeSelector from "../../components/ui/TimeSelector";
import InputText from "../../components/ui/InputText";
import SingleDatePicker from "../../components/ui/SingleDatePicker";
import { URL } from "../../utilities/UrlBase";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import moment from "moment";
import * as MediaLibrary from "expo-media-library";

let attachmentArray = [];

export default function BookingDetailScreen({ route }) {
  const authCtx = useContext(AuthContext);
  const navigation = useNavigation();
  const typeOfTravel = route.params.typeOfTravel;
  const [progressBar, setProgressBar] = useState(false);
  const [docName, setDocName] = useState(null);
  const [docId, setDocId] = useState(null);
  const [attachment, setAttachment] = useState([]);
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
    amount_saved: 0,
    nac_rate: "",
    rack_rate_night: 0,
    room_type: "",
    total_a: 0,
    total_b: 0,
    no_of_nights: 0,
    website: "via.com",
    PNR: "",
    requirement_code: "",
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
    PNR: "",
    invoice_date: "",
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
  });

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

  useEffect(() => {
    // accommodation
    if (bookingDetails.bookingNeededId === 1) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      GetAccommodation();
    }

    // Cab
    if (bookingDetails.bookingNeededId === 2) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      GetCab();
    }

    // Bus
    if (bookingDetails.bookingNeededId === 3) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      GetBus();
    }

    // Train
    if (bookingDetails.bookingNeededId === 4) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      GetTrain();
    }

    // Flight
    if (bookingDetails.bookingNeededId === 5) {
      DocumentGet(bookingDetails.id, bookingDetails.bookingNeededId);
      GetFlight();
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

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;
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
          json.data[position].checkout_time.split(" ")[0]
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
          "requirement_code",
          json.data[position].requirement_code
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

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

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
          "requirement_code",
          json.data[position].requirement_code
        );

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
        changedHandlerCab("invoice_date", json.data[position].invoice_date_ms);
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
        changedHandlerBus("from_place", json.data[position].from_place);
        changedHandlerBus("to_place", json.data[position].to_place);
        changedHandlerBus(
          "requirement_code",
          json.data[position].requirement_code
        );

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

      for (let i = 0; i < json.data.length; i++) {
        const position = json.data.length - 1;

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
        changedHandlerTrain(
          "requirement_code",
          json.data[position].requirement_code
        );

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
          "requirement_code",
          json.data[position].requirement_code
        );
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
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
          inDateLabel="Check-In Date:"
          inDateLabelhint="In Date"
          inTimeLabel="Check-In Time:"
          inTimeLabelhint="In Time"
          outDateLabel="Check-Out Date:"
          outDateLabelhint="Out Date"
          outTimeLabel="Check-Out Time:"
          outTimeLabelhint="Out Time"
          inDate={accommodationBooking.checkinDate}
          outDate={accommodationBooking.checkoutDate}
          inTime={accommodationBooking.checkinTime}
          outTime={accommodationBooking.checkoutTime}
        />

        <DocumentBox
          documentData={attachment}
          from="detail"
          setDocId={(id) => {
            setDocId(id);
          }}
          setDocName={(name) => {
            setDocName(name);
          }}
        />

        <LabelTextView
          label="Place of stay"
          hint="Place of stay"
          value={accommodationBooking.place_of_stay}
        />

        <LabelTextView
          label="Remarks"
          hint="Leave your remarks"
          value={accommodationBooking.comments}
        />

        <LabelTextView
          label="Vendor Name"
          hint="Vendor Name"
          value={accommodationBooking.vendor_name}
        />

        <LabelTextView
          label="Paid by Admin"
          hint="Paid by Admin?"
          value={accommodationBooking.admin_paid == 1 ? "Yes" : "No"}
        />

        <LabelTextView
          label="PNR No"
          hint="PNR No"
          value={accommodationBooking.PNR}
        />

        <LabelTextView
          label="Booking site"
          hint="Booking site"
          value={accommodationBooking.website}
        />

        <LabelTextView
          label="Room Type"
          hint="Room Type"
          value={accommodationBooking.room_type}
        />

        <LabelTextView
          label="No of nights"
          hint="No of nights"
          keyboard="numeric"
          value={accommodationBooking.no_of_nights}
        />

        <LabelTextView
          label="NAC Rate"
          hint="Enter ammount"
          keyboard="numeric"
          value={accommodationBooking.nac_rate}
        />

        <LabelTextView
          label="Rack rate/night"
          hint="rate/night"
          keyboard="numeric"
          value={accommodationBooking.rack_rate_night}
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
          <LabelTextView
            label="Official Booked Ammount"
            hint="Booking Amount"
            value={accommodationBooking.ticket_amount}
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Personal Booked Ammount"
            hint="Booking Amount"
            value={accommodationBooking.ticket_amount_personal}
          />
        )}

        <LabelTextView
          label="Cost Saved (A-B)"
          hint="Cost Saved (A-B)"
          value={accommodationBooking.amount_saved}
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
        />

        <DocumentBox
          documentData={attachment}
          from="detail"
          setDocId={(id) => {
            setDocId(id);
          }}
          setDocName={(name) => {
            setDocName(name);
          }}
        />

        <LabelTextView
          label="From Place"
          hint="From Place"
          value={cabBooking.from_place}
        />
        <LabelTextView
          label="To Place"
          hint="To Place"
          value={cabBooking.to_place}
        />

        <LabelTextView
          label="Cab Segment"
          hint="Cab Segment"
          value={cabBooking.cab_segment}
        />
        <LabelTextView
          label="Cab Type"
          hint="Cab Type"
          value={cabBooking.cabType}
        />

        <LabelTextView
          label="Remarks"
          hint="Leave your remarks"
          value={cabBooking.comments}
        />

        <LabelTextView
          label="Cab No"
          hint="Cab No"
          value={cabBooking.cab_number}
        />

        <LabelTextView
          label="Vendor Name"
          hint="Vendor"
          value={cabBooking.vendor_name}
        />
        <LabelTextView
          label="Paid by Admin"
          hint="Paid by Admin?"
          value={cabBooking.admin_paid == 1 ? "Yes" : "No"}
        />

        <LabelTextView
          label="Invoice No"
          hint="Invoice No"
          value={cabBooking.PNR}
        />

        <SingleDatePicker
          label="Invoice Date"
          hint="Invoice Date"
          dateValue={moment(cabBooking.invoice_date).format("DD-MM-YYYY")}
        />

        <LabelTextView
          label="Booking site"
          hint="Booking site"
          value={cabBooking.website}
        />

        <LabelTextView
          label="Issuance Type"
          hint="Issuance"
          value={cabBooking.issuance_type}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Official Booked Ammount"
            hint="Booking Amount"
            value={cabBooking.ticket_amount}
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Personal Booked Ammount"
            hint="Booking Amount"
            value={cabBooking.ticket_amount_personal}
          />
        )}
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
        />

        <DocumentBox
          documentData={attachment}
          from="detail"
          setDocId={(id) => {
            setDocId(id);
          }}
          setDocName={(name) => {
            setDocName(name);
          }}
        />

        <LabelTextView
          label="From Place"
          hint="From Place"
          value={busBooking.from_place}
        />

        <LabelTextView
          label="To Place"
          hint="To Place"
          value={busBooking.to_place}
        />

        <LabelTextView
          label="Remarks"
          hint="Leave your remarks"
          value={busBooking.comments}
        />

        <LabelTextView label="PNR No" hint="PNR No" value={busBooking.PNR} />

        <InputText label="Bus No" hint="Bus No" value={busBooking.bus_number} />

        <InputText
          label="Vendor Name"
          hint="Vendor"
          value={busBooking.vendor_name}
        />

        <LabelTextView
          label="Paid by Admin"
          hint="Paid by Admin?"
          value={busBooking.admin_paid == 1 ? "Yes" : "No"}
        />

        <LabelTextView
          label="Booking site"
          hint="Booking site"
          value={busBooking.website}
        />

        <LabelTextView
          label="Issuance Type"
          hint="Issuance"
          value={busBooking.issuance_type}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Official Booked Ammount"
            hint="Booking Amount"
            value={busBooking.ticket_amount}
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Personal Booked Ammount"
            hint="Booking Amount"
            value={busBooking.ticket_amount_personal}
          />
        )}
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
        />

        <DocumentBox
          documentData={attachment}
          from="detail"
          setDocId={(id) => {
            setDocId(id);
          }}
          setDocName={(name) => {
            setDocName(name);
          }}
        />

        <LabelTextView
          label="From Place"
          hint="From Place"
          value={trainBooking.from_place}
        />

        <InputTeLabelTextViewxt
          label="To Place"
          hint="To Place"
          value={trainBooking.to_place}
        />

        <LabelTextView
          label="Remarks"
          hint="Leave your remarks"
          value={trainBooking.comments}
        />

        <LabelTextView
          label="Train No"
          hint="Train"
          value={trainBooking.train_number}
        />

        <LabelTextView label="PNR No" hint="PNR No" value={trainBooking.PNR} />

        <LabelTextView
          label="Vendor Name"
          hint="Vendor"
          value={trainBooking.vendor_name}
        />

        <LabelTextView
          label="Paid by Admin"
          hint="Paid by Admin?"
          value={trainBooking.admin_paid == 1 ? "Yes" : "No"}
        />

        <InputText
          label="Booking site"
          hint="Booking site"
          value={trainBooking.website}
        />

        <InputText
          label="Issuance Type"
          hint="Issuance"
          value={trainBooking.issuance_type}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Official Booked Ammount"
            hint="Booking Amount"
            value={trainBooking.ticket_amount}
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Personal Booked Ammount"
            hint="Booking Amount"
            value={trainBooking.ticket_amount_personal}
          />
        )}
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
        />

        <DocumentBox
          documentData={attachment}
          from="detail"
          setDocId={(id) => {
            setDocId(id);
          }}
          setDocName={(name) => {
            setDocName(name);
          }}
        />

        <LabelTextView
          label="Start Place"
          hint="Choose Start Place"
          selected={flightBooking.from_place}
        />
        <LabelTextView
          label="End Place"
          hint="Choose End Place"
          selected={flightBooking.to_place}
        />

        <LabelTextView
          label="Remarks"
          hint="Leave your remarks"
          value={flightBooking.comments}
        />

        <LabelTextView label="PNR No" hint="PNR No" value={flightBooking.PNR} />

        <LabelTextView
          label="Vendor Name"
          hint="Vendor"
          value={flightBooking.vendor_name}
        />

        <LabelTextView
          label="Paid by Admin"
          hint="Paid by Admin?"
          value={flightBooking.admin_paid == 1 ? "Yes" : "No"}
        />

        <LabelTextView
          label="Booking site"
          hint="Booking site"
          value={flightBooking.website}
        />

        <LabelTextView
          label="Issuance Type"
          hint="Issuance"
          value={flightBooking.issuance_type}
        />

        <LabelTextView
          label="Ticket No"
          hint="Ticket No"
          value={flightBooking.ticket_no}
        />

        <LabelTextView
          label="Reference No"
          hint="Reference No"
          value={flightBooking.ref_no}
        />

        {(typeOfTravel == "Official" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Official Booked Ammount"
            hint="Booking Amount"
            value={flightBooking.ticket_amount}
          />
        )}

        {(typeOfTravel == "Personal" ||
          typeOfTravel == "Official/Personal") && (
          <LabelTextView
            label="Personal Booked Ammount"
            hint="Booking Amount"
            value={flightBooking.ticket_amount_personal}
          />
        )}
      </ScrollView>
    );
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
