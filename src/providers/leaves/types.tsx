export interface Leaves {
    id: string;
    fromDate: string;
    toDate: string;
    reason: string;
    leaveType: string;
    status: string;
    days: string;
    appliedOn: string;
};

export interface LeavesContextType {
  leaves: Leaves[];
  addLeave: (leave: Leaves) => void;
  updateLeave: (id: string, updatedData: Partial<Leaves>) => void;
  deleteLeave: (id: string) => void;
  resetLeaves: () => void;
  setLeaves: React.Dispatch<React.SetStateAction<Leaves[]>>;
}