class Storage {
  constructor(filePath = "storage.json") {
    console.log(
      "Running in:",
      typeof window === "undefined" ? "Node.js" : "Browser"
    );

    this.initialized = false; // To track initialization status

    if (this._isBrowser()) {
      this.storageType = "browser";
      this.initialized = true; // No need to load fs in the browser
    } else {
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
          } catch (error) {
            console.error("Error parsing file content:", error);
            this.data = {};
          }
        }
      });
    }
  }

  async _loadFsModule() {
    if (typeof window === "undefined") {
      try {
        this.fs = await import("fs"); // Store fs as a property of the class instance
        console.log("fs module loaded successfully");
      } catch (err) {
        console.error("Error importing fs:", err);
      }
    }
  }

  // Set key-value pair
  async set(key, value) {
    await this._waitForInitialization(); // Wait until initialized

    if (this.storageType === "browser") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      this.data[key] = value;
      this._saveToFile();
    }
  }

  // Get value by key
  async get(key) {
    await this._waitForInitialization(); // Wait until initialized

    if (this.storageType === "browser") {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else {
      return this.data[key] || null;
    }
  }

  // Remove key-value pair
  async remove(key) {
    await this._waitForInitialization(); // Wait until initialized

    if (this.storageType === "browser") {
      localStorage.removeItem(key);
    } else {
      delete this.data[key];
      this._saveToFile();
    }
  }

  // Save data to file
  _saveToFile() {
    if (this.fs) {
      // Ensure fs is loaded before using it
      this.fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.data, null, 2),
        "utf-8"
      );
    } else {
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

export const saveData = async (key, value) => {
  return await storage.set(key, value);
};

export const loadData = async (key) => {
  return await storage.get(key);
};

export const removeData = async (key) => {
  return await storage.remove(key);
};
