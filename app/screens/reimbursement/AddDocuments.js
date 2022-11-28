import { useEffect, useState, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, Text, ScrollView, Alert, Image } from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import ExpenseDeleteDialog from "../../components/dialog/ExpenseDeleteDialog";
import * as WebBrowser from "expo-web-browser";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import AttachmentDialog from "../../components/dialog/AttachmentDialog";
import AttachmentVerticalbox from "../../components/ui/AtttachmentVerticalbox";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import SubmitButton from "../../components/ui/SubmitButton";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function AddDocuments({ route }) {
  const navigation = useNavigation();
  const expensetype = route.params.expensetype;
  const selectedexpenseid = route.params.expenseid;
  const TourId = route.params.TourId;
  const claimstatusid = route.params.claimstatusid;
  const authCtx = useContext(AuthContext);
  const [attachmentDialogStatus, setAttachmentDialogStatus] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [deletedfileid, setdeletefileid] = useState("");
  const [deletedialogstatus, setdeletedialogstatus] = useState(false);
  const [from, setfrom] = useState("");
  const [progressBar, setProgressBar] = useState(true);

  let attachmentArray;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => {
        return claimstatusid == 1 ||
          claimstatusid == -1 ||
          claimstatusid == 5 ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ marginRight: 20 }}>
              <Ionicons
                name="ios-folder"
                size={22}
                color="white"
                onPress={() => {
                  PickDocument();
                }}
              />
            </View>
            <View style={{ marginRight: 20 }}>
              <Ionicons
                name="ios-camera"
                size={22}
                color="white"
                onPress={() => {
                  OpenCamera();
                }}
              />
            </View>
          </View>
        ) : (
          <View></View>
        );
      },
    });
  });

  useEffect(() => {
    if (attachment.length == 0) {
      DocumentGet();
    }
  }, [attachment]);

  function DownloadAttachment(id) {
    let url =
      URL.DOCUMENT_DOWNLOAD +
      "doc_option=download" +
      "&id=" +
      parseInt(id) +
      "&token=" +
      authCtx.auth_token.split(" ")[1];

    WebBrowser.openBrowserAsync(url);
  }

  async function DocumentGet() {
    try {
      attachmentArray = [];
      setProgressBar(true);

      const response = await fetch(
        URL.DOCUMENT_GET +
          TourId +
          "&ref_type=2" +
          "&requirement_type=" +
          selectedexpenseid,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );

      let json = await response.json();
      setProgressBar(false)
      if ("detail" in json) {
        if(json.detail == "Invalid credentials/token."){
        AlertCredentialError(json.detail, navigation);
        }
      } else if ("data" in json) {
        for (let i = 0; i < json.data.length; i++) {
          const obj = {
            id: json.data[i].id,
            fileId: json.data[i].file_id,
            fileName: json.data[i].file_name,
            fileType: json.data[i].file_type,
            claimstatusid: claimstatusid,
            from: "API",
          };
          attachmentArray.push(obj);
        }
        setAttachment(attachmentArray);
        setProgressBar(false);
      } else {
        setProgressBar(false);
      }
    } catch (error) {
      setProgressBar(false);
    }
  }

  async function deletemethod() {
    setdeletedialogstatus(!deletedialogstatus);

    if (from == "API") {
      try {
        const response = await fetch(URL.DOCUMENT_DELETE + deletedfileid, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        });

        let json = await response.json();

        if (json) {      
          setProgressBar(false)
          if ("detail" in json) {
            if(json.detail == "Invalid credentials/token."){
            AlertCredentialError(json.detail, navigation);
            }
          }
          if (json.status) {
            ToastMessage(json.status);
            // Alert.alert(json.status);
            const position = attachment.filter(
              (item) => item.id != deletedfileid
            );
            setAttachment(position);
            // navigation.goBack();
          } else {
            Alert.alert(json.description);
          }
        }
      } catch (error) {}
    } else {
      const position = attachment.filter((item) => item.id != deletedfileid);
      setAttachment(position);
      ToastMessage("Successfully deleted");
      // Alert.alert("Successfully deleted");
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
        uri: result.uri,
        id:
          Math.floor(Math.random() * 100) +
          1 +
          "" +
          Math.floor(Math.random() * 100) +
          1,
        name: result.name,
        type: result.mimeType,
        claimstatusid: claimstatusid,
        from: "Device",
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
        uri: result.uri,
        id: `IMG_${Math.random()}.${mimeType[mimeType.length - 1]}`,
        name: `IMG_${Math.random()}.${mimeType[mimeType.length - 1]}`,
        type: `image/${mimeType[mimeType.length - 1]}`,
        claimstatusid: claimstatusid,
        from: "Device",
      };

      attachmentArray.push(file);
      setAttachment([...attachment, ...attachmentArray]);
    }
  };

  async function upload() {
    setProgressBar(true);
    let fileobj;
    let obj = {
      tour_id: TourId,
      ref_type: 2,
      requirement_type: selectedexpenseid,
    };

    const data = new FormData();
    data.append("data", JSON.stringify(obj));

    for (let i = 0; i < attachment.length; i++) {
      if (attachment[i].from == "Device") {
        fileobj = {
          uri: attachment[i].uri,
          name: attachment[i].name,
          type: attachment[i].type,
        };
      }

      data.append("file", fileobj);
    }

    try {
      if (fileobj != null) {
        const response = await fetch(URL.DOCUMENT_UPLOAD, {
          method: "POST",
          body: data,
          headers: {
            "Content-type": "multipart/form-data",
            Authorization: authCtx.auth_token,
          },
        });

        let json = await response.json();

        if (json) {
          setProgressBar(false);
          if ("detail" in json) {
            if(json.detail == "Invalid credentials/token."){
            AlertCredentialError(json.detail, navigation);
            }
          }
          if (json.message) {
            ToastMessage(json.message);
            // Alert.alert(json.message);

            navigation.goBack();
          } else {
            Alert.alert(json.description);
          }
        }
      } else {
        Alert.alert("Please Add Documents");
        setProgressBar(false);
      }
    } catch (error) {}
  }

  return (
    <View style={styles.safeAreaContainer}>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          overScrollMode="never"
          bounces={false}
        >
          <View style={styles.maincontainer}>
            {attachment.length > 0 ? (
              <AttachmentVerticalbox
                attachmentData={attachment}
                setdeletefileid={setdeletefileid}
                setdeletedialogstatus={setdeletedialogstatus}
                setfrom={setfrom}
                DownloadAttachment={(id) => {
                  DownloadAttachment(id);
                }}
                onPressAddIcon={() => {
                  setAttachmentDialogStatus(!attachmentDialogStatus);
                }}
              />
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
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
            {deletedialogstatus && (
              <ExpenseDeleteDialog
                dialogstatus={deletedialogstatus}
                Tittle=""
                setdialogstatus={setdeletedialogstatus}
                deletemethod={deletemethod}
              ></ExpenseDeleteDialog>
            )}
          </View>
        </ScrollView>
      )}
      {(claimstatusid == 1 || claimstatusid == -1 || claimstatusid == 5) &&
        !progressBar && (
          <SubmitButton onPressEvent={upload}>Upload</SubmitButton>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  noDataFoundText: {
    marginTop: 50,
    fontSize: 14,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  maincontainer: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
    marginTop: "4%",
  },
  safeAreaContainer: {
    flex: 1,
  },
});
