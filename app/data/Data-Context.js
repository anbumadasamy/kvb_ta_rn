import { createContext, useState } from "react";

export const DataContext = createContext({
  travelEditable: false,
  travelTitle: "",
  travelStatus: "",
  itineraryTitle: "",
  setTravelEditable: () => {},
});

export default function DataContextProvider({ children }) {
  const [travelFormEditable, setTravelFormEditable] = useState(false);
  const [travelFormTitle, setTravelFormTitle] = useState();
  const [itineraryFormTitle, setItineraryFormTitle] = useState();
  const [travelFormStatus, setTravelFormStatus] = useState(null);

  function setTravelEditable(from, status) {
    setTravelFormStatus(status);
    if (
      (from == "travel_creation" || from == "travel_maker_summary") &&
      (status == 101 || status == 2 || status == 5)
    ) {
      setTravelFormEditable(true);
      if (from == "travel_creation" && status == 101) {
        setTravelFormTitle("eClaim Travel Creation");
        setItineraryFormTitle("Add Itinerary");
      } else if (
        from == "travel_maker_summary" &&
        (status == 2 || status == 5)
      ) {
        setTravelFormTitle("eClaim Travel Update");
        setItineraryFormTitle("Update Itinerary");
      }
    } else {
      setTravelFormEditable(false);
      setTravelFormTitle("Travel Detail");
      setItineraryFormTitle("Itinerary Detail");
    }
  }

  const value = {
    travelEditable: travelFormEditable,
    travelTitle: travelFormTitle,
    travelStatus: travelFormStatus,
    itineraryTitle: itineraryFormTitle,
    setTravelEditable: setTravelEditable,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
