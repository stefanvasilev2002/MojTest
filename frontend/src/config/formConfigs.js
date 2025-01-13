const formConfigs = {
    Answer: {
        fields: [
            { name: "answerText", label: "Answer Text", type: "text" },
            { name: "isCorrect", label: "Is Correct", type: "checkbox" },
            {
                name: "question",
                label: "Question",
                type: "select",
                relation: "Question",
            },
        ],
    },
    Metadata: {
        fields: [
            { name: "key", label: "Key", type: "select", relation: "Key" },
            { name: "value", label: "Value", type: "select", relation: "Value" },
            {
                name: "questions",
                label: "Questions",
                type: "multi-select",
                relation: "Question",
            },
            {
                name: "tests",
                label: "Tests",
                type: "multi-select",
                relation: "Test",
            },
        ],
    },

    Question: {
        fields: [
            {
                name: "type",
                label: "question.type",
                type: "select",
                relation: "Type",
            },
            { name: "description", label: "question.description", type: "textarea" },
            { name: "points", label: "question.points", type: "number" },
            { name: "negativePointsPerAnswer", label: "question.negativePoints", type: "number" },
            { name: "formula", label: "question.formula", type: "text" },
            { name: "image", label: "question.imageUrl", type: "image" },
            { name: "hint", label: "question.hint", type: "textarea" },
            {
                name: "testIds",
                label: "question.tests",
                type: "multi-select",
                relation: "Test",
            },
            {
                name: "metadataIds",
                label: "question.metadata",
                type: "multi-select",
                relation: "Metadata",
            },
            {
                name: "answerIds",
                label: "question.answers",
                type: "multi-select",
                relation: "Answer",
            },
            {
                name: "creatorId",
                label: "question.creator",
                type: "select",
                relation: "Teacher",
            },
        ],
    },

    StudentAnswer: {
        fields: [
            { name: "submittedValue", label: "Submitted Value", type: "text" },
            {
                name: "studentTest",
                label: "Student Test",
                type: "select",
                relation: "StudentTest",
            },
            {
                name: "testQuestion",
                label: "Test Question",
                type: "select",
                relation: "TestQuestion",
            },
            {
                name: "chosenAnswer",
                label: "Chosen Answer",
                type: "select",
                relation: "Answer",
            },
        ],
    },
    StudentTest: {
        fields: [
            { name: "score", label: "Score", type: "number" },
            { name: "dateTaken", label: "Date Taken", type: "date" },
            { name: "timeTaken", label: "Time Taken", type: "time" },
            {
                name: "student",
                label: "Student",
                type: "select",
                relation: "Student",
            },
            {
                name: "test",
                label: "Test",
                type: "select",
                relation: "Test",
            },
        ],
    },
    Test: {
        fields: [
            { name: "title", label: "Title", type: "text" },
            { name: "description", label: "Description", type: "textarea" },
            { name: "numQuestions", label: "Number of Questions", type: "number" },
            {
                name: "questionBank",
                label: "Question Bank",
                type: "multi-select",
                relation: "Question"
            },
            {
                name: "creator",
                label: "Creator",
                type: "select",
                relation: "Teacher"
            },
            {
                name: "metadata",
                label: "Metadata",
                type: "multi-select",
                relation: "Metadata"
            },
            {
                name: "testQuestionIds",
                label: "Test Question IDs",
                type: "multi-select",
                relation: "TestQuestion"
            },
            {
                name: "studentTestIds",
                label: "Student Test IDs",
                type: "multi-select",
                relation: "StudentTest"
            }
        ]
    },

    TestQuestion: {
        fields: [
            {
                name: "test",
                label: "Test",
                type: "select",
                relation: "Test",
            },
            {
                name: "question",
                label: "Question",
                type: "select",
                relation: "Question",
            },
        ],
    },
    User: {
        fields: [
            { name: "username", label: "Username", type: "text" },
            { name: "password", label: "Password", type: "password" },
            { name: "email", label: "Email", type: "email" },
            { name: "fullName", label: "Full Name", type: "text" },
        ],
    },
    Student: {
        extends: "User",
        fields: [
            { name: "grade", label: "Grade", type: "text" },
        ],
    },
    Teacher: {
        extends: "User",
        fields: [],
    },
    Admin: {
        extends: "User",
        fields: [],
    },
};

export default formConfigs;
