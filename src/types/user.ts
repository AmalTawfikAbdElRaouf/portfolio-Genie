export interface UserInfo {
  name: string;
  job: string;
  avatar: string;
  email?: string;
  bio?: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  status: "Live" | "Draft";
  date: string;
}

export interface StatsData {
  totalPortfolios: string;
  liveAction: string;
  totalViews: number;
}

export interface UserState {
  data: UserInfo;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}
