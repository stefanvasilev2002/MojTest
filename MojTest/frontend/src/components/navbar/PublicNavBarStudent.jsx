import React from 'react';
import NavBar from './NavBar.jsx';

const PublicNavBarStudent = () => {
    const links = [
        { label: 'nav.home', path: '/' },
        { label: 'nav.forTeachers', path: '/about-teacher' },
    ];

    return <NavBar links={links} />;
};

export default PublicNavBarStudent;
