const { safeStorage } = require("electron");

console.log(safeStorage.isEncryptionAvailable());
safeStorage.encryptString("hello");
