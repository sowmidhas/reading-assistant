import { Text, View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import FileUpload from "@/components/FileUpload";

export default function Index() {
  const [fontsLoaded] = useFonts({
    OpenDyslexic: require("../assets/fonts/OpenDyslexic3-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.introMsg}>
        Hello and Welcome to your reading assistant
      </Text>
      <FileUpload />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FAF3E0",
  },
  introMsg: {
    marginBottom: 40,
    fontFamily: "OpenDyslexic",
    textAlign: "center",
    fontSize: 18,
  },
});
