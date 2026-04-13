import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Send } from "lucide-react-native";
import { tokens } from "../../theme/tokens";

interface CommentInputProps {
  onSubmit: (text: string) => void;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = () => {
    if (!text.trim() || sending) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSending(true);

    onSubmit(text.trim());
    setText("");
    setSending(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Написать комментарий..."
        placeholderTextColor={tokens.colors.textTertiary}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        blurOnSubmit={false}
      />
      <TouchableOpacity
        style={[
          styles.button,
          (!text.trim() || sending) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!text.trim() || sending}
      >
        <Send size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.separator,
    backgroundColor: tokens.colors.background,
    ...(Platform.OS === "ios" && {
      paddingBottom: Math.max(tokens.spacing.md, 34),
    }),
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.fontSize.md,
    color: tokens.colors.textPrimary,
    marginRight: tokens.spacing.md,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
