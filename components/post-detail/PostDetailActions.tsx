import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Heart, MessageCircle } from "lucide-react-native";
import { tokens } from "../../theme/tokens";

interface PostDetailActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  onLike: () => void;
}

export const PostDetailActions = ({
  likesCount,
  commentsCount,
  isLiked,
  onLike,
}: PostDetailActionsProps) => {
  const likeScale = useSharedValue(1);

  const animatedLikeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    likeScale.value = withSequence(
      withSpring(1.3, { duration: 100 }),
      withSpring(1, { duration: 100 }),
    );

    onLike();
  };

  return (
    <View style={styles.actions}>
      <Animated.View style={animatedLikeStyle}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Heart
            size={24}
            color={isLiked ? tokens.colors.like : tokens.colors.icon}
            fill={isLiked ? tokens.colors.like : "none"}
          />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>
            {likesCount}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.actionButton}>
        <MessageCircle size={24} color={tokens.colors.icon} />
        <Text style={styles.actionText}>{commentsCount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.separator,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: tokens.spacing.xl,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.borderRadius.full,
    backgroundColor: tokens.colors.buttonBackground,
  },
  actionText: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "500",
    color: tokens.colors.textSecondary,
    marginLeft: tokens.spacing.sm,
  },
  likedText: {
    color: tokens.colors.like,
  },
});
