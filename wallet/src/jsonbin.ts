import axios, { RawAxiosRequestHeaders } from "axios";
import { getConfig } from "./common";

const BASE_URL = "https://api.jsonbin.io/v3";
const config = getConfig();

const client = axios.create({
  baseURL: BASE_URL,
});

const header = ({
  masterKey,
  accessKey,
  isPrivate,
}: {
  masterKey?: string;
  accessKey?: string;
  isPrivate?: boolean;
}): RawAxiosRequestHeaders => {
  const headers: RawAxiosRequestHeaders = {
    "Content-Type": "application/json",
  };
  if (!masterKey && !accessKey) {
    throw new Error("Master key or access key is required");
  }

  if (masterKey) headers["X-Master-Key"] = masterKey;
  if (accessKey) headers["X-Access-Key"] = accessKey;
  if (isPrivate != undefined) headers["X-Bin-Private"] = `${isPrivate}`;

  return headers;
};

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
  name: string,
  description: string,
  imageUrl: string,
  attributes: Record<string, string>
): Promise<string> => {
  const jsonBody = {
    name: name,
    description: description,
    image: imageUrl,
    external_url: imageUrl,
    attributes: attributes,
  };

  try {
    const response = await client.post<JsonBinResponse>("/b", jsonBody, {
      headers: header({
        masterKey: config.jsonBinMasterKey,
        isPrivate: false,
      }),
    });
    return `${BASE_URL}/b/${response.data.metadata.id}?meta=false`;
  } catch (error) {
    console.error("Error uploading JSON:", error);
    throw error;
  }
};
