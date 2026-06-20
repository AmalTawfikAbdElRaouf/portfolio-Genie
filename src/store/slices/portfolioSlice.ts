import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PortfolioData } from "../../services/aiService";

interface PortfolioState {
  rawText: string;
  extractedData: {
    basicInfo: boolean;
    contactInfo: boolean;
    workExperiences: boolean;
    socialLinks: boolean;
    education: boolean;
  };
  portfolioData: PortfolioData | null;
}

const initialState: PortfolioState = {
  rawText: "",
  extractedData: {
    basicInfo: false,
    contactInfo: false,
    workExperiences: false,
    socialLinks: false,
    education: false,
  },
  portfolioData: null,
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setRawText: (state, action: PayloadAction<string>) => {
      state.rawText = action.payload;
    },
    setExtractedData: (state, action: PayloadAction<Partial<typeof initialState.extractedData>>) => {
      state.extractedData = { ...state.extractedData, ...action.payload };
    },
    resetExtractedData: (state) => {
      state.extractedData = initialState.extractedData;
    },
    setPortfolioData: (state, action: PayloadAction<PortfolioData>) => {
      state.portfolioData = action.payload;
    },
  },
});

export const { setRawText, setExtractedData, resetExtractedData, setPortfolioData } = portfolioSlice.actions;
export default portfolioSlice.reducer;
