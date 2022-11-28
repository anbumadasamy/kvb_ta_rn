import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../data/Auth-Context";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, ScrollView, Alert, Image } from "react-native";
import { URL } from "../../utilities/UrlBase";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";
import InputText from "../../components/ui/InputText";
import LabelTextView from "../../components/ui/LabelTextView";
import SubmitCancelButton from "../../components/ui/SubmitCancelButton";
import { CustomColors } from "../../utilities/CustomColors";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import PickerPair from "../../components/ui/PickerPair";
import TimeSelector from "../../components/ui/TimeSelector";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";
import DocumentBox from "../../components/ui/DocumentBox";

let attachmentArray = [];

export default function RequirementsCancelScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const reqId = route.params.reqId;
  const reqType = route.params.bookingNeeded;
  const travelNo = route.params.travelNo;

  const [docName, setDocName] = useState("");
  const [docId, setDocId] = useState("");
  const [progressBar, setProgressBar] = useState(true);
  const [document, setDocument] = useState(true);
  const [requirements, setRequirementsDetail] = useState();
  const [attachmentData, setAttachmentData] = useState([]);
  const [cancelRequirementData, setCancelRequirementData] = useState({
    requirement_id: null,
    booking_type: null,
    cancel_reschedule: null,
    cancel_reason: "",
    refund_amount: null,
    fare_difference: null,
    loss_of_cancelation: null,
    refund_date: "",
    cancelled_date: "",
  });

  useEffect(() => {
    changedHandler("requirement_id", reqId);
    changedHandler("booking_type", reqType);
  }, [requirements]);

  useEffect(() => {
    if (!requirements) {
      AdminGetRequirements();
      DocumentGet();
    }
  }, []);

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

      if ("description" in json) {
        if (json.description === "NO FILE PRESENT") {
          setDocument(false);
        }
      } else {
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
        setAttachmentData([...attachmentData, ...attachmentArray]);
        attachmentArray = [];
        setDocument(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function changedHandler(inputIdentifier, enteredValue) {
    setCancelRequirementData((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  async function AdminGetRequirements() {
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET +
          "requirement_id=" +
          reqId +
          "&type=" +
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

      console.log("Json Data :>> " + JSON.stringify(json.data[0]));

      setRequirementsDetail(json.data[0]);
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function Cancel() {
    setProgressBar(true);
    const data = new FormData();
    data.append("data", JSON.stringify(cancelRequirementData));

    try {
      const response = await fetch(URL.REQUIREMENT_ADMIN_CANCEL, {
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
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
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

  function CancelScreen() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        {cancelRequirementData && (
          <View>
            <View style={styles.travelHeader}>
              <View style={styles.travelNo}>
                <Text>Travel No: </Text>
                <Text>{travelNo}</Text>
              </View>

              <View style={styles.travelNo}>
                <Text>Req Code: </Text>
                <Text style={{ color: "#FE5886" }}>
                  {requirements.requirement_code}
                </Text>
              </View>
            </View>

            <View style={styles.titleContainer}>
              <Text style={styles.titleText1}>Booked Details</Text>
            </View>

            {reqType === 1 ? (
              <View>
                <DateTimeSelector
                  inDateLabel="Check-In Date: "
                  inDateLabelhint="In Date"
                  inTimeLabel="Check-In Time"
                  inTimeLabelhint="In Time"
                  outDateLabel="Check-Out Date"
                  outDateLabelhint="Out Date"
                  outTimeLabel="Check-Out Time"
                  outTimeLabelhint="Out Time"
                  inDate={moment(requirements.checkin_time_ms).format(
                    "DD-MM-YYYY"
                  )}
                  outDate={moment(requirements.checkout_time_ms).format(
                    "DD-MM-YYYY"
                  )}
                  inTime={moment(requirements.checkin_time_ms).format("HH:mm")}
                  outTime={moment(requirements.checkout_time_ms).format(
                    "HH:mm"
                  )}
                />
                <LabelTextView
                  label="Place of Stay"
                  value={requirements.place_of_stay}
                />
              </View>
            ) : (
              <View>
                <TimeSelector
                  startDate={moment(requirements.from_time_ms).format(
                    "DD-MM-YYYY"
                  )}
                  startTime={moment(requirements.from_time_ms).format("HH:mm")}
                />
                <LabelTextView
                  label="From Place"
                  value={requirements.from_place}
                />
                <LabelTextView label="To Place" value={requirements.to_place} />
              </View>
            )}

            <LabelTextView label="Remarks" value={requirements.comments} />

            <LabelTextView
              label="Official Booked Ammount"
              value={requirements.ticket_amount.toString()}
            />
            {document && (
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

            <View style={styles.titleContainer}>
              <Text style={styles.titleText2}>Cancel Details</Text>
            </View>

            <PickerPair
              leftIcon="date-range"
              rightIcon="date-range"
              leftLabel="Refund Date:"
              rightLabel="Cancelled Date:"
              leftHint="Refund Date"
              rightHint="Cancelled Date"
              leftValue={cancelRequirementData.refund_date}
              rightValue={cancelRequirementData.cancelled_date}
              setLeftValue={changedHandler.bind(this, "refund_date")}
              setRightValue={changedHandler.bind(this, "cancelled_date")}
            />

            <InputText
              label="Cancel Reason:"
              hint="Reason"
              value={cancelRequirementData.cancel_reason}
              onChangeEvent={changedHandler.bind(this, "cancel_reason")}
            />

            <InputText
              label="Refund Amount:"
              hint="Amount"
              keyboard="numeric"
              value={cancelRequirementData.refund_amount}
              onChangeEvent={(text) => {
                changedHandler("refund_amount", parseInt(text));
              }}
            />

            <InputText
              label="Penality Amount:"
              hint="Amount"
              keyboard="numeric"
              value={cancelRequirementData.loss_of_cancelation}
              onChangeEvent={(text) => {
                changedHandler("loss_of_cancelation", parseInt(text));
              }}
            />
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <View style={styles.safeAreaView}>
      <View style={styles.screenContainer}>
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
            {requirements && (
              <View style={{ flex: 1 }}>
                {CancelScreen()}
                <SubmitCancelButton
                  button1="Cancel"
                  button2="back"
                  button1Press={() => {
                    Cancel();
                  }}
                  button2Press={() => {
                    navigation.goBack();
                  }}
                />
              </View>
            )}
          </View>
        )}
      </View>
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
  titleContainer: {
    marginBottom: 20,
    alignSelf: "center",
  },
  titleText1: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: CustomColors.primary_green,
  },
  titleText2: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: CustomColors.primary_red,
  },
});
