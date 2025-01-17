import React from "react";
import NavBar from "../NavBar.jsx";

const AdminNavBar = () => {
    const links = [
        {
            label: 'nav.users',
            dropdown: true,
            items: [
                { label: 'nav.users.all', path: '/admin/user' },
                { label: 'nav.users.teachers', path: '/admin/users/teacher' },
                { label: 'nav.users.students', path: '/admin/users/student' },
                { label: 'nav.users.admins', path: '/admin/users/admin' },
            ]
        },
        {
            label: 'nav.tests',
            dropdown: true,
            items: [
                { label: 'nav.tests.all', path: '/admin/test' },
                { label: 'nav.tests.questions', path: '/admin/question' },
                { label: 'nav.tests.responses', path: '/admin/answer' },
            ]
        },
        {
            label: 'nav.system',
            dropdown: true,
            items: [
                { label: 'nav.system.metadata', path: '/admin/metadata' },
                { label: 'nav.system.settings', path: '/admin/settings' },
            ]
        },
    ];

    return <NavBar links={links} />;
};

export default AdminNavBar;