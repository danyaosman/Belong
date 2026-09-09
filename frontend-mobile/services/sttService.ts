import * as FileSystem from "expo-file-system/legacy";

const API_URL =
  "https://spectrum-resize-nerd.ngrok-free.dev";

export async function transcribeAudio(
  uri: string
): Promise<string> {
  console.log("Uploading audio to STT:", uri);

  const result =
    await FileSystem.uploadAsync(
      `${API_URL}/stt`,
      uri,
      {
        httpMethod: "POST",
        uploadType:
          FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: "file",
        mimeType: "audio/mp4",
        parameters: {},
      }
    );

  console.log(
    "STT response status:",
    result.status
  );

  console.log(
    "STT response body:",
    result.body
  );

  if (result.status < 200 || result.status >= 300) {
    throw new Error(
      `STT request failed: ${result.status} ${result.body}`
    );
  }

  const data = JSON.parse(result.body);

  if (!data.text) {
    throw new Error(
      "STT returned no transcription."
    );
  }

  return data.text;
}