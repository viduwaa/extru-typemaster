import React, { useEffect, useState } from "react";
import { CircleX } from "lucide-react";
import { bigEars } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

interface PopupFormProps {
    onSubmit: (
        playerName: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
			selectedAvatar: string;
        },
    ) => void;
    onClose: () => void;
    buttonText: string;
}

const PopupForm: React.FC<PopupFormProps> = ({
    onSubmit,
    onClose,
    buttonText,
}) => {
    const [playerName, setPlayerName] = useState("");
    const [university, setUniversity] = useState("");
    const [role, setRole] = useState("");
    const [isSchoolStudent, setIsSchoolStudent] = useState(false);
    const [warning, setWarning] = useState(false);
    const [vibrating, setVibrating] = useState(false);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<string>("");

    useEffect(() => {
        // Generate 6 random avatars
        const newAvatars = Array.from({ length: 6 }, () =>
            createAvatar(bigEars, {
                seed: Math.random().toString(),
            }).toDataUri(),
        );
        setAvatars(newAvatars);
        setSelectedAvatar(newAvatars[0]);
    }, []);

    const handleSubmit = () => {
        if (playerName) {
            onSubmit(playerName, { university, role, isSchoolStudent , selectedAvatar });
        } else {
            setWarning(true);
            setVibrating(true);
            setTimeout(() => setVibrating(false), 300);
        }
    };

    return (
        <div className="absolute left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 transform  rounded-lg bg-white p-6 shadow-md">
            <div className="border-r-2 p-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Choose your avatar:
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {avatars.map((avatar, index) => (
                        <img
                            key={index}
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className={`h-20 w-20 cursor-pointer rounded-full ${selectedAvatar === avatar ? "ring-2 ring-blue-500" : ""}`}
                            onClick={() => setSelectedAvatar(avatar)}
                        />
                    ))}
                </div>
            </div>
            <div className="pl-2">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                        <option value="">Select university (optional)</option>
                        <option value="RUSL">
                            Rajarata University of Sri Lanka
                        </option>
                        <option value="UoC">University of Colombo</option>
                        <option value="UoP">University of Peradeniya</option>
                        <option value="UoK">University of Kelaniya</option>
                        <option value="UoJ">University of Jaffna</option>
                        <option value="USJP">
                            University of Sri Jayewardenepura
                        </option>
                        <option value="UoM">University of Moratuwa</option>
                        <option value="OUSL">
                            The Open University of Sri Lanka
                        </option>
                        <option value="EUSL">
                            Eastern University of Sri Lanka
                        </option>
                        <option value="SUSL">
                            Sabaragamuwa University of Sri Lanka
                        </option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="mb-4">
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    >
                        <option value="">Select role (optional)</option>
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="lecturer">Lecturer</option>
                    </select>
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="isSchoolStudent"
                        checked={isSchoolStudent}
                        onChange={(e) => setIsSchoolStudent(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="isSchoolStudent">
                        I am a school student
                    </label>
                </div>
                {warning && (
                    <div className="mb-4 flex justify-center">
                        <h3
                            className={`text-red-500 ${vibrating ? "vibrate" : ""}`}
                        >
                            Please Enter Your Name to Continue
                        </h3>
                    </div>
                )}
                <button
                    onClick={handleSubmit}
                    className="m-auto block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                >
                    {buttonText}
                </button>
                <CircleX
                    className="absolute right-[-6px] top-[-12px] cursor-pointer rounded-full bg-white hover:bg-red-500 hover:text-white"
                    size={28}
                    strokeWidth={1.25}
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

export default PopupForm;
