import {
  Text,
  ScrollView,
  StyleSheet,
  View,
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
    stopReading,
    close,
    currentActiveIndex,
  } = usePdfReader(pdfUri, setFileUri);

  const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
  const action: { actionType: "play" | "stop"; action: () => void } = !isPlaying
    ? { actionType: "play", action: startReading }
    : { actionType: "stop", action: stopReading };

  const renderActionButtons = () => {
    return (
      <View style={PdfRendererStyles.actionButtons}>
        <Pressable style={PdfRendererStyles.iconStyle} onPress={action.action}>
          <FontAwesome name={action.actionType} size={24} />
        </Pressable>
        <Pressable style={PdfRendererStyles.iconStyle} onPress={close}>
          <FontAwesome name="close" size={24} />
        </Pressable>
      </View>
    );
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
      {renderActionButtons()}
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
    paddingHorizontal: 10,
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
    height: 60,
    position: "absolute",
    bottom: 0,
    alignItems: "flex-end",
    flexDirection: "row",
    paddingBottom: 5,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "#FAF3E0",
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
