import ProfilePicture from "../assets/user.png";

export interface Appointment {
    id: number;
    patient: {
        name: string;
        img: string;
        phoneNumber: string;
    };
    dateAndTime: string;
    mode: string;
    status: string;
    consultationFees: number;
    reason?: string;
}

export const Appointments = [
    {
        "id": 1,
        "patient": {
            "name": "John Doe",
            "img": ProfilePicture,
            "phoneNumber": "+1234567890",
        },
        "dateAndTime": "27 May 2023, 10:00 AM",
        "mode": "In-person",
        "status": "Checked Out",
        "consultationFees": 400
    },
    {
        "id": 2,
        "patient": {
            "name": "Jane Smith",
            "img": ProfilePicture,
            "phoneNumber": "+1234567891",
        },
        "dateAndTime": "27 May 2023, 11:00 AM",
        "mode": "Online",
        "status": "Checked In",
        "consultationFees": 300
    },
    {
        "id": 3,
        "patient": {
            "name": "Alice Johnson",
            "img": ProfilePicture,
            "phoneNumber": "+1234567892",
        },
        "dateAndTime": "27 May 2023, 12:00 PM",
        "mode": "In-person",
        "status": "Scheduled",
        "consultationFees": 500
    }
]