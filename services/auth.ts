import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "mecenate_user_uuid";
const USER_ID_KEY = "mecenate_user_id";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === "web") {
        return localStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.warn(`Failed to get item ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === "web") {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn(`Failed to set item ${key}:`, error);
    }
  },
};

export async function getAuthToken(): Promise<string> {
  try {
    let token = await storage.getItem(TOKEN_KEY);

    if (!token) {
      token = generateUUID();
      await storage.setItem(TOKEN_KEY, token);
      await storage.setItem(USER_ID_KEY, `user_${token.slice(0, 8)}`);
    }

    return token;
  } catch (error) {
    console.error("Failed to get/set auth token:", error);
    return generateUUID();
  }
}

export async function getUserId(): Promise<string> {
  try {
    const userId = await storage.getItem(USER_ID_KEY);
    if (userId) return userId;

    const newUserId = `user_${(await getAuthToken()).slice(0, 8)}`;
    await storage.setItem(USER_ID_KEY, newUserId);
    return newUserId;
  } catch {
    return "user_unknown";
  }
}
