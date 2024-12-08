import { Pressable, StyleSheet, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import PdfRenderer from "./PdfRenderer";

export const UPLOAD_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  UPLOADING: "UPLOADING",
  UPLOAD_SUCCESS: "UPLOAD_SUCCESS",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  TYPE_ERROR: "TYPE_ERROR",
};

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState(UPLOAD_STATUS.NOT_STARTED);
  const [fileUri, setFileUri] = useState<null | String>(null);

  const pickFile = () => {
    setUploadStatus(UPLOAD_STATUS.UPLOADING);
    DocumentPicker.getDocumentAsync()
      .then((res) => {
        console.log("The fileData is ", res.assets?.[0]);
        const fileData = res.assets?.[0];
        if (fileData?.mimeType !== "application/pdf") {
          setUploadStatus(UPLOAD_STATUS.TYPE_ERROR);
          return;
        }
        if (fileData?.uri) {
          setUploadStatus(UPLOAD_STATUS.UPLOAD_SUCCESS);
          setFileUri(fileData?.uri);
        }
      })
      .catch((err) => {
        console.log("The err is ", err);
        setUploadStatus(UPLOAD_STATUS.UPLOAD_FAILED);
      });
  };

  const renderMessage = () => {
    let message = "";
    switch (uploadStatus) {
      case UPLOAD_STATUS.UPLOAD_FAILED:
        message = "Something went wrong! Try again";
        break;
      case UPLOAD_STATUS.TYPE_ERROR:
        message = "Sorry, Please select a pdf file to proceed.";
        break;
      default:
        message = "";
    }
    return <Text style={FileUploadStyles.message}>{message}</Text>;
  };

  const renderPdf = () => {
    return <PdfRenderer pdfUri={fileUri} setFileUri={setFileUri} />;
  };

  return (
    <>
      <Pressable
        accessibilityLabel="Upload PDF"
        accessibilityHint="Opens a file picker to select a PDF file"
        style={FileUploadStyles.uploadButton}
        onPress={pickFile}
      >
        <Text style={FileUploadStyles.upload}>Upload PDF</Text>
      </Pressable>
      {renderMessage()}
      {!!fileUri && renderPdf()}
    </>
  );
};

const FileUploadStyles = StyleSheet.create({
  uploadButton: {
    borderWidth: 1,
    borderColor: "#e6e0fa",
    paddingHorizontal: 55,
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#e6e0fa",
  },
  upload: {
    fontFamily: "OpenDyslexic",
    fontSize: 16,
    color: "#1A237E",
  },
  message: {
    paddingTop: 25,
    color: "purple",
    fontSize: 14,
  },
});

export default FileUpload;
