import { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import MemberApprovalCCBS from "../../components/cards/MemberApprovalCCBS";
import { CustomColors } from "../../utilities/CustomColors";
import { URL } from "../../utilities/UrlBase";
import { AuthContext } from "../../data/Auth-Context";
import AlertCredentialError from "../../components/toast/AlertCredentialError";
import ToastMessage from "../../components/toast/ToastMessage";

export default function CCBS({ tourid }) {
  const [ccbs, setccbs] = useState([]);
  const [progressBar, setProgressBar] = useState(true);
  const authCtx = useContext(AuthContext);
  const TourId = tourid;

  async function getccbslist() {
    setProgressBar(true);
    let ccbsarray = [];

    try {
      const response = await fetch(URL.CCBS_GET + "type=2&tour=" + TourId, {
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
      } else {
        for (let i = 0; i < json.length; i++) {
          const obj = {
            id: json[i].id,
            amount: json[i].amount,
            percentage: json[i].percentage,
            BB: json[i].bs_data.name,
            CC: json[i].cc_data.name,
            tab: "CCBS",
          };
          ccbsarray.push(obj);
        }

        setccbs(ccbsarray);
      }
      setProgressBar(false);
    } catch (error) {
      setProgressBar(false);
    } finally {
    }
  }
  useEffect(() => {
    if (TourId) {
      getccbslist();
    }
  }, [TourId]);

  return (
    <View>
      {progressBar ? (
        <View
          style={{
            flex: 1,
            backgroundColor: CustomColors.screen_background_gray,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../../assets/icons/Progressbar2.gif")}
            />
          </View>
        </View>
      ) : (
        <View>
          <View style={styles.maincontainer}>
            {ccbs.length > 0 ? (
              <MemberApprovalCCBS data={ccbs} />
            ) : (
              <Text style={styles.noDataFoundText}>No data found</Text>
            )}
          </View>
        </View>
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
    marginHorizontal: 10,
    marginTop: 10,
  },
});
