import axios from "axios";
import type { Project, StatsData, UserInfo } from "../types/user";

export type { Project, StatsData, UserInfo };

const api = axios.create({
  baseURL: "/",
});

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProjects = async (): Promise<Project[]> => {
  await delay(800);
  const { data } = await api.get<Project[]>("/projects.json");
  return data;
};

export const getStats = async (): Promise<StatsData> => {
  await delay(600);
  try {
    const { data } = await api.get<StatsData>("/stats.json");
    return data;
  } catch {
    return {
      totalPortfolios: "12",
      liveAction: "5",
      totalViews: 1450,
    };
  }
};

export const getUserProfile = async (): Promise<UserInfo> => {
  await delay(500);
  const { data } = await api.get<UserInfo>("/userProfile.json");
  return data;
};

export default api;
