import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { useState } from "react";
import InputText from "../ui/InputText";
import SearchablePopUp from "../ui/SearchablePopUp";
import DropdownPickerPair from "../ui/DropdownPickerPair";
import SubmitButton from "../ui/SubmitButton";
import InputTextPair from "../ui/InputTextPair";

export default function AdminFilterDialog({
  filterDialogStatus,
  filterSubmit,

  travelNo,
  requirementCode,
  requirements,
  requestedDate,
  employeeCode,
  employeeName,
  employeeBranch,
  bookingStatus,
  travelStatus,

  setTravelNo,
  setRequirementCode,
  setRequirements,
  setRequestedDate,
  setEmployeeCode,
  setEmployeeName,
  setEmployeeBranch,
  setBookingStatus,
  setTravelStatus,
}) {
  const [isModalVisible, setModalVisible] = useState(filterDialogStatus);

  const bookingStatusList = [
    {
      id: 0,
      name: "Not Booked",
    },
    {
      id: -1,
      name: "Not Applicable",
    },
    {
      id: -2,
      name: "In Progress",
    },
    {
      id: -3,
      name: "Booked",
    },
    {
      id: -4,
      name: "Canceled",
    },
    {
      id: -6,
      name: "All",
    },
    {
      id: -5,
      name: "Not Booked & In Progress",
    },
    {
      id: -7,
      name: "Rejected",
    },
    {
      id: 8,
      name: "Cancel Requested",
    },
  ];

  const travelStatusList = [
    {
      name: "Travel Approved",
      id: "Travel_3",
    },
    {
      name: "Travel Cancel Pending",
      id: "TravelCancel_2",
    },
    {
      name: "Travel Cancel Approved",
      id: "TravelCancel_3",
    },
    {
      name: "Travel Cancel Rejectd",
      id: "TravelCancel_4",
    },
    {
      name: "Travel Returned",
      id: "Travel_5",
    },
  ];

  const requirementsList = [
    {
      id: 1,
      name: "Accommodation",
    },
    {
      id: 2,
      name: "Cab",
    },
    {
      id: 3,
      name: "Bus",
    },
    {
      id: 4,
      name: "Train",
    },
    {
      id: 5,
      name: "Flight",
    },
    {
      id: 101,
      name: "All",
    },
  ];

  const toggleModalVisibility = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <View style={styles.icon}>
              <MaterialIcons
                name={"close"}
                size={24}
                color="#FFBB4F"
                onPress={toggleModalVisibility}
              />
            </View>
            <ScrollView
              style={{ marginTop: 20, marginRight: 10, marginLeft: 10 }}
            >
              <InputTextPair
                leftLabel="Travel No:"
                leftHint="Enter No"
                rightLabel="Requirement Code:"
                rightHint="Enter Code"
                leftValue={travelNo}
                leftValueChange={setTravelNo}
                rightValue={requirementCode}
                rightValueChange={setRequirementCode}
              />

              <DropdownPickerPair
                leftIcon="date-range"
                rightIcon="arrow-drop-down"
                leftLabel="Requested Date:"
                leftHint="Requested Date"
                rightLabel="Requirements"
                rightHint="Requirements"
                rightPickerTitle="Select Requirements"
                rightPickerId="admin_requirements"
                rightPickerData={requirementsList}
                rightValue={requirements}
                setRightValue={setRequirements}
                leftValue={requestedDate}
                setLeftValue={setRequestedDate}
              />

              <InputTextPair
                leftLabel="Employee Code:"
                leftHint="Enter Code"
                rightLabel="Employee Name:"
                rightHint="Enter Name"
                leftValue={employeeCode}
                leftValueChange={setEmployeeCode}
                rightValue={employeeName}
                rightValueChange={setEmployeeName}
              />

              <InputText
                label="Employee Branch:"
                hint="Select Branch"
                value={employeeBranch}
                onChangeEvent={setEmployeeBranch}
              />

              <SearchablePopUp
                listData={bookingStatusList}
                label="Booking Status:"
                title="Select Booking Status"
                hint="Booking Status"
                pickerId="admin_booking_status"
                //  clear={ClearAll}
                selected={bookingStatus}
                setSelected={setBookingStatus}
              />

              <SearchablePopUp
                listData={travelStatusList}
                label="Travel Status:"
                title="Select Travel Status"
                hint="Travel Status"
                pickerId="admin_travel_status"
                //  clear={ClearAll}
                selected={travelStatus}
                setSelected={setTravelStatus}
              />
            </ScrollView>
            <View style={{ paddingBottom: 10 }}>
              <SubmitButton children="Filter" onPressEvent={filterSubmit} />
            </View>
            {/* <Pressable
              onPress={() => {
              //  toggleModalVisibility();
                filterSubmit();
              }}
            >
              <Text style={styles.textbutton}>Filter</Text>
            </Pressable> */}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    elevation: 5,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  icon: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  textInput: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 12,
  },
  textbutton: {
    height: 45,
    width: 200,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 15,
    backgroundColor: CustomColors.primary_yellow,
    textAlign: "center",
    color: "white",
  },
  container: {
    width: "80%",
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    justifyContent: "space-between",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: "row",
  },
});
