"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadJson = void 0;
const axios_1 = __importDefault(require("axios"));
const common_1 = require("./common");
const BASE_URL = "https://api.jsonbin.io/v3";
const config = (0, common_1.getConfig)();
const client = axios_1.default.create({
    baseURL: BASE_URL,
});
const header = (accessKey) => ({
    "Content-Type": "application/json",
    "X-Access-Key": config.jsonbinAccessKey,
});
const uploadJson = (name, description, imageUrl, attributes) => __awaiter(void 0, void 0, void 0, function* () {
    const jsonBody = {
        name: name,
        description: description,
        image: imageUrl,
        external_url: imageUrl,
        attributes: attributes,
    };
    try {
        const response = yield client.post("/b", jsonBody, {
            headers: header(config.jsonbinAccessKey),
        });
        return `${BASE_URL}/b/${response.data.metadata.id}`;
    }
    catch (error) {
        console.error("Error uploading JSON:", error);
        throw error;
    }
});
exports.uploadJson = uploadJson;
