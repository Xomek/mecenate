import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import * as Haptics from "expo-haptics";
import { tokens } from "../../theme/tokens";

interface CommentInputProps {
  onSubmit: (text: string) => Promise<void>;
}

export const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || sending) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSending(true);

    try {
      await onSubmit(text.trim());
      setText("");
    } finally {
      setSending(false);
    }
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
      />
      <TouchableOpacity
        style={[
          styles.button,
          (!text.trim() || sending) && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!text.trim() || sending}
      >
        <Text style={styles.buttonText}>{sending ? "..." : "Отправить"}</Text>
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
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "600",
  },
});
