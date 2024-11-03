import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import usePdfReader from "@/custom-hooks/usePdfReader";

const PdfRenderer = ({
  pdfUri,
  setFileUri,
}: {
  pdfUri: String | null;
  setFileUri: Function;
}) => {
  const {
    scrollViewRef,
    pdfContent,
    textRefs,
    isPlaying,
    isLoading,
    startReading,
    pauseReading,
    resumeReading,
    stopReading,
    close,
    currentActiveIndex,
  } = usePdfReader(pdfUri, setFileUri);

  const { height: windowHeight, width: windowWidth } = Dimensions.get("window");

  const renderActionButtons = () => {
    // In expo-speech, Pause and Resume are not supported on Android
    if (Platform.OS === "ios") {
      return isPlaying ? (
        <Pressable style={PdfRendererStyles.iconStyle} onPress={pauseReading}>
          <FontAwesome name="pause" size={24} />
        </Pressable>
      ) : (
        <Pressable
          style={PdfRendererStyles.iconStyle}
          onPress={currentActiveIndex === 0 ? startReading : resumeReading}
        >
          <FontAwesome name="play" size={24} />
        </Pressable>
      );
    } else {
      return (
        <Pressable style={PdfRendererStyles.iconStyle} onPress={startReading}>
          <FontAwesome name="play" size={24} />
        </Pressable>
      );
    }
  };

  if (pdfUri)
    if (isLoading) {
      return (
        <View
          style={[
            PdfRendererStyles.container,
            PdfRendererStyles.loadingContainer,
          ]}
        >
          <Text style={PdfRendererStyles.loadingStyles}>Processing...</Text>
        </View>
      );
    }

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={[PdfRendererStyles.container, { height: windowHeight - 100 }]}
      >
        {pdfContent.map((content, index) => (
          <Text
            key={index}
            ref={(element) => (textRefs.current[index] = element)}
            style={[
              PdfRendererStyles.textStyles,
              currentActiveIndex === index ? PdfRendererStyles.highlight : {},
            ]}
          >
            {content + `${index === pdfContent.length - 1 ? "" : "."}`}
          </Text>
        ))}
      </ScrollView>
      <View style={PdfRendererStyles.actionButtons}>
        {renderActionButtons()}
        <Pressable style={PdfRendererStyles.iconStyle} onPress={stopReading}>
          <FontAwesome name="stop" size={24} />
        </Pressable>
        <Pressable style={PdfRendererStyles.iconStyle} onPress={close}>
          <FontAwesome name="close" size={24} />
        </Pressable>
      </View>
    </>
  );
};

const PdfRendererStyles = StyleSheet.create({
  container: {
    width: "100%",
    position: "absolute",
    backgroundColor: "#FAF3E0",
  },
  textStyles: {
    fontFamily: "OpenDyslexic",
    fontSize: 16,
  },
  loadingStyles: {
    textAlign: "center",
    fontFamily: "OpenDyslexic",
    fontSize: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    height: "100%",
  },
  highlight: {
    backgroundColor: "yellow",
  },
  actionButtons: {
    height: 100,
    position: "absolute",
    bottom: 0,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 5,
    width: "100%",
    justifyContent: "flex-end",
  },
  iconStyle: {
    padding: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 25,
  },
});

export default PdfRenderer;
