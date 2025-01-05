import React from 'react';
import NavBar from './NavBar.jsx';

const PublicNavBarTeacher = () => {
    const links = [
        { label: 'nav.home', path: '/' },
        { label: 'nav.forStudents', path: '/about-student' },
    ];

    return <NavBar links={links} />;
};

export default PublicNavBarTeacher;
