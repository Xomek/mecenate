import { makeAutoObservable } from "mobx";

export type TabType = "all" | "free" | "paid";

export class FeedStore {
  activeTab: TabType = "all";
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveTab(tab: TabType) {
    this.activeTab = tab;
  }

  setError(error: string | null) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }
}

export const feedStore = new FeedStore();
