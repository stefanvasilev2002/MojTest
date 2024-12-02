import React from "react";
import { useNavigate } from "react-router-dom";

// icons import:
import { HiOutlineDocumentText } from "react-icons/hi"; // Metadata
import { MdQuestionAnswer } from "react-icons/md"; // Answer
import { BiTestTube } from "react-icons/bi"; // Test
import { RiQuestionnaireLine } from "react-icons/ri"; // Question
import { FaUserGraduate } from "react-icons/fa"; // StudentAnswer & StudentTest
import { IoMdLink } from "react-icons/io"; // TestQuestion
import { FiUser } from "react-icons/fi"; // User

const entities = [
    { name: "Metadata", route: "/crud/metadata", icon: HiOutlineDocumentText },
    { name: "Answer", route: "/crud/answer", icon: MdQuestionAnswer },
    { name: "Test", route: "/crud/test", icon: BiTestTube },
    { name: "Question", route: "/crud/question", icon: RiQuestionnaireLine },
    { name: "StudentAnswer", route: "/crud/student-answer", icon: FaUserGraduate },
    { name: "StudentTest", route: "/crud/student-test", icon: FaUserGraduate },
    { name: "TestQuestion", route: "/crud/test-question", icon: IoMdLink },
    { name: "User", route: "/crud/user", icon: FiUser },
];

const CrudHubPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center mb-8">CRUD Hub</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {entities.map((entity) => (
                    <div
                        key={entity.name}
                        onClick={() => navigate(entity.route)}
                        className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition-transform transform hover:scale-105"
                    >
                        <entity.icon className="text-4xl text-gray-600 mb-4" />
                        <div className="text-xl font-semibold">{entity.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CrudHubPage;
