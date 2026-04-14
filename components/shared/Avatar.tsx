import React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { tokens } from "../../theme/tokens";

interface AvatarProps {
  source?: { uri: string } | any;
  size?: number;
  fallback?: string;
}

export const Avatar = ({ source, size = 40, fallback }: AvatarProps) => {
  const getInitials = () => {
    if (!fallback) return "?";
    return fallback
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  if (!source || !source.uri) {
    return (
      <View
        style={[
          styles.fallback,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials()}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={source}
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: tokens.colors.surface,
  },
  fallback: {
    backgroundColor: tokens.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
