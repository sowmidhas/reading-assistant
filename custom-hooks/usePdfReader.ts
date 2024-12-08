import { useEffect, useRef, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import { Dimensions } from "react-native";

const usePdfReader = (pdfUri, setFileUri) => {
  const [pdfContent, setPdfContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const textRefs = useRef([]);

  useEffect(() => {
    //convert pdf to base64
    //Extract text from pdf using OCR api
    if (pdfUri !== null) {
      convertPdftoBase64();
    }
  }, [pdfUri]);

  const convertPdftoBase64 = async () => {
    try {
      const base64String = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      extractTextFromPdf(base64String);
    } catch (error) {
      console.log("The error is ", error);
    }
  };

  const extractTextFromPdf = async (pdfBase64: string) => {
    const apiKey = "K89625276088957";
    const apiUrl = "https://api.ocr.space/parse/image";
    const base64String = "data:application/pdf;base64," + pdfBase64;

    const formData = new FormData();
    formData.append("apikey", apiKey);
    formData.append("base64Image", base64String);
    formData.append("language", "eng");

    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        let ParsedContent = result.ParsedResults.map(
          (result) => result.ParsedText
        ).join(" ");
        const splittedContent = ParsedContent.split(/[.]/);
        console.log("The result is ", splittedContent);

        setPdfContent(splittedContent);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("The error is ", err);
        setIsLoading(false);
      });
  };

  const readSentence = (index: number) => {
    if (index < pdfContent.length) {
      Speech.speak(pdfContent[index], {
        language: "en-US",
        voice: "en-US-default",
        rate: 0.8,
        onDone: () => {
          handleNextSentence(index + 1);
        },
      });
    } else {
      stopReading();
      setCurrentActiveIndex(0);
      scrollToActiveIndex(0);
    }
  };

  const startReading = () => {
    setIsPlaying(true);
    readSentence(currentActiveIndex);
  };

  const handleNextSentence = (nextIndex: number) => {
    setCurrentActiveIndex(nextIndex);
    scrollToActiveIndex(nextIndex);
    readSentence(nextIndex);
  };

  const stopReading = () => {
    setIsPlaying(false);
    Speech.stop();
  };

  const close = () => {
    setFileUri(null);
    setIsPlaying(false);
    Speech.stop();
  };

  const scrollToActiveIndex = (index) => {
    if (textRefs.current[index]) {
      // Measure the layout relative to the ScrollView
      textRefs.current[index].measureLayout(
        scrollViewRef.current,
        (left, top, width, height) => {
          // Calculate the scroll position
          const scrollToPosition =
            top - Dimensions.get("window").height / 2 + height / 2;

          scrollViewRef.current.scrollTo({
            y: scrollToPosition,
            animated: true,
          });
        },
        (error) => {
          console.log("Measurement Error: ", error);
        }
      );
    }
  };

  return {
    scrollViewRef,
    pdfContent,
    textRefs,
    isPlaying,
    isLoading,
    startReading,
    stopReading,
    close,
    currentActiveIndex,
  };
};

export default usePdfReader;
