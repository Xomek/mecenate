import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { tokens } from "../theme/tokens";

export type TabType = "all" | "free" | "paid";

interface FeedTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const FeedTabs = ({ activeTab, onTabChange }: FeedTabsProps) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: "all", label: "Все" },
    { key: "free", label: "Бесплатные" },
    { key: "paid", label: "Платные" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.separator,
    backgroundColor: tokens.colors.background,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.full,
    backgroundColor: "transparent",
  },
  activeTab: {
    backgroundColor: tokens.colors.primary,
  },
  tabText: {
    fontSize: tokens.typography.fontSize.md,
    fontWeight: "500",
    color: tokens.colors.textSecondary,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
});
