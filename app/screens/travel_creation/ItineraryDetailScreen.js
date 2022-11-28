import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, ScrollView, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import LabelTextColumnView from "../../components/ui/LabelTextColumnView";
import DateSelector from "../../components/ui/DateSelector";
import HeaderBox from "../../components/ui/HeaderBox";
import RequirementsListCard from "../../components/cards/RequirementsListCard";

export default function ItineraryDetailScreen({ route }) {
  const navigation = useNavigation();
  const [from, setFrom] = useState();
  const [progressBar, setProgressBar] = useState(true);
  const [itineraryDetails, setItineraryDetails] = useState();

  useEffect(() => {
    navigation.setOptions({
      title: "Itinerary Detail",
    });
    setFrom(route.params.from);
    setItineraryDetails(route.params.itineraryDetail);
    setProgressBar(false);
  }, [route, setProgressBar]);

  return (
    <View style={styles.safeAreaView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        bounces={false}
      >
        {progressBar ? (
          <ProgressBar
            style={{ marginTop: 300 }}
            progress={0.5}
            color="#FFBB4F"
          />
        ) : (
          <View>
            <DateSelector
              endDateValue={itineraryDetails.endDate}
              startDateValue={itineraryDetails.startDate}
            />
            <LabelTextColumnView
              label="Type Of Travel:"
              hint="Choose type"
              value={itineraryDetails.typeOfTravel}
            />
            <LabelTextColumnView
              label="Start Place:"
              hint="Choose place"
              value={itineraryDetails.startPlace}
            />
            <LabelTextColumnView
              label="End Place:"
              hint="Choose place"
              value={itineraryDetails.endPlace}
            />
            <LabelTextColumnView
              label="Purpose Of Visit:"
              hint="Purpose"
              value={itineraryDetails.reason}
            />
            <LabelTextColumnView
              label="Client:"
              hint="Choose Client"
              value={itineraryDetails.client}
            />
            {itineraryDetails.requirement.length > 0 && (
              <HeaderBox label="Requirements" />
            )}
            {itineraryDetails.requirement.length > 0 && (
              <RequirementsListCard
                data={itineraryDetails.requirement}
                from={from}
                typeOfTravel={itineraryDetails.typeOfTravel}
                maxDate={itineraryDetails.endDateJson}
                minDate={itineraryDetails.startDateJson}
              />
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    marginTop: 20,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
  },
});
