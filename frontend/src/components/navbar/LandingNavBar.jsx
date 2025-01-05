import React from 'react';
import NavBar from './NavBar.jsx';

const LandingNavBar = () => {
    const links = [
        { label: 'nav.forTeachers', path: '/about-teacher' },
        { label: 'nav.forStudents', path: '/about-student' },
    ];

    return <NavBar links={links} />;
};

export default LandingNavBar;
