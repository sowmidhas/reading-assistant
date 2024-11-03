import { Pressable, StyleSheet, Text } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import PdfRenderer from "./PdfRenderer";

export const UPLOAD_STATUS = {
  NOT_STARTED: "NOT_STARTED",
  UPLOADING: "UPLOADING",
  UPLOAD_SUCCESS: "UPLOAD_SUCCESS",
  UPLOAD_FAILED: "UPLOAD_FAILED",
};

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState(UPLOAD_STATUS.NOT_STARTED);
  const [fileUri, setFileUri] = useState<null | String>(null);

  const pickFile = () => {
    setUploadStatus(UPLOAD_STATUS.UPLOADING);
    DocumentPicker.getDocumentAsync()
      .then((res) => {
        console.log("***** ", res.assets?.[0]?.uri);
        if (res.assets?.[0]?.uri) {
          setUploadStatus(UPLOAD_STATUS.UPLOAD_SUCCESS);
          setFileUri(res.assets?.[0]?.uri);
        }
      })
      .catch((err) => {
        console.log("the err is ", err);
        setUploadStatus(UPLOAD_STATUS.UPLOAD_FAILED);
      });
  };

  const renderMessage = () => {
    let message = "";
    switch (uploadStatus) {
      case UPLOAD_STATUS.UPLOAD_FAILED:
        message = "Something went wrong! Try again";
      default:
        message = "";
    }
    return <Text>{message}</Text>;
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
});

export default FileUpload;
