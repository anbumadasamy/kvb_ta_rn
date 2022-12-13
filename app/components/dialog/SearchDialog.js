import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import { AuthContext } from "../../data/Auth-Context";
import { useContext, useEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { useState } from "react";

let dataArray = [];

export default function SearchDialog({
  dialogstatus,
  setdialogstatus,
  from,
  setValue,
  setId,
  setfirst,
  apicall,
  grade,
  empId,
  onBehalOfId,
  branchId,
  setigst,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [count, setcount] = useState(1);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(true);
  const [activate, setactivate] = useState(false);

  useEffect(() => {
    console.log("anbu");
    if (pagination) {
      Getdata(search);
    }
  }, [count, activate]);

  useEffect(() => {
    setData([]);
    setPagination(true);
    let timer = setTimeout(() => {
      if (count == 1) {
        setactivate(!activate);
      } else {
        setcount(1);
      }
    }, 1000);
  }, [search]);

  async function Getdata(search) {
    dataArray = [];
    let url = "";

    console.log("From :>> " + from);

    switch (from) {
      case "startPlace":
        url =
          URL.FREQUENT_CITY +
          "from_place=1" +
          "&city_name=" +
          search +
          "&page=" +
          count;
        break;
      case "toPlace":
        url =
          URL.FREQUENT_CITY +
          "from_place=0" +
          "&city_name=" +
          search +
          "&page=" +
          count;
        break;
      case "client":
        url = URL.FREQUENT_CLIENT + "page=" + count + "&query=" + search;
        break;
      case "BS":
        url = URL.BS_GET + "?query=" + search + "&page=" + count;
        break;
      case "DAILYDIEM":
        url = URL.CITY_LIST + "?city_name=" + search + "&page=" + count;
        break;
      case "LODGING":
        url = URL.CITY_LIST + "?city_name=" + search + "&page=" + count;
        break;
      case "CeoTeam":
        url = URL.CEO_TEAM_MEMBERS + "?query=" + search + "&page=" + count;
        break;
      case "OnBehalfOfEmp":
        url = URL.ON_BEHALF_OF_EMPLOYEE_GET + search + "&page=" + count;
        break;
      case "OnBehalfOfEmpclaim":
        url = URL.ON_BEHALF_OF_EMPLOYEE_GET + search + "&page=" + count;
        break;
      case "entity":
        url = URL.ENTITY_LIST;
        break;
      case "DailyDiemCitySearch":
        url =
          URL.DAILY_DIEM_CITY +
          search +
          "&employeegrade=" +
          grade +
          "&expensename=Daily Diem&page=" +
          count;
        break;
      case "Lodging_City_search":
        url =
          URL.DAILY_DIEM_CITY +
          search +
          "&employeegrade=" +
          grade +
          "&expensename=Lodging&page=" +
          count;
        break;
      case "HSN_Code":
        url = URL.HSN + search + "&page=" + count;
        break;
      case "Bank_GST":
        url = URL.GST + search + "&page=" + count;
        break;
        case "permitted_by":
        url =
          URL.PERMITTED_BY_EMP_LIST +
          empId +
          "&name=" +
          search +
          "&page=" +
          count +
          "&onbehalfof=" +
          onBehalOfId;
        break;
      case "approver_branch":
        url = URL.APPROVER_BRANCH_LIST + "?query=" + search + "&page=" + count;
        break;
      case "approver_name":
        url =
          URL.APPROVER_EMP_LIST +
          branchId +
          "?name=" +
          search +
          "&page=" +
          count;
        break;
    }

    console.log(url);

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: from != "entity" ? authCtx.auth_token : "",
        },
      });
      console.log("json Response Status---> " + response.status);

      let json = await response.json();



      console.log("json ---> " + JSON.stringify(json));
      

      let obj = "";

      switch (from) {
        case "startPlace":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
            };
            dataArray.push(obj);
          }
          break;
        case "toPlace":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
            };
            dataArray.push(obj);
          }
          break;
        case "client":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].client_name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }

          break;
        case "BS":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
              id: json.data[i].id,
              code: json.data[i].code,
              no: json.data[i].no,
            };
            dataArray.push(obj);
          }
          break;
        case "DAILYDIEM":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "LODGING":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "CeoTeam":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].full_name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "OnBehalfOfEmp":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].full_name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "OnBehalfOfEmpclaim":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].full_name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }

          break;
        case "entity":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "DailyDiemCitySearch":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].city,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "Lodging_City_search":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].city,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;
        case "HSN_Code":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].code+"",
              id: json.data[i].id,
              igstrate:json.data[i].igstrate,
            };
            dataArray.push(obj);
          }
          break;
          case "Bank_GST":
            for (let i = 0; i < json.data.length; i++) {
              obj = {
                name: json.data[i].bankgstno+"",
                id: json.data[i].bank_name,
              };
              dataArray.push(obj);
            }
            break;
            case "permitted_by":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].full_name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;

        case "approver_branch":
          for (let i = 0; i < json.data.length; i++) {
            obj = {
              name: json.data[i].name,
              id: json.data[i].id,
            };
            dataArray.push(obj);
          }
          break;

        case "approver_name":
          setPagination(false);
          for (let i = 0; i < json.length; i++) {
            obj = {
              name: json[i].full_name,
              id: json[i].id,
            };
            dataArray.push(obj);
           
          }
          break;
      }

      setData([...data, ...dataArray]);

      if (from != "entity") {
        if ("pagination" in json) {
          setPagination(json.pagination.has_next);
          if (json.pagination.has_next && count <= 3) {
            setcount(count + 1);
          }
        } else {
          setPagination(false);
        }
      } else {
        setPagination(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    setdialogstatus(false);
  };

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
            <View
              style={{
                flexDirection: "row",
                backgroundColor: CustomColors.primary_green,
                justifyContent: "space-between",
              }}
            >
              <View style={styles.icon}>
                <MaterialIcons
                  name={"arrow-back"}
                  size={24}
                  color="white"
                  onPress={toggleModalVisibility}
                  style={{ marginRight: 20 }}
                />
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => {
                    console.log(text);

                    setSearch(text);
                  }}
                  placeholder="Search..."
                  value={search}
                  placeholderTextColor="white"
                  keyboardType="default"
                ></TextInput>
              </View>
              <View
                style={{
                  padding: 20,
                }}
              >
                <MaterialIcons
                  name={"close"}
                  size={24}
                  color="white"
                  onPress={() => {
                    setSearch("");
                    setValue("");

                    if (
                      from == "client" ||
                      from == "OnBehalfOfEmp" ||
                      from == "OnBehalfOfEmpclaim" ||
                      from == "entity" ||
                      from == "permitted_by" ||
                      from == "approver_branch" ||
                      from == "approver_name"
                    ) {
                      setId("");
                    }
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1, marginTop: 20 }}>
              <FlatList
                data={data}
                overScrollMode="never"
                bounces={false}
                onEndReached={() => {
                  if (from != "entity") {
                    setcount(count + 1);
                  }
                }}
                onEndReachedThreshold={1}
                renderItem={renderLocationsItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => {
                  return item.index;
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
  function renderLocationsItem({ ...itemData }) {
    const clickmethod = () => {
      setValue(itemData.item.name);
      if (
        from == "client" ||
        from == "BS" ||
        from == "CeoTeam" ||
        from == "OnBehalfOfEmp" ||
        from == "entity" ||
        from == "permitted_by" ||
        from == "approver_branch" ||
        from == "approver_name"
      ) {
        setId(itemData.item.id);
      }
      if (from == "LODGING") {
        setfirst(false);
      }
      if(from == "HSN_Code"){
        setigst(itemData.item.igstrate+"")
      }
      if (from == "OnBehalfOfEmpclaim") {
        setId(itemData.item.id);
        apicall();
      }

      setModalVisible(!isModalVisible);
      setdialogstatus(!dialogstatus);
    };
    return (
      <View style={styles.list}>
        <TouchableWithoutFeedback onPress={clickmethod}>
          <View style={{ justifyContent: "center", marginBottom: 20 }}>
            <Text style={styles.text}>{itemData.item.name}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    position: "absolute",
    top: "0%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    backgroundColor: "#fff",
  },
  icon: {
    justifyContent: "flex-start",
    padding: 10,
    width: "70%",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: CustomColors.primary_green,
  },
  textInput: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 20,
    color: "white",
  },
  list: {
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: 20,
    borderColor: CustomColors.primary_gray,
    borderBottomWidth: 0.4,
  },
  text: {
    fontSize: 14,
    color: CustomColors.primary_dark,
  },
});
