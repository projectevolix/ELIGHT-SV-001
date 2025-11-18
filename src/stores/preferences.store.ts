import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "grid" | "list";
type Theme = "light" | "dark" | "system";

interface PreferencesState {
  // View modes
  associationsViewMode: ViewMode;
  tournamentsViewMode: ViewMode;
  playersViewMode: ViewMode;
  coachesViewMode: ViewMode;

  // Theme
  theme: Theme;

  // Sidebar
  sidebarOpen: boolean;

  // Expanded items
  expandedAssociations: Record<string, boolean>;
  expandedTournaments: Record<string, boolean>;

  // Column visibility (for tables)
  associationColumnVisibility: Record<string, boolean>;
  tournamentColumnVisibility: Record<string, boolean>;
  playerColumnVisibility: Record<string, boolean>;
  coachColumnVisibility: Record<string, boolean>;
}

interface PreferencesStore extends PreferencesState {
  // View mode actions
  setAssociationsViewMode: (mode: ViewMode) => void;
  setTournamentsViewMode: (mode: ViewMode) => void;
  setPlayersViewMode: (mode: ViewMode) => void;
  setCoachesViewMode: (mode: ViewMode) => void;

  // Theme actions
  setTheme: (theme: Theme) => void;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Expanded items actions
  toggleExpandedAssociation: (id: string) => void;
  setExpandedAssociation: (id: string, expanded: boolean) => void;
  toggleExpandedTournament: (id: string) => void;
  setExpandedTournament: (id: string, expanded: boolean) => void;
  collapseAllAssociations: () => void;
  collapseAllTournaments: () => void;

  // Column visibility actions
  setAssociationColumnVisibility: (visibility: Record<string, boolean>) => void;
  setTournamentColumnVisibility: (visibility: Record<string, boolean>) => void;
  setPlayerColumnVisibility: (visibility: Record<string, boolean>) => void;
  setCoachColumnVisibility: (visibility: Record<string, boolean>) => void;
  toggleAssociationColumn: (column: string) => void;
  toggleTournamentColumn: (column: string) => void;
  togglePlayerColumn: (column: string) => void;
  toggleCoachColumn: (column: string) => void;

  // Reset
  resetPreferences: () => void;
}

const initialState: PreferencesState = {
  associationsViewMode: "grid",
  tournamentsViewMode: "grid",
  playersViewMode: "list",
  coachesViewMode: "list",
  theme: "system",
  sidebarOpen: true,
  expandedAssociations: {},
  expandedTournaments: {},
  associationColumnVisibility: {
    name: true,
    location: true,
    coaches: true,
    players: true,
    createdAt: true,
  },
  tournamentColumnVisibility: {
    name: true,
    startDate: true,
    endDate: true,
    location: true,
    status: true,
    participants: true,
  },
  playerColumnVisibility: {
    name: true,
    email: true,
    gender: true,
    dateOfBirth: true,
    belt: true,
    association: true,
  },
  coachColumnVisibility: {
    name: true,
    email: true,
    qualification: true,
    association: true,
    createdAt: true,
  },
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...initialState,

      // View mode actions
      setAssociationsViewMode: (mode) => set({ associationsViewMode: mode }),

      setTournamentsViewMode: (mode) => set({ tournamentsViewMode: mode }),

      setPlayersViewMode: (mode) => set({ playersViewMode: mode }),

      setCoachesViewMode: (mode) => set({ coachesViewMode: mode }),

      // Theme actions
      setTheme: (theme) => set({ theme }),

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Expanded items actions
      toggleExpandedAssociation: (id) =>
        set((state) => ({
          expandedAssociations: {
            ...state.expandedAssociations,
            [id]: !state.expandedAssociations[id],
          },
        })),

      setExpandedAssociation: (id, expanded) =>
        set((state) => ({
          expandedAssociations: {
            ...state.expandedAssociations,
            [id]: expanded,
          },
        })),

      toggleExpandedTournament: (id) =>
        set((state) => ({
          expandedTournaments: {
            ...state.expandedTournaments,
            [id]: !state.expandedTournaments[id],
          },
        })),

      setExpandedTournament: (id, expanded) =>
        set((state) => ({
          expandedTournaments: {
            ...state.expandedTournaments,
            [id]: expanded,
          },
        })),

      collapseAllAssociations: () => set({ expandedAssociations: {} }),

      collapseAllTournaments: () => set({ expandedTournaments: {} }),

      // Column visibility actions
      setAssociationColumnVisibility: (visibility) =>
        set({ associationColumnVisibility: visibility }),

      setTournamentColumnVisibility: (visibility) =>
        set({ tournamentColumnVisibility: visibility }),

      setPlayerColumnVisibility: (visibility) =>
        set({ playerColumnVisibility: visibility }),

      setCoachColumnVisibility: (visibility) =>
        set({ coachColumnVisibility: visibility }),

      toggleAssociationColumn: (column) =>
        set((state) => ({
          associationColumnVisibility: {
            ...state.associationColumnVisibility,
            [column]: !state.associationColumnVisibility[column],
          },
        })),

      toggleTournamentColumn: (column) =>
        set((state) => ({
          tournamentColumnVisibility: {
            ...state.tournamentColumnVisibility,
            [column]: !state.tournamentColumnVisibility[column],
          },
        })),

      togglePlayerColumn: (column) =>
        set((state) => ({
          playerColumnVisibility: {
            ...state.playerColumnVisibility,
            [column]: !state.playerColumnVisibility[column],
          },
        })),

      toggleCoachColumn: (column) =>
        set((state) => ({
          coachColumnVisibility: {
            ...state.coachColumnVisibility,
            [column]: !state.coachColumnVisibility[column],
          },
        })),

      // Reset
      resetPreferences: () => set(initialState),
    }),
    {
      name: "preferences-store",
    }
  )
);
