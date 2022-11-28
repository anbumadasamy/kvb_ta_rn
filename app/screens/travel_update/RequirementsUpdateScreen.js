import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import InputText from "../../components/ui/InputText";
import SubmitButton from "../../components/ui/SubmitButton";
import CommentBox from "../../components/ui/CommentBox";
import TimeSelector from "../../components/ui/TimeSelector";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import InputSelect from "../../components/ui/InputSelect";
import SearchDialog from "../../components/dialog/SearchDialog";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import PopUpPicker from "../../components/ui/PopUpPicker";
import moment from "moment";

export default function RequirementsUpdateScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const from = route.params.from;
  let bookingNeededArray = [];
  let cabTypeArray = [];
  let roomTypeTypeArray = [];
  let cabSegmentArray = [];
  const [checkInDatePicker, setCheckInDatePicker] = useState(false);
  const [checkOutDatePicker, setCheckOutDatePicker] = useState(false);
  const [checkInTimePicker, setCheckInTimePicker] = useState(false);
  const [checkOutTimePicker, setCheckOutTimePicker] = useState(false);

  const [startPlaceDialog, setStartPlaceDialog] = useState(false);
  const [endPlaceDialog, setEndPlaceDialog] = useState(false);

  const [maxDate, setMaxDate] = useState();
  const [minDate, setMinDate] = useState();

  const [bookingNeededList, setBookingNeededList] = useState([]);
  const [cabTypeList, setCabTypeList] = useState([]);
  const [roomTypeList, setRoomTypeList] = useState([]);
  const [cabSegmentList, setCabSegmentList] = useState([]);
  const [requirementsData, setRequirementsData] = useState({
    id: "",
    randomReqId:
      Math.floor(Math.random() * 100) +
      1 +
      "" +
      Math.floor(Math.random() * 100) +
      1,
    from: "Create",
    status: "0",
    bookingNeededId: "",
    bookingNeeded: "",
    travelTypeCabId: "",
    comments: "",
    fromPlace: "",
    toPlace: "",
    instructions: "",
    cabSegment: "",
    cabSegmentId: "",
    cabType: "",
    roomType: "",
    roomTypeId: "",
    placeOfStay: "",
    checkInDateJson: "",
    checkOutDateJson: "",
    checkInDate: "",
    checkOutDate: "",
    checkInTime: "",
    checkOutTime: "",
    fromDateJson: "",
    fromDate: "",
    fromTime: "",
  });

  useEffect(() => {
    setMaxDate(route.params.maxDate);
    setMinDate(route.params.minDate);
  }, [route]);

  useEffect(() => {
    getBookingNeeded();
    getCabType();
    getRoomType();
    getCabSegment();

    if (
      route.params.requirementsDetail != null &&
      "requirementsDetail" in route.params
    ) {
      inputChangedHandler("from", route.params.requirementsDetail.from);
      inputChangedHandler(
        "randomReqId",
        route.params.requirementsDetail.randomReqId
      );
      inputChangedHandler("id", route.params.requirementsDetail.id);
      inputChangedHandler(
        "bookingNeededId",
        route.params.requirementsDetail.bookingNeededId
      );
      inputChangedHandler(
        "bookingNeeded",
        route.params.requirementsDetail.bookingNeeded
      );
      inputChangedHandler("comments", route.params.requirementsDetail.comments);
      inputChangedHandler("status", route.params.requirementsDetail.status);

      if (route.params.requirementsDetail.bookingNeededId == 1) {
        inputChangedHandler(
          "roomType",
          route.params.requirementsDetail.roomType
        );
        inputChangedHandler(
          "roomTypeId",
          route.params.requirementsDetail.roomTypeId
        );
        inputChangedHandler(
          "placeOfStay",
          route.params.requirementsDetail.placeOfStay
        );
        inputChangedHandler(
          "checkInDate",
          route.params.requirementsDetail.checkInDate
        );
        inputChangedHandler(
          "checkOutDate",
          route.params.requirementsDetail.checkOutDate
        );
        inputChangedHandler(
          "checkInTime",
          route.params.requirementsDetail.checkInTime
        );
        inputChangedHandler(
          "checkOutTime",
          route.params.requirementsDetail.checkOutTime
        );
        inputChangedHandler(
          "checkInDateJson",
          route.params.requirementsDetail.checkInDateJson
        );
        inputChangedHandler(
          "checkOutDateJson",
          route.params.requirementsDetail.checkOutDateJson
        );
      } else if (route.params.requirementsDetail.bookingNeededId == 2) {
        inputChangedHandler(
          "travelTypeCabId",
          route.params.requirementsDetail.travelTypeCabId
        );

        inputChangedHandler(
          "instructions",
          route.params.requirementsDetail.instructions
        );
        inputChangedHandler(
          "cabSegment",
          route.params.requirementsDetail.cabSegment
        );
        inputChangedHandler(
          "cabSegmentId",
          route.params.requirementsDetail.cabSegmentId
        );
        inputChangedHandler("cabType", route.params.requirementsDetail.cabType);
        inputChangedHandler(
          "fromDateJson",
          route.params.requirementsDetail.fromDateJson
        );
        inputChangedHandler(
          "fromDate",
          route.params.requirementsDetail.fromDate
        );
        inputChangedHandler(
          "fromTime",
          route.params.requirementsDetail.fromTime
        );
        inputChangedHandler(
          "fromPlace",
          route.params.requirementsDetail.fromPlace
        );
        inputChangedHandler("toPlace", route.params.requirementsDetail.toPlace);
      } else {
        inputChangedHandler(
          "fromDateJson",
          route.params.requirementsDetail.fromDateJson
        );
        inputChangedHandler(
          "fromDate",
          route.params.requirementsDetail.fromDate
        );
        inputChangedHandler(
          "fromTime",
          route.params.requirementsDetail.fromTime
        );
        inputChangedHandler(
          "fromPlace",
          route.params.requirementsDetail.fromPlace
        );
        inputChangedHandler("toPlace", route.params.requirementsDetail.toPlace);
      }
    }
  }, [route]);

  function ClearAll() {
    inputChangedHandler("travelTypeCabId", "");
    inputChangedHandler("comments", "");
    inputChangedHandler("instructions", "");
    inputChangedHandler("cabSegment", "");
    inputChangedHandler("cabSegmentId", "");
    inputChangedHandler("cabType", "");
    inputChangedHandler("roomType", "");
    inputChangedHandler("placeOfStay", "");
    inputChangedHandler("checkInDate", "");
    inputChangedHandler("checkOutDate", "");
    inputChangedHandler("checkInTime", "");
    inputChangedHandler("checkOutTime", "");
    inputChangedHandler("fromDate", "");
    inputChangedHandler("fromTime", "");
    inputChangedHandler("fromPlace", "");
    inputChangedHandler("toPlace", "");
  }

  const handleConfirmStartDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const d = moment(selectedDate).format("YYYY-MM-DD");
    setCheckInDatePicker(false);
    inputChangedHandler("fromDate", currentDate);
    inputChangedHandler("fromDateJson", d);
  };
  const handleConfirmStartTime = (selectedTime) => {
    const currentTime = moment(selectedTime).format("HH:mm");
    setCheckInTimePicker(false);
    inputChangedHandler("fromTime", currentTime);
  };
  const handleConfirmCheckInDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const d = moment(selectedDate).format("YYYY-MM-DD");
    setCheckInDatePicker(false);
    inputChangedHandler("checkInDate", currentDate);
    inputChangedHandler("checkInDateJson", d);
  };
  const handleConfirmCheckOutDate = (selectedDate) => {
    const currentDate = moment(selectedDate).format("DD-MM-YYYY");
    const d = moment(selectedDate).format("YYYY-MM-DD");
    setCheckOutDatePicker(false);
    inputChangedHandler("checkOutDate", currentDate);
    inputChangedHandler("checkOutDateJson", d);
  };
  const handleConfirmCheckInTime = (selectedTime) => {
    const currentTime = moment(selectedTime).format("HH:mm");
    setCheckInTimePicker(false);
    inputChangedHandler("checkInTime", currentTime);
  };
  const handleConfirmCheckOutTime = (selectedTime) => {
    const currentTime = moment(selectedTime).format("HH:mm");
    setCheckOutTimePicker(false);
    inputChangedHandler("checkOutTime", currentTime);
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

  async function getBookingNeeded() {
    try {
      const response = await fetch(URL.COMMON_DROPDOWN + "booking_req", {
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
        if (authCtx.travelReason == 11) {
          if (json[i].value == 2) {
            bookingNeededArray.push(obj);
          }
        } else {
          bookingNeededArray.push(obj);
        }
      }
      setBookingNeededList(bookingNeededArray);
    } catch (error) {
      console.error(error);
    }
  }

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setRequirementsData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  const Cab = () => {
    return (
      <View>
        <PopUpPicker
          listData={cabSegmentList}
          label="Cab Segment:*"
          title="Select Cab Segment"
          hint="Cab Segment"
          pickerId="cab_segment"
          selectedName={requirementsData.cabSegment}
          setSelectedName={inputChangedHandler.bind(this, "cabSegment")}
          setSelectedId={inputChangedHandler.bind(this, "cabSegmentId")}
        />

        <PopUpPicker
          listData={cabTypeList}
          label="Cab Type:*"
          title="Select Cab Type"
          hint="Cab Type"
          pickerId="cab_type"
          selectedName={requirementsData.cabType}
          setSelectedName={inputChangedHandler.bind(this, "cabType")}
          setSelectedId={inputChangedHandler.bind(this, "travelTypeCabId")}
        />
        <InputText
          label="Start Place:*"
          hint="Enter Start Place"
          onChangeEvent={inputChangedHandler.bind(this, "fromPlace")}
          value={requirementsData.fromPlace}
        />
        <InputText
          label="End Place:*"
          hint="Enter End Place"
          onChangeEvent={inputChangedHandler.bind(this, "toPlace")}
          value={requirementsData.toPlace}
        />
        <TimeSelector
          startDateOnPress={() => {
            if (from == "create") {
              setCheckInDatePicker(!checkInDatePicker);
            }
          }}
          startDate={requirementsData.fromDate}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
          startTime={requirementsData.fromTime}
        />
        <CommentBox
          label="Instructions:"
          hint="Leave your instructions"
          inputComment={requirementsData.instructions}
          onInputCommentChanged={inputChangedHandler.bind(this, "instructions")}
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
      </View>
    );
  };

  const Accommodation = () => {
    return (
      <View>
        <PopUpPicker
          listData={roomTypeList}
          label="Room Type:*"
          title="Select Room Type"
          hint="Room Type"
          pickerId="room_type"
          selectedName={requirementsData.roomType}
          setSelectedName={inputChangedHandler.bind(this, "roomType")}
          setSelectedId={inputChangedHandler.bind(this, "roomTypeId")}
        />

        <InputText
          label="Place Of Stay:*"
          hint="Place Of Stay"
          onChangeEvent={inputChangedHandler.bind(this, "placeOfStay")}
          value={requirementsData.placeOfStay}
        />
        <DateTimeSelector
          inDateLabel="Check-In Date:*"
          inDateLabelhint="In Date"
          inTimeLabel="Check-In Time:*"
          inTimeLabelhint="In Time"
          outDateLabel="Check-Out Date:*"
          outDateLabelhint="Out Date"
          outTimeLabel="Check-Out Time:*"
          outTimeLabelhint="Out Time"
          inDateOnPress={() => {
            if (from == "create") {
              setCheckInDatePicker(!checkInDatePicker);
            }
          }}
          inDate={requirementsData.checkInDate}
          outDateOnPress={() => {
            if (from == "create") {
              setCheckOutDatePicker(!checkOutDatePicker);
            }
          }}
          outDate={requirementsData.checkOutDate}
          inTimeOnPress={() => setCheckInTimePicker(!checkInTimePicker)}
          inTime={requirementsData.checkInTime}
          outTimeOnPress={() => setCheckOutTimePicker(!checkOutTimePicker)}
          outTime={requirementsData.checkOutTime}
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
      </View>
    );
  };

  const Flight = () => {
    return (
      <View>
        <InputSelect
          label="Start Place:*"
          hint="Choose Start Place"
          selected={requirementsData.fromPlace}
          onPressEvent={() => setStartPlaceDialog(!startPlaceDialog)}
        />
        <InputSelect
          label="End Place:*"
          hint="Choose End Place"
          selected={requirementsData.toPlace}
          onPressEvent={() => setEndPlaceDialog(!endPlaceDialog)}
        />
        {startPlaceDialog && (
          <SearchDialog
            dialogstatus={startPlaceDialog}
            setdialogstatus={setStartPlaceDialog}
            from="startPlace"
            setValue={inputChangedHandler.bind(this, "fromPlace")}
          />
        )}

        {endPlaceDialog && (
          <SearchDialog
            dialogstatus={endPlaceDialog}
            setdialogstatus={setEndPlaceDialog}
            from="toPlace"
            setValue={inputChangedHandler.bind(this, "toPlace")}
          />
        )}
        <TimeSelector
          startDateOnPress={() => {
            if (from == "create") {
              setCheckInDatePicker(!checkInDatePicker);
            }
          }}
          startDate={requirementsData.fromDate}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
          startTime={requirementsData.fromTime}
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
      </View>
    );
  };

  const Others = () => {
    return (
      <View>
        <InputText
          label="Start Place:*"
          hint="Start Place"
          onChangeEvent={inputChangedHandler.bind(this, "fromPlace")}
          value={requirementsData.fromPlace}
        />
        <InputText
          label="End Place:*"
          hint="End Place"
          onChangeEvent={inputChangedHandler.bind(this, "toPlace")}
          value={requirementsData.toPlace}
        />
        <TimeSelector
          startDateOnPress={() => setCheckInDatePicker(!checkInDatePicker)}
          startDate={requirementsData.fromDate}
          startTimeOnpress={() => setCheckInTimePicker(!checkInTimePicker)}
          startTime={requirementsData.fromTime}
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
      </View>
    );
  };

  function AddRequirements() {
    if (requirementsData.bookingNeeded && requirementsData.bookingNeededId) {
      if (requirementsData.bookingNeededId == 1) {
        if (requirementsData.roomType) {
          if (requirementsData.placeOfStay) {
            if (requirementsData.checkInDate) {
              if (requirementsData.checkOutDate) {
                if (requirementsData.checkInTime) {
                  if (requirementsData.checkOutDate) {
                    navigation.navigate("Itinerary Update", {
                      from: from,
                      requirementsDetails: requirementsData,
                    });
                  } else {
                    Alert.alert("Select Checkout time");
                  }
                } else {
                  Alert.alert("Select Checkin time");
                }
              } else {
                Alert.alert("Select Checkout date");
              }
            } else {
              Alert.alert("Select Checkin date");
            }
          } else {
            Alert.alert("Enter place of stay");
          }
        } else {
          Alert.alert("Choose room type");
        }
      } else if (requirementsData.bookingNeededId == 2) {
        if (requirementsData.cabSegment) {
          if (requirementsData.cabType) {
            if (requirementsData.fromPlace) {
              if (requirementsData.toPlace) {
                if (requirementsData.fromDate) {
                  if (requirementsData.fromTime) {
                    navigation.navigate("Itinerary Update", {
                      from: from,
                      requirementsDetails: requirementsData,
                    });
                  } else {
                    Alert.alert("Choose start time");
                  }
                } else {
                  Alert.alert("Choose start date");
                }
              } else {
                Alert.alert("Enter end place");
              }
            } else {
              Alert.alert("Enter start place");
            }
          } else {
            Alert.alert("Choose cab type");
          }
        } else {
          Alert.alert("Choose cab segment");
        }
      } else {
        if (requirementsData.fromPlace) {
          if (requirementsData.toPlace) {
            if (requirementsData.fromDate) {
              if (requirementsData.fromTime) {
                navigation.navigate("Itinerary Update", {
                  from: from,
                  requirementsDetails: requirementsData,
                });
              } else {
                Alert.alert("Choose start time");
              }
            } else {
              Alert.alert("Choose start date");
            }
          } else {
            Alert.alert("Enter end place");
          }
        } else {
          Alert.alert("Enter start place");
        }
      }
    } else {
      Alert.alert("Choose booking needed");
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
          <PopUpPicker
            listData={bookingNeededList}
            label="Booking Needed:*"
            title="Select Booking Needed"
            hint="Booking Needed"
            pickerId="booking_needed"
            clear={ClearAll}
            selectedName={requirementsData.bookingNeeded}
            setSelectedName={inputChangedHandler.bind(this, "bookingNeeded")}
            setSelectedId={inputChangedHandler.bind(this, "bookingNeededId")}
          />
          {requirementsData.bookingNeededId == 2 && Cab()}
          {requirementsData.bookingNeededId == 1 && Accommodation()}
          {requirementsData.bookingNeededId == 5 && Flight()}
          {(requirementsData.bookingNeededId == 3 ||
            requirementsData.bookingNeededId == 4) &&
            Others()}
          <CommentBox
            label="Comments:"
            hint="Leave your comments"
            inputComment={requirementsData.comments}
            onInputCommentChanged={inputChangedHandler.bind(this, "comments")}
          />
        </ScrollView>
        <View>
          <SubmitButton onPressEvent={AddRequirements}>Submit</SubmitButton>
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
