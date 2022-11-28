import { MaterialIcons } from "@expo/vector-icons";
import { CustomColors } from "../../utilities/CustomColors";
import { AuthContext } from "../../data/Auth-Context";
import { useContext, useEffect } from "react";
import { URL } from "../../utilities/UrlBase";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  Button,
  TouchableWithoutFeedback, Alert
} from "react-native";
import { useState } from "react";

let subcategoryarray = [];

export default function DialogWithSearch({
  dialogstatus,
  setdialogstatus,
  Tittle,
  setcity,
}) {
  const [isModalVisible, setModalVisible] = useState(dialogstatus);
  const authCtx = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [count, setcount] = useState(1);
  const [search, setSearch] = useState("");
  const [hasnext, setHasnext] = useState(true);
  // console.log(count + " count count");

  useEffect(() => {
    if (hasnext) {
      subcategoryarray = [];
      getdata(search);
    }
  }, [count, search]);

  async function getdata(stext) {
    try {
      const response = await fetch(
        URL.CITY_LIST + "?city_name=" + stext + "&page=" + count,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authCtx.auth_token,
          },
        }
      );
      let json = await response.json();
      setHasnext(json.pagination.has_next);
      console.log(URL.CITY_LIST + "?city_name=" + stext + "&page=" + count);
      // console.log(json);
      for (let i = 0; i < json.data.length; i++) {
        const obj = {
          id: json.data[i].id,
          name: json.data[i].name,
        };
        // console.log(obj)
        subcategoryarray.push(obj);
      }
      // console.log(JSON.stringify(json.pagination) + " pagination");
      setData([...data, ...subcategoryarray]);

      if (json.pagination.has_next && count <= 3) {
        console.log("inside of count", json.pagination.has_next);
        setcount(count + 1);
        // console.log("inside of count",count);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
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
                    setData([]);
                    setSearch(text);
                    setHasnext(true);
                    setcount(1);
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
                    setSearch(""), setcity("");
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
                  setcount(count + 1);
                }}
                onEndReachedThreshold={1}
                renderItem={renderLocationsItem}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
  function renderLocationsItem({ ...itemData }) {
    const clickmethod = () => {
      setcity(itemData.item.name);
      setModalVisible(!isModalVisible);
      setdialogstatus(!dialogstatus);
    };
    return (
      <View style={styles.list}>
        <TouchableWithoutFeedback
          onPress={clickmethod}
          // onPressIn={clicked}
        >
          <View style={{ justifyContent: "center" }}>
            <Text>{itemData.item.name}</Text>
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
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderBottomWidth: 1,
  },
});
