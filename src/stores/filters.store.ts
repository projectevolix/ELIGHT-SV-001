import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FilterState {
  // Associations
  associationSearch: string;
  associationPage: number;

  // Tournaments
  tournamentSearch: string;
  tournamentPage: number;

  // Players
  playerSearch: string;
  playerPage: number;

  // Coaches
  coachSearch: string;
  coachPage: number;

  // Registration
  registrationTournamentFilter: string;
  registrationEventFilter: string;
  registrationSearch: string;
  registrationPage: number;

  // Player Rankings
  rankingsSearch: string;
  rankingsPage: number;
  rankingsDiscipline: string; // 'all' | 'KATA' | 'KUMITE'
  rankingsGender: string; // 'all' | 'M' | 'F'
  rankingsAgeCategory: string; // 'all' | specific age
}

interface FiltersStore extends FilterState {
  // Association filters
  setAssociationSearch: (search: string) => void;
  setAssociationPage: (page: number) => void;
  resetAssociationFilters: () => void;

  // Tournament filters
  setTournamentSearch: (search: string) => void;
  setTournamentPage: (page: number) => void;
  resetTournamentFilters: () => void;

  // Player filters
  setPlayerSearch: (search: string) => void;
  setPlayerPage: (page: number) => void;
  resetPlayerFilters: () => void;

  // Coach filters
  setCoachSearch: (search: string) => void;
  setCoachPage: (page: number) => void;
  resetCoachFilters: () => void;

  // Registration filters
  setRegistrationTournamentFilter: (filter: string) => void;
  setRegistrationEventFilter: (filter: string) => void;
  setRegistrationSearch: (search: string) => void;
  setRegistrationPage: (page: number) => void;
  resetRegistrationFilters: () => void;

  // Rankings filters
  setRankingsSearch: (search: string) => void;
  setRankingsPage: (page: number) => void;
  setRankingsDiscipline: (discipline: string) => void;
  setRankingsGender: (gender: string) => void;
  setRankingsAgeCategory: (category: string) => void;
  resetRankingsFilters: () => void;

  // Global reset
  resetAllFilters: () => void;
}

const initialState: FilterState = {
  associationSearch: "",
  associationPage: 1,
  tournamentSearch: "",
  tournamentPage: 1,
  playerSearch: "",
  playerPage: 1,
  coachSearch: "",
  coachPage: 1,
  registrationTournamentFilter: "all",
  registrationEventFilter: "all",
  registrationSearch: "",
  registrationPage: 1,
  rankingsSearch: "",
  rankingsPage: 1,
  rankingsDiscipline: "all",
  rankingsGender: "all",
  rankingsAgeCategory: "all",
};

export const useFiltersStore = create<FiltersStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Association filters
      setAssociationSearch: (search) =>
        set({ associationSearch: search, associationPage: 1 }),

      setAssociationPage: (page) => set({ associationPage: page }),

      resetAssociationFilters: () =>
        set({
          associationSearch: "",
          associationPage: 1,
        }),

      // Tournament filters
      setTournamentSearch: (search) =>
        set({ tournamentSearch: search, tournamentPage: 1 }),

      setTournamentPage: (page) => set({ tournamentPage: page }),

      resetTournamentFilters: () =>
        set({
          tournamentSearch: "",
          tournamentPage: 1,
        }),

      // Player filters
      setPlayerSearch: (search) => set({ playerSearch: search, playerPage: 1 }),

      setPlayerPage: (page) => set({ playerPage: page }),

      resetPlayerFilters: () =>
        set({
          playerSearch: "",
          playerPage: 1,
        }),

      // Coach filters
      setCoachSearch: (search) => set({ coachSearch: search, coachPage: 1 }),

      setCoachPage: (page) => set({ coachPage: page }),

      resetCoachFilters: () =>
        set({
          coachSearch: "",
          coachPage: 1,
        }),

      // Registration filters
      setRegistrationTournamentFilter: (filter) =>
        set({ registrationTournamentFilter: filter, registrationPage: 1 }),

      setRegistrationEventFilter: (filter) =>
        set({ registrationEventFilter: filter, registrationPage: 1 }),

      setRegistrationSearch: (search) =>
        set({ registrationSearch: search, registrationPage: 1 }),

      setRegistrationPage: (page) => set({ registrationPage: page }),

      resetRegistrationFilters: () =>
        set({
          registrationTournamentFilter: "all",
          registrationEventFilter: "all",
          registrationSearch: "",
          registrationPage: 1,
        }),

      // Rankings filters
      setRankingsSearch: (search) =>
        set({ rankingsSearch: search, rankingsPage: 1 }),

      setRankingsPage: (page) => set({ rankingsPage: page }),

      setRankingsDiscipline: (discipline) =>
        set({ rankingsDiscipline: discipline, rankingsPage: 1 }),

      setRankingsGender: (gender) =>
        set({ rankingsGender: gender, rankingsPage: 1 }),

      setRankingsAgeCategory: (category) =>
        set({ rankingsAgeCategory: category, rankingsPage: 1 }),

      resetRankingsFilters: () =>
        set({
          rankingsSearch: "",
          rankingsPage: 1,
          rankingsDiscipline: "all",
          rankingsGender: "all",
          rankingsAgeCategory: "all",
        }),

      // Global reset
      resetAllFilters: () => set(initialState),
    }),
    {
      name: "filters-store",
    }
  )
);
