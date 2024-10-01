"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeData = exports.loadData = exports.saveData = void 0;
class Storage {
    constructor(filePath = "storage.json") {
        console.log("Running in:", typeof window === "undefined" ? "Node.js" : "Browser");
        this.initialized = false; // To track initialization status
        if (this._isBrowser()) {
            this.storageType = "browser";
            this.initialized = true; // No need to load fs in the browser
            this.data = {};
        }
        else {
            this.storageType = "file";
            this.filePath = filePath;
            this.data = {};
            // Load the fs module and initialize storage
            this._loadFsModule().then(() => {
                this.initialized = true; // Set to true when fs is loaded
                // Load data from file if it exists
                if (this.fs && this.fs.existsSync(this.filePath)) {
                    const fileContent = this.fs.readFileSync(this.filePath, "utf-8");
                    try {
                        this.data = JSON.parse(fileContent);
                    }
                    catch (error) {
                        console.error("Error parsing file content:", error);
                        this.data = {};
                    }
                }
            });
        }
    }
    _loadFsModule() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof window === "undefined") {
                try {
                    this.fs = yield Promise.resolve().then(() => __importStar(require("fs")));
                    console.log("fs module loaded successfully");
                }
                catch (err) {
                    console.error("Error importing fs:", err);
                }
            }
        });
    }
    // Set key-value pair
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._waitForInitialization(); // Wait until initialized
            if (this.storageType === "browser") {
                localStorage.setItem(key, JSON.stringify(value));
            }
            else {
                this.data[key] = value;
                this._saveToFile();
            }
        });
    }
    // Get value by key
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._waitForInitialization(); // Wait until initialized
            if (this.storageType === "browser") {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : null;
            }
            else {
                return this.data[key] || null;
            }
        });
    }
    // Remove key-value pair
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._waitForInitialization(); // Wait until initialized
            if (this.storageType === "browser") {
                localStorage.removeItem(key);
            }
            else {
                delete this.data[key];
                this._saveToFile();
            }
        });
    }
    // Save data to file
    _saveToFile() {
        if (this.fs) {
            // Ensure fs is loaded before using it
            this.fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), "utf-8");
        }
        else {
            console.error("fs module not loaded, unable to save to file.");
        }
    }
    // Wait until the storage is initialized
    _waitForInitialization() {
        return new Promise((resolve) => {
            const checkInitialization = setInterval(() => {
                if (this.initialized) {
                    clearInterval(checkInitialization);
                    resolve();
                }
            }, 100); // Check every 100 milliseconds
        });
    }
    // Check if the environment is a browser
    _isBrowser() {
        return typeof window !== "undefined" && typeof localStorage !== "undefined";
    }
}
// Create an instance of Storage
const storage = new Storage();
const saveData = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    return yield storage.set(key, value);
});
exports.saveData = saveData;
const loadData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield storage.get(key);
});
exports.loadData = loadData;
const removeData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    return yield storage.remove(key);
});
exports.removeData = removeData;
