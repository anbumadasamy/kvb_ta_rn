import { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { AuthContext } from "../../data/Auth-Context";
import { URL } from "../../utilities/UrlBase";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import TimeSelector from "../../components/ui/TimeSelector";
import DateTimeSelector from "../../components/ui/DateTimeSelector";
import LabelTextView from "../../components/ui/LabelTextView";
import SubmitButton from "../../components/ui/SubmitButton";
import DocumentBox from "../../components/ui/DocumentBox";
import ToastMessage from "../../components/toast/ToastMessage";
import { CustomColors } from "../../utilities/CustomColors";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import CommentBoxView from "../../components/ui/CommentBoxView";

let attachmentArray = [];

export default function BookingRequirementsScreen({ route }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [requirementsData, setRequirementsData] = useState(null);
  const [attachmentData, setAttachmentData] = useState([]);
  const [docName, setDocName] = useState("");
  const [docId, setDocId] = useState("");
  const requirementId = route.params.reqId;
  const requirementTypeId = route.params.reqTypeId;
  const [progressBar, setProgressBar] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: "My Booking",
    });
  });

  useEffect(() => {
    if (requirementsData == null) {
      DocumentGet(route.params.reqId, route.params.reqTypeId);
      GetReq(route.params.reqId, route.params.reqTypeId);
    }
  }, [route]);

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
        //  Linking.openURL(uri);
      }
    }
  }

  async function GetReq(id, type) {
    try {
      const response = await fetch(
        URL.RRQUIREMENTS_ADMIN_GET + "requirement_id=" + id + "&type=" + type,
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
        setRequirementsData(json.data[position]);
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
      console.error(error);
    }
  }

  async function DocumentGet(id, type) {
    let url =
      URL.REQUIREMENT_DOCUMENT_GET +
      id +
      "&ref_type=1" +
      "&requirement_type=" +
      type;

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

  async function RequirementCancel(type, id) {
    setProgressBar(true);
    try {
      const response = await fetch(
        URL.REQUIREMENT_USER_CANCEL + type + "&requirement_id=" + id,
        {
          method: "POST",
          body: JSON.stringify({}),
          headers: {
            "Content-type": "application/json",
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

      if (json) {
        setProgressBar(false);
        if (json.message) {
          ToastMessage(json.message);
          navigation.goBack();
          navigation.goBack();
          navigation.goBack();
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

  const Cab = () => {
    return (
      <View>
        <LabelTextView
          label="Cab Segment"
          value={requirementsData.cab_segment}
        ></LabelTextView>

        <LabelTextView
          label="Cab Type"
          value={requirementsData.travel_type_cab_value}
        ></LabelTextView>

        <LabelTextView
          label="Start Place"
          value={requirementsData.from_place}
        ></LabelTextView>

        <LabelTextView
          label="End Place"
          value={requirementsData.to_place}
        ></LabelTextView>

        <TimeSelector
          startDate={DateFormate(requirementsData.from_time.split(" ")[0])}
          startTime={requirementsData.from_time
            .split(" ")[1]
            .substring(0, requirementsData.from_time.split(" ")[1].length - 3)}
        />
      </View>
    );
  };

  const Accommodation = () => {
    return (
      <View>
        <LabelTextView
          label="Room Type"
          value={requirementsData.room_type}
        ></LabelTextView>
        <LabelTextView
          label="Place Of Stay"
          value={requirementsData.place_of_stay}
        ></LabelTextView>

        <DateTimeSelector
          inDateLabel="Check-In Date:"
          inDateLabelhint="In Date"
          inTimeLabel="Check-In Time"
          inTimeLabelhint="In Time"
          outDateLabel="Check-Out Date"
          outDateLabelhint="Out Date"
          outTimeLabel="Check-Out Time"
          outTimeLabelhint="Out Time"
          inDate={DateFormate(requirementsData.checkin_time.split(" ")[0])}
          outDate={DateFormate(requirementsData.checkout_time.split(" ")[0])}
          inTime={requirementsData.checkin_time
            .split(" ")[1]
            .substring(
              0,
              requirementsData.checkin_time.split(" ")[1].length - 3
            )}
          outTime={requirementsData.checkout_time
            .split(" ")[1]
            .substring(
              0,
              requirementsData.checkout_time.split(" ")[1].length - 3
            )}
        />
      </View>
    );
  };

  const Others = () => {
    return (
      <View>
        <LabelTextView
          label="Start Place"
          value={requirementsData.from_place}
        ></LabelTextView>

        <LabelTextView
          label="End Place"
          value={requirementsData.to_place}
        ></LabelTextView>

        <TimeSelector
          startDate={DateFormate(requirementsData.from_time.split(" ")[0])}
          startTime={requirementsData.from_time
            .split(" ")[1]
            .substring(0, requirementsData.from_time.split(" ")[1].length - 3)}
        />
      </View>
    );
  };

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
            {requirementsData && (
              <View style={{ flex: 1 }}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  overScrollMode="never"
                  bounces={false}
                >
                  <LabelTextView
                    label="Req code"
                    value={requirementsData.requirement_code}
                  ></LabelTextView>
                  <LabelTextView
                    label="Booking Needed"
                    value={route.params.reqType}
                  ></LabelTextView>
                  {route.params.reqTypeId == 2 && Cab()}
                  {route.params.reqTypeId == 1 && Accommodation()}
                  {(route.params.reqTypeId == 3 ||
                    route.params.reqTypeId == 4 ||
                    route.params.reqTypeId == 5) &&
                    Others()}
                  {requirementsData.comments && (
                    <CommentBoxView
                      label="Comments:"
                      hint="No comments"
                      inputComment={requirementsData.comments}
                    />
                  )}
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
                </ScrollView>
                <View>
                  {route.params.status == 3 && (
                    <SubmitButton
                      onPressEvent={() => {
                        RequirementCancel(requirementTypeId, requirementId);
                      }}
                    >
                      Cancel
                    </SubmitButton>
                  )}
                </View>
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
});
