export interface Patient {
    id: string;
    profileImg: string;
    firstName: string;
    lastName: string;
    phoneNumber: number;
    email: string;
    birthDate: string;
    gender: string;
    bloodgroup: string;
    country: string;
    state: string;
    city: string;
    address: string;
    zipCode: string;
}

export const patients: Patient[] = [
    {
        id: "1",
        profileImg: "https://randomuser.me/api/portraits/men/1.jpg",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: 1234567890,
        email: "johndoe@example.com",
        birthDate: "1990-01-01",
        gender: "Male",
        bloodgroup: "O+",
        country: "USA",
        state: "California",
        city: "Los Angeles",
        address: "123 Main St",
        zipCode: "90001"
    },
    {
        id: "2",
        profileImg: "https://randomuser.me/api/portraits/men/2.jpg",
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: 9876543210,
        email: "janedoe@example.com",
        birthDate: "1992-02-02",
        gender: "Female",
        bloodgroup: "A+",
        country: "USA",
        state: "California",
        city: "Los Angeles",
        address: "456 Elm St",
        zipCode: "90002"
    }
]