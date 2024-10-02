class Storage {
  private initialized: boolean;
  private storageType: "browser" | "file";
  private filePath?: string;
  private data: Record<string, any>;
  private fs?: typeof import("fs");

  constructor(filePath: string = "storage.json") {
    console.log(
      "Running in:",
      typeof window === "undefined" ? "Node.js" : "Browser"
    );

    this.initialized = false; // To track initialization status

    if (this._isBrowser()) {
      this.storageType = "browser";
      this.initialized = true; // No need to load fs in the browser
      this.data = {};
    } else {
      this.storageType = "file";
      this.filePath = filePath;
      this.data = {};

      // Load the fs module and initialize storage
      this._loadFsModule().then(() => {
        this.initialized = true; // Set to true when fs is loaded

        // Load data from file if it exists
        if (this.fs && this.fs.existsSync(this.filePath!)) {
          const fileContent = this.fs.readFileSync(this.filePath!, "utf-8");
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

  private async _loadFsModule(): Promise<void> {
    if (typeof window === "undefined") {
      try {
        this.fs = await import("fs");
        console.log("fs module loaded successfully");
      } catch (err) {
        console.error("Error importing fs:", err);
      }
    }
  }

  // Set key-value pair
  public async set(key: string, value: any): Promise<void> {
    await this._waitForInitialization(); // Wait until initialized

    if (this.storageType === "browser") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      this.data[key] = value;
      this._saveToFile();
    }
  }

  // Get value by key
  public async get(key: string): Promise<any> {
    await this._waitForInitialization(); // Wait until initialized

    if (this.storageType === "browser") {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else {
      return this.data[key] || null;
    }
  }

  // Remove key-value pair
  public async remove(key: string): Promise<void> {
    await this._waitForInitialization(); // Wait until initialized

    if (this.storageType === "browser") {
      localStorage.removeItem(key);
    } else {
      delete this.data[key];
      this._saveToFile();
    }
  }

  // Save data to file
  private _saveToFile(): void {
    if (this.fs) {
      // Ensure fs is loaded before using it
      this.fs.writeFileSync(
        this.filePath!,
        JSON.stringify(this.data, null, 2),
        "utf-8"
      );
    } else {
      console.error("fs module not loaded, unable to save to file.");
    }
  }

  // Wait until the storage is initialized
  private _waitForInitialization(): Promise<void> {
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
  private _isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }
}

// Create an instance of Storage
const storage = new Storage();

export const saveData = async (key: string, value: any): Promise<void> => {
  return await storage.set(key, value);
};

export const loadData = async (key: string): Promise<any> => {
  return await storage.get(key);
};

export const removeData = async (key: string): Promise<void> => {
  return await storage.remove(key);
};
