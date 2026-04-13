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

export async function getAuthToken(): Promise<string> {
  try {
    let token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (!token) {
      token = generateUUID();
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_ID_KEY, `user_${token.slice(0, 8)}`);
    }

    return token;
  } catch (error) {
    console.error("Failed to get/set auth token:", error);
    return generateUUID();
  }
}

export async function getUserId(): Promise<string> {
  try {
    const userId = await SecureStore.getItemAsync(USER_ID_KEY);
    return userId || `user_${(await getAuthToken()).slice(0, 8)}`;
  } catch {
    return "user_unknown";
  }
}
