/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { type ReactNode } from "react";

interface SidebarState {
  searchTerm: string;
  expandedCategories: string[];
  selectedShape: any; 
  draggedShape: any; 
  recentShapes: any; 
  favoriteShapes: any; 
}

const initialState: SidebarState = {
  searchTerm: "",
  expandedCategories: ["general", "basic"],
  selectedShape: null,
  draggedShape: null,
  recentShapes: [],
  favoriteShapes: [],
};

// eslint-disable-next-line react-refresh/only-export-components
const SidebarContext = React.createContext<{
  state: SidebarState;
  dispatch: React.Dispatch<any>; 
}>(initialState as any);

const sidebarReducer = (state: SidebarState, action: any) => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "TOGGLE_CATEGORY": {
      const isExpanded = state.expandedCategories.includes(action.payload);
      return {
        ...state,
        expandedCategories: isExpanded
          ? state.expandedCategories.filter(
              (cat) => cat !== action.payload
            )
          : [...state.expandedCategories, action.payload],
      };
    }
    case "SELECT_SHAPE":
      return { ...state, selectedShape: action.payload };
    case "DRAG_SHAPE":
      return { ...state, draggedShape: action.payload };
    case "ADD_RECENT_SHAPE":
      return {
        ...state,
        recentShapes: [
          action.payload,
          ...state.recentShapes.filter(
            (shape: { id: any; }) => shape.id !== action.payload.id
          ),
        ],
      };
    case "ADD_FAVORITE_SHAPE":
      return {
        ...state,
        favoriteShapes: [
          action.payload,
          ...state.favoriteShapes.filter(
            (shape: { id: any; }) => shape.id !== action.payload.id
          ),
        ],
      };
    default:
      return state;
  }
};

interface ComponentProps {
  children: ReactNode;
} 

const SidebarProvider = ({ children }: ComponentProps) => {
  const [state, dispatch] = React.useReducer(sidebarReducer, initialState);

  return (
    <SidebarContext.Provider value={{ state, dispatch }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarProvider, SidebarContext };