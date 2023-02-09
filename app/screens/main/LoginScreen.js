import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Pressable,
} from "react-native";
import { CustomColors } from "../../utilities/CustomColors";
import SearchDialog from "../../components/dialog/SearchDialog";
import LoginButton from "../../components/ui/LoginButton";

export default function LoginScreen({ navigation }) {
  const authCtx = useContext(AuthContext);
  let token;

  const [passwordStatus, setPasswordStatus] = useState(true);

  const [getCredential, setCredential] = useState({
    username: "ta_tester1",
    password: "MTIzNA==",
    // entity_id: "1",
  });

  /* const [entity, setEntity] = useState("Foundation");
  const [entityDialog, setEntityDialog] = useState(false); */

  function inputChangedHandler(inputIdentifier, enteredValue) {
    setCredential((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  async function OnBehalfCheck() {
    try {
      const response = await fetch(
        URL.ON_BEHALF_OF_EMPLOYEE_GET /* + "&page=" + 1 */,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      let json = await response.json();
      authCtx.SetTravelOnBehalfOf(json.status);

      console.log(JSON.stringify(json)+" OnBehalfCheck")

    /*   if (json.data.length > 0) {
        console.log("Granted");
        authCtx.SetTravelOnBehalfOf(true);
      } else {
        authCtx.SetTravelOnBehalfOf(false);
        console.log("Not Granted");
      } */
    } catch (error) {
      console.error(error);
    }
  }

  async function PermissionCheck() {
    try {
      const response = await fetch(URL.CHECK_ADMIN, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      let json = await response.json();

      console.log(JSON.stringify(json)+" Modules Data")

      for (let i = 0; i < json.data.length; i++) {
        if (json.data[i].id == 82) {
          for (let j = 0; j < json.data[i].role.length; j++) {
            if (json.data[i].role[j].name == "Admin") {
              authCtx.SetAdmin(true);
              break;
            } else {
              authCtx.SetAdmin(false);
            }
          }
          for (let k = 0; k < json.data[i].submodule[0].role.length; k++) {
            if (json.data[i].submodule[0].role[k].name == "Maker") {
              authCtx.SetTravelMaker(true);
              break;
            } else {
              authCtx.SetTravelMaker(false);
            }
          }
          for (let k = 0; k < json.data[i].submodule[0].role.length; k++) {
            if (json.data[i].submodule[0].role[k].name == "Checker") {
              authCtx.SetTravelApprover(true);
              break;
            } else {
              authCtx.SetTravelApprover(false);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      navigation.navigate("TravelManagmentScreen");
    }
  }

  async function login() {
    console.log("Anbuuuuuuuuuu")
    if (getCredential.username.length == 0) {
      Alert.alert("Please check your username");
      return;
    }

    if (getCredential.password.length == 0) {
      Alert.alert("Please check your password");
      return;
    }

    await axios
      .post(URL.LOGIN_URL, {
        username: getCredential.username,
        password: getCredential.password,
        // entity_id: parseInt(getCredential.entity_id),
      })
      .then(function (response) {
        const credential = response.data;

        if (credential.token) {
          token = `Token ${credential.token}`;
          OnBehalfCheck();
          authCtx.authenticate(
            `Token ${credential.token}`,
            credential.name,
            JSON.stringify(credential.employee_id)
          );
          
          PermissionCheck();
        } else if (credential.code) {
          Alert.alert(credential.description);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  return (
    <ImageBackground
      style={styles.imageContainer}
      source={require("../../assets/images/login_bg.jpg")}
      resizeMode="stretch"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
      >
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Welcome</Text>

          <View style={styles.textInputContainer}>
            {/* <Pressable
              style={styles.PressableContainer}
              onPress={() => {
                setEntityDialog(!entityDialog);
              }}
            >
              {getCredential.entity_id != "" ? (
                <Text style={styles.text}>{entity}</Text>
              ) : (
                <Text style={styles.label}>Choose Entity</Text>
              )}
              <MaterialIcons
                style={{ alignSelf: "center" }}
                name="arrow-drop-down"
                size={24}
                color="#A2A2A2"
              />
            </Pressable> */}

          {/*   {entityDialog && (
              <SearchDialog
                dialogstatus={entityDialog}
                setdialogstatus={setEntityDialog}
                from="entity"
                setValue={(value) => {
                  setEntity(value);
                }}
                setId={inputChangedHandler.bind(this, "entity_id")}
              />
            )} */}

            <TextInput
              style={styles.textInput}
              placeholder="Username"
              onChangeText={inputChangedHandler.bind(this, "username")}
              value={getCredential.username}
            ></TextInput>
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              onChangeText={inputChangedHandler.bind(this, "password")}
              secureTextEntry={passwordStatus}
              value={getCredential.password}
            ></TextInput>
            
          </View>
          <View style={{justifyContent: "flex-end", flexDirection: "row", marginRight: 5}}>
          {passwordStatus && (
              <View>
                <Pressable
                  onPress={() => {
                    setPasswordStatus(!passwordStatus);
                  }}
                >
                  {/* <Ionicons
                    name="ios-eye"
                    size={20}
                    color={CustomColors.primary_black}
                  /> */}
                  <Text style={{color: CustomColors.primary_white, fontSize: 12}}>Show password</Text>
                </Pressable>
              </View>
            )}
            {!passwordStatus && (
              <View>
                <Pressable
                  onPress={() => {
                    setPasswordStatus(!passwordStatus);
                  }}
                >
                  {/* <Ionicons
                    name="ios-eye-off"
                    size={20}
                    color={CustomColors.primary_black}
                  /> */}
                  <Text style={{color: CustomColors.primary_white, fontSize: 12}}>Hide password</Text>
                </Pressable>
              </View>
            )}
            </View>
          <LoginButton
            onPressEvent={() => {
              console.log("Login")
              login();
            }}
          >
            Login
          </LoginButton>
          <View
            style={{
              marginTop: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>
              Build version: 1.0.0
            </Text>
            <Text style={{ color: "white", fontSize: 12 }}>
              Build released on: 04-11-2022
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loginContainer: {
    marginTop: "15%",
    paddingBottom: "20%",
    marginHorizontal: 25,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: CustomColors.primary_white,
    padding: 15,
  },
  textInputContainer: {
    marginTop: 30,
  },
  textInput: {
    backgroundColor: CustomColors.primary_white,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 50,
    alignContent: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
  textInputLabel: {
    backgroundColor: CustomColors.primary_white,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 50,
    alignContent: "center",
    textAlignVertical: "center",
    fontSize: 14,
    color: CustomColors.primary_gray,
  },
  PressableContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: CustomColors.primary_white,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    height: 50,
    alignContent: "center",
  },
  text: {
    textAlignVertical: "center",
    alignSelf: "center",
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
  label: {
    textAlignVertical: "center",
    alignSelf: "center",
    fontSize: 14,
    color: CustomColors.primary_gray,
  },
});
