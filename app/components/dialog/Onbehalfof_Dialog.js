import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import Onbehalfofradiobutton from "../ui/Onbehalfofradiobutton";
import SearchDialog from "../../components/dialog/SearchDialog";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
} from "react-native";
import {useState } from "react";
import DropDownWithoutLabel from "../ui/DropDownWithoutLabel";

export default function OnbehalfDialog({
  dialogstatus,
  clicked,
  setself,
  self,
  employyeid,
  setemployeeid,
  employee_name,
  setemployeename,
  close,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);

  const [employesearchdialogstatus, setemploysearchdialogstatus] =
    useState(false);

  const toggleModalVisibility = () => {
    setModalVisible(false);
  };

  const onPressRadioButton = (radioButtonsArray) => {
    setself(radioButtonsArray[0].selected);
  };

  /*  useEffect(() => {
    console.log("ANbuuuuuuuuu")
  
      if (self) {
       
        setemployeeid("");
        setemployeename("");
      }
    
  }, [self]); */

  return (
    <View style={styles.screen}>
      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        presentationStyle="overFullScreen"
        onDismiss={toggleModalVisibility}
      >
        <View style={styles.viewWrapper}>
          <View style={styles.modalView}>
            <View style={styles.icon}>
              <MaterialIcons
                name={"close"}
                size={24}
                color="#FFBB4F"
                onPress={toggleModalVisibility}
                onPressIn={close}
              />
            </View>
            <View style={styles.radiobutton}>
              <Onbehalfofradiobutton
                status={self}
                buttonpressed={onPressRadioButton}
              ></Onbehalfofradiobutton>
            </View>

            {!self && (
              <View style={styles.dropdown}>
                <DropDownWithoutLabel
                  hint="Employee"
                  indata={employee_name}
                  ontouch={() => {
                    setemploysearchdialogstatus(!employesearchdialogstatus);
                  }}
                ></DropDownWithoutLabel>
              </View>
            )}

            {employesearchdialogstatus && (
              <SearchDialog
                dialogstatus={employesearchdialogstatus}
                setValue={setemployeename}
                setId={setemployeeid}
                setdialogstatus={setemploysearchdialogstatus}
                from="CeoTeam"
              />
            )}

            <Pressable
             style={({pressed}) => pressed ? [styles.button, styles.pressed] : styles.button}
             android_ripple={{ color: CustomColors.ripple_color }}
              onPress={() => {
                if (!self) {
                  if (employee_name != "") {
                    toggleModalVisibility();
                    clicked();
                  }
                } else {
                  setemployeeid("");
                  setemployeename("");
                  toggleModalVisibility();
                  clicked();
                }
              }}
            >
              <Text style={styles.textbutton}>Confirm</Text>
            </Pressable>
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
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    elevation: 5,

    backgroundColor: "#fff",
    borderRadius: 7,
  },
  icon: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 20,
  },
  radiobutton: {
    marginLeft: 20,
  },
  dropdown: {
    marginLeft: 30,
    marginRight: 30,
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
  button: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: CustomColors.primary_yellow,
    marginBottom: 30,
  },
  textbutton: {
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
  pressed: {
    backgroundColor: CustomColors.ripple_color,
    opacity: 0.75,
  },
});
