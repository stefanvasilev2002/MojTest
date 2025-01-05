// src/components/CrudNavBar.jsx
import React from "react";
import NavBar from "../NavBar.jsx";

const CrudNavBar = () => {
    const links = [
        { label: 'nav.metadata', path: '/crud/metadata' },
        { label: 'nav.answer', path: '/crud/answer' },
        { label: 'nav.test', path: '/crud/test' },
        { label: 'nav.question', path: '/crud/question' },
        { label: 'nav.studentAnswer', path: '/crud/student-answer' },
        { label: 'nav.studentTest', path: '/crud/student-test' },
        { label: 'nav.testQuestion', path: '/crud/test-question' },
        { label: 'nav.user', path: '/crud/user' }
    ];

    return <NavBar links={links} />;
};

export default CrudNavBar;
