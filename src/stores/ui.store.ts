import { create } from "zustand";
import { Association } from "@/types/api/associations";
import { Tournament } from "@/types/api/tournaments";
import { EventDTO } from "@/types/api/events";
import { CoachDTO } from "@/types/api/coaches";

export type SheetMode = "create" | "edit" | "view";

interface UIStore {
  // Association Sheets
  associationSheetOpen: boolean;
  associationSheetMode: SheetMode;
  selectedAssociation: Association | null;
  manageCoachesSheetOpen: boolean;
  managePlayersSheetOpen: boolean;

  // Tournament Sheets
  tournamentSheetOpen: boolean;
  tournamentSheetMode: SheetMode;
  selectedTournament: Tournament | null;
  manageEventsSheetOpen: boolean;

  // Event Sheets
  eventSheetOpen: boolean;
  eventSheetMode: SheetMode;
  selectedEvent: EventDTO | null;

  // Coach Sheets
  coachSheetOpen: boolean;
  coachSheetMode: SheetMode;
  selectedCoach: CoachDTO | null;
  coachDetailsDialogOpen: boolean;

  // Delete Confirmation
  deleteConfirmOpen: boolean;
  itemToDelete: { type: string; id: number | string; name: string } | null;

  // Association Actions
  openAssociationSheet: (mode: SheetMode, association?: Association) => void;
  closeAssociationSheet: () => void;
  setSelectedAssociation: (association: Association | null) => void;
  openManageCoachesSheet: (association: Association) => void;
  closeManageCoachesSheet: () => void;
  openManagePlayersSheet: (association: Association) => void;
  closeManagePlayersSheet: () => void;

  // Tournament Actions
  openTournamentSheet: (mode: SheetMode, tournament?: Tournament) => void;
  closeTournamentSheet: () => void;
  setSelectedTournament: (tournament: Tournament | null) => void;
  openManageEventsSheet: (tournament: Tournament) => void;
  closeManageEventsSheet: () => void;

  // Event Actions
  openEventSheet: (mode: SheetMode, event?: EventDTO) => void;
  closeEventSheet: () => void;
  setSelectedEvent: (event: EventDTO | null) => void;

  // Coach Actions
  openCoachSheet: (mode: SheetMode, coach?: CoachDTO) => void;
  closeCoachSheet: () => void;
  setSelectedCoach: (coach: CoachDTO | null) => void;
  openCoachDetailsDialog: (coach: CoachDTO) => void;
  closeCoachDetailsDialog: () => void;

  // Delete Confirmation Actions
  openDeleteConfirm: (type: string, id: number | string, name: string) => void;
  closeDeleteConfirm: () => void;

  // Batch close (for navigation)
  closeAllSheets: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  associationSheetOpen: false,
  associationSheetMode: "create",
  selectedAssociation: null,
  manageCoachesSheetOpen: false,
  managePlayersSheetOpen: false,

  tournamentSheetOpen: false,
  tournamentSheetMode: "create",
  selectedTournament: null,
  manageEventsSheetOpen: false,

  eventSheetOpen: false,
  eventSheetMode: "create",
  selectedEvent: null,

  coachSheetOpen: false,
  coachSheetMode: "create",
  selectedCoach: null,
  coachDetailsDialogOpen: false,

  deleteConfirmOpen: false,
  itemToDelete: null,

  // Association Actions
  openAssociationSheet: (mode, association) =>
    set({
      associationSheetOpen: true,
      associationSheetMode: mode,
      selectedAssociation: association || null,
    }),

  closeAssociationSheet: () =>
    set({
      associationSheetOpen: false,
      selectedAssociation: null,
    }),

  setSelectedAssociation: (association) =>
    set({ selectedAssociation: association }),

  openManageCoachesSheet: (association) =>
    set({
      manageCoachesSheetOpen: true,
      selectedAssociation: association,
    }),

  closeManageCoachesSheet: () => set({ manageCoachesSheetOpen: false }),

  openManagePlayersSheet: (association) =>
    set({
      managePlayersSheetOpen: true,
      selectedAssociation: association,
    }),

  closeManagePlayersSheet: () => set({ managePlayersSheetOpen: false }),

  // Tournament Actions
  openTournamentSheet: (mode, tournament) =>
    set({
      tournamentSheetOpen: true,
      tournamentSheetMode: mode,
      selectedTournament: tournament || null,
    }),

  closeTournamentSheet: () =>
    set({
      tournamentSheetOpen: false,
      selectedTournament: null,
    }),

  setSelectedTournament: (tournament) =>
    set({ selectedTournament: tournament }),

  openManageEventsSheet: (tournament) =>
    set({
      manageEventsSheetOpen: true,
      selectedTournament: tournament,
    }),

  closeManageEventsSheet: () => set({ manageEventsSheetOpen: false }),

  // Event Actions
  openEventSheet: (mode, event) =>
    set({
      eventSheetOpen: true,
      eventSheetMode: mode,
      selectedEvent: event || null,
    }),

  closeEventSheet: () =>
    set({
      eventSheetOpen: false,
      selectedEvent: null,
    }),

  setSelectedEvent: (event) => set({ selectedEvent: event }),

  // Coach Actions
  openCoachSheet: (mode, coach) =>
    set({
      coachSheetOpen: true,
      coachSheetMode: mode,
      selectedCoach: coach || null,
    }),

  closeCoachSheet: () =>
    set({
      coachSheetOpen: false,
      selectedCoach: null,
    }),

  setSelectedCoach: (coach) => set({ selectedCoach: coach }),

  openCoachDetailsDialog: (coach) =>
    set({
      coachDetailsDialogOpen: true,
      selectedCoach: coach,
    }),

  closeCoachDetailsDialog: () =>
    set({
      coachDetailsDialogOpen: false,
      selectedCoach: null,
    }),

  // Delete Confirmation Actions
  openDeleteConfirm: (type, id, name) =>
    set({
      deleteConfirmOpen: true,
      itemToDelete: { type, id, name },
    }),

  closeDeleteConfirm: () =>
    set({
      deleteConfirmOpen: false,
      itemToDelete: null,
    }),

  // Batch close
  closeAllSheets: () =>
    set({
      associationSheetOpen: false,
      manageCoachesSheetOpen: false,
      managePlayersSheetOpen: false,
      tournamentSheetOpen: false,
      manageEventsSheetOpen: false,
      eventSheetOpen: false,
      coachSheetOpen: false,
      coachDetailsDialogOpen: false,
      deleteConfirmOpen: false,
      selectedAssociation: null,
      selectedTournament: null,
      selectedEvent: null,
      selectedCoach: null,
      itemToDelete: null,
    }),
}));
