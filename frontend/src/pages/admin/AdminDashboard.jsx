import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Users,
    GraduationCap,
    UserCog,
    FileText,
    Settings,
    Database,
    ClipboardList,
    BookOpen,
    BarChart2,
    Search
} from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('common');
    const [searchTerm, setSearchTerm] = useState('');

    const adminModules = [
        {
            id: 'users',
            title: t('adminDashboard.modules.users'),
            description: t('adminDashboard.descriptions.users'),
            icon: Users,
            route: '/admin/users',
            color: 'bg-blue-500'
        },
        {
            id: 'teachers',
            title: t('adminDashboard.modules.teachers'),
            description: t('adminDashboard.descriptions.teachers'),
            icon: GraduationCap,
            route: '/admin/users/teachers',
            color: 'bg-green-500'
        },
        {
            id: 'students',
            title: t('adminDashboard.modules.students'),
            description: t('adminDashboard.descriptions.students'),
            icon: UserCog,
            route: '/admin/users/students',
            color: 'bg-purple-500'
        },
        {
            id: 'tests',
            title: t('adminDashboard.modules.tests'),
            description: t('adminDashboard.descriptions.tests'),
            icon: FileText,
            route: '/admin/tests',
            color: 'bg-yellow-500'
        },
        // {
        //     id: 'metadata',
        //     title: t('adminDashboard.modules.metadata'),
        //     description: t('adminDashboard.descriptions.metadata'),
        //     icon: Database,
        //     route: '/admin/metadata',
        //     color: 'bg-red-500'
        // },
        {
            id: 'questions',
            title: t('adminDashboard.modules.questions'),
            description: t('adminDashboard.descriptions.questions'),
            icon: ClipboardList,
            route: '/admin/questions',
            color: 'bg-indigo-500'
        },
        {
            id: 'analytics',
            title: t('adminDashboard.modules.analytics'),
            description: t('adminDashboard.descriptions.analytics'),
            icon: BarChart2,
            route: '/admin/analytics',
            color: 'bg-orange-500'
        },
        {
            id: 'settings',
            title: t('adminDashboard.modules.settings'),
            description: t('adminDashboard.descriptions.settings'),
            icon: Settings,
            route: '/admin/settings',
            color: 'bg-gray-500'
        }
    ];

    const filteredModules = adminModules.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                        {t('adminDashboard.title')}
                    </h1>
                    <div className="w-full md:w-64 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={t('adminDashboard.searchPlaceholder')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredModules.map((module) => {
                        const IconComponent = module.icon;
                        return (
                            <div
                                key={module.id}
                                onClick={() => {
                                    console.log(`Navigating to: ${module.route}`);
                                    navigate(module.route);
                                }}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className={`${module.color} p-3 rounded-lg`}>
                                            <IconComponent className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {module.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600">
                                        {module.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredModules.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">
                            {t('adminDashboard.noResults')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;