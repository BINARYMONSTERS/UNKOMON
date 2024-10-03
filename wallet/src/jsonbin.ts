import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { getConfig } from "./common";

const BASE_URL = "https://api.jsonbin.io/v3 ";
const config = getConfig();

const client = axios.create({
  baseURL: BASE_URL,
});

const header = (accessKey: string): RawAxiosRequestHeaders => ({
  "Content-Type": "application/json",
  "X-Access-Key": config.jsonbinAccessKey,
});

type JsonBinMetadata = {
  id: string;
  createdAt: string;
  private: boolean;
};
type JsonBinResponse = {
  record: Record<string, string>;
  metadata: JsonBinMetadata;
};

export const uploadJson = async (
  data: Record<string, string>
): Promise<string> => {
  try {
    const response = await client.post<JsonBinResponse>("/b", data, {
      headers: header(config.jsonbinAccessKey),
    });
    return `${BASE_URL}/b/${response.data.metadata.id}`;
  } catch (error) {
    console.error("Error uploading JSON:", error);
    throw error;
  }
};
