import Navigator from "./app/router/Navigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import {Platform} from "react-native"

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <>
        <StatusBar style={Platform.OS == "ios" ? "dark" : "light"} backgroundColor="#4FC6E0" />
        <RootSiblingParent>
          <Navigator />
        </RootSiblingParent>
      </>
    </SafeAreaView>
  );
}