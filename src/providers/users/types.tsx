export type IUsers = {
    id: string;
    profileImg: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string; 
    createdAt: string; 
    specialization: string;
};

export interface IUsersContext {
  users: IUsers[];
  setUsers: React.Dispatch<React.SetStateAction<IUsers[]>>;
  addUser: (entry: IUsers) => void;
  updateUser: (entry: IUsers) => void;
  deleteUser: (id: string) => void;
  resetUsers: () => void;
}


