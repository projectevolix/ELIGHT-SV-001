import { create } from "zustand";

interface ScoreboardState {
  // Kumite Scoreboard
  kumite: {
    timeRemaining: number;
    baseTime: number;
    isRunning: boolean;
    akaScore: number;
    aoScore: number;
    selectedDuration: string;
  };

  // Kata Scoreboard (for future use)
  kata: {
    timeRemaining: number;
    baseTime: number;
    isRunning: boolean;
  };
}

interface ScoreboardActions {
  // Kumite Timer
  setKumiteTimeRemaining: (time: number) => void;
  setKumiteBaseTime: (time: number) => void;
  setKumiteIsRunning: (running: boolean) => void;
  setKumiteAkaScore: (score: number) => void;
  setKumiteAoScore: (score: number) => void;
  setKumiteSelectedDuration: (duration: string) => void;

  // Kumite Actions
  startKumiteTimer: () => void;
  pauseKumiteTimer: () => void;
  resetKumiteTimer: () => void;
  setKumiteTime: (timeRemaining: number, baseTime: number) => void;
  updateKumiteScore: (
    type: "aka" | "ao",
    action: "add" | "subtract",
    value: number
  ) => void;

  // Kata Timer (for future)
  setKataTimeRemaining: (time: number) => void;
  setKataBaseTime: (time: number) => void;
  setKataIsRunning: (running: boolean) => void;
  startKataTimer: () => void;
  pauseKataTimer: () => void;
  resetKataTimer: () => void;
}

export const useScoreboardStore = create<ScoreboardState & ScoreboardActions>(
  (set) => ({
    // Initial state
    kumite: {
      timeRemaining: 180,
      baseTime: 180,
      isRunning: false,
      akaScore: 0,
      aoScore: 0,
      selectedDuration: "3.00",
    },
    kata: {
      timeRemaining: 180,
      baseTime: 180,
      isRunning: false,
    },

    // Kumite Timer Setters
    setKumiteTimeRemaining: (time: number) =>
      set((state) => ({
        kumite: { ...state.kumite, timeRemaining: time },
      })),

    setKumiteBaseTime: (time: number) =>
      set((state) => ({
        kumite: { ...state.kumite, baseTime: time },
      })),

    setKumiteIsRunning: (running: boolean) =>
      set((state) => ({
        kumite: { ...state.kumite, isRunning: running },
      })),

    setKumiteAkaScore: (score: number) =>
      set((state) => ({
        kumite: { ...state.kumite, akaScore: score },
      })),

    setKumiteAoScore: (score: number) =>
      set((state) => ({
        kumite: { ...state.kumite, aoScore: score },
      })),

    setKumiteSelectedDuration: (duration: string) =>
      set((state) => ({
        kumite: { ...state.kumite, selectedDuration: duration },
      })),

    // Kumite Actions
    startKumiteTimer: () =>
      set((state) => ({
        kumite: { ...state.kumite, isRunning: true },
      })),

    pauseKumiteTimer: () =>
      set((state) => ({
        kumite: { ...state.kumite, isRunning: false },
      })),

    resetKumiteTimer: () =>
      set((state) => ({
        kumite: {
          ...state.kumite,
          timeRemaining: state.kumite.baseTime,
          isRunning: false,
        },
      })),

    setKumiteTime: (timeRemaining: number, baseTime: number) =>
      set((state) => ({
        kumite: { ...state.kumite, timeRemaining, baseTime },
      })),

    updateKumiteScore: (
      type: "aka" | "ao",
      action: "add" | "subtract",
      value: number
    ) =>
      set((state) => {
        if (type === "aka") {
          const newScore =
            action === "add"
              ? state.kumite.akaScore + value
              : Math.max(0, state.kumite.akaScore - value);
          return { kumite: { ...state.kumite, akaScore: newScore } };
        } else {
          const newScore =
            action === "add"
              ? state.kumite.aoScore + value
              : Math.max(0, state.kumite.aoScore - value);
          return { kumite: { ...state.kumite, aoScore: newScore } };
        }
      }),

    // Kata Timer Setters (for future use)
    setKataTimeRemaining: (time: number) =>
      set((state) => ({
        kata: { ...state.kata, timeRemaining: time },
      })),

    setKataBaseTime: (time: number) =>
      set((state) => ({
        kata: { ...state.kata, baseTime: time },
      })),

    setKataIsRunning: (running: boolean) =>
      set((state) => ({
        kata: { ...state.kata, isRunning: running },
      })),

    startKataTimer: () =>
      set((state) => ({
        kata: { ...state.kata, isRunning: true },
      })),

    pauseKataTimer: () =>
      set((state) => ({
        kata: { ...state.kata, isRunning: false },
      })),

    resetKataTimer: () =>
      set((state) => ({
        kata: {
          ...state.kata,
          timeRemaining: state.kata.baseTime,
          isRunning: false,
        },
      })),
  })
);
