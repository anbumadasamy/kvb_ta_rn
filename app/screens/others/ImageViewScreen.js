import { SafeAreaView } from "react-native-safe-area-context";
import {useState, useEffect} from "react"
import { View, Image, StyleSheet } from "react-native";

export default function ImageViewScreen(route) {
    const [path, setPath] = useState();

    useEffect(() => {
        setPath(route.params.path);
    }, [route])
  return (
    <SafeAreaView style={styles.SafeAreaViewContainer}>
      <View style={styles.screenContainer}>
        {path && <Image uri={path} ></Image>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  SafeAreaViewContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    marginLeft: "4%",
    marginRight: "4%",
    marginBottom: "3%",
  },
  imageContainer:{

  }
});
