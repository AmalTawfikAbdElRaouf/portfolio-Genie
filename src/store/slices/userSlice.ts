import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserInfo, UserState } from "../../types/user";

const initialState: UserState = {
  data: {
    name: "",
    job: "",
    avatar: "",
  },
  isLoggedIn: false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInfo>) => {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.data = { name: "", job: "", avatar: "" };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, logout, setLoading } = userSlice.actions;
export default userSlice.reducer;