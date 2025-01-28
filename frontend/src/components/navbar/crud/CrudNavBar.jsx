import React from "react";
import NavBar from "../NavBar.jsx";

const AdminNavBar = () => {
    const links = [
        {
            label: 'nav.users.dropdown',
            dropdown: true,
            items: [
                { label: 'nav.users.all', path: '/admin/users' },
                { label: 'nav.users.teachers', path: '/admin/users/teachers' },
                { label: 'nav.users.students', path: '/admin/users/students' },
                { label: 'nav.users.admins', path: '/admin/users/admins' },
            ]
        },
        {
            label: 'nav.tests.dropdown',
            dropdown: true,
            items: [
                { label: 'nav.tests.all', path: '/admin/tests' },
                { label: 'nav.tests.questions', path: '/admin/questions' },
                { label: 'nav.tests.responses', path: '/admin/answers' },
            ]
        },
        {
            label: 'nav.system.dropdown',
            dropdown: true,
            items: [
                // { label: 'nav.system.metadata', path: '/admin/metadata' },
                { label: 'nav.system.settings', path: '/admin/settings' },
            ]
        },
    ];

    return <NavBar links={links} />;
};

export default AdminNavBar;