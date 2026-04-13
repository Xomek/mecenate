import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { tokens } from "../../theme/tokens";

interface PostCoverProps {
  coverUrl: string;
  title?: string;
}

export const PostCover = ({ coverUrl, title }: PostCoverProps) => {
  return (
    <View style={styles.coverContainer}>
      <Image
        source={{ uri: coverUrl }}
        style={styles.cover}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  coverContainer: {
    width: "100%",
    height: 393,
    borderRadius: tokens.borderRadius.md,
    overflow: "hidden",
    backgroundColor: tokens.colors.surface,
  },
  cover: {
    width: "100%",
    height: "100%",
  },
});
