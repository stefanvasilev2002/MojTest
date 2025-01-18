import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { BookOpen, Users, Award, Clock, Loader } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

const AnalyticsDashboard = () => {
    const { t } = useTranslation('common');
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for different analytics data
    const [overviewData, setOverviewData] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState(null);
    const [testStats, setTestStats] = useState(null);
    const [questionStats, setQuestionStats] = useState(null);
    const [teacherStats, setTeacherStats] = useState(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                const [overview, studentPerf, testSt, questionSt, teacherSt] = await Promise.all([
                    analyticsService.getOverview(),
                    analyticsService.getStudentPerformance(),
                    analyticsService.getTestStatistics(),
                    analyticsService.getQuestionAnalytics(),
                    analyticsService.getTeacherStatistics()
                ]);

                setOverviewData(overview);
                setStudentPerformance(studentPerf);
                setTestStats(testSt);
                setQuestionStats(questionSt);
                setTeacherStats(teacherSt);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Error loading analytics: {error}</div>
            </div>
        );
    }

    const statsCards = [
        {
            title: t('analytics.totalTests'),
            value: overviewData?.totalTests || 0,
            icon: BookOpen,
            change: overviewData?.testChange || '0%',
            trend: overviewData?.testTrend || 'neutral'
        },
        {
            title: t('analytics.activeStudents'),
            value: overviewData?.activeStudents || 0,
            icon: Users,
            change: overviewData?.studentChange || '0%',
            trend: overviewData?.studentTrend || 'neutral'
        },
        {
            title: t('analytics.avgScore'),
            value: `${overviewData?.averageScore || 0}%`,
            icon: Award,
            change: overviewData?.scoreChange || '0%',
            trend: overviewData?.scoreTrend || 'neutral'
        },
        {
            title: t('analytics.avgCompletionTime'),
            value: `${overviewData?.avgCompletionTime || 0}m`,
            icon: Clock,
            change: overviewData?.timeChange || '0%',
            trend: overviewData?.timeTrend || 'neutral'
        }
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="min-h-screen bg-gray-50 p-6 mt-20">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    {t('analytics.title')}
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((card, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        {card.title}
                                    </p>
                                    <h3 className="text-2xl font-bold mt-2">
                                        {card.value}
                                    </h3>
                                    <span className={`text-sm ${
                                        card.trend === 'up' ? 'text-green-500' :
                                            card.trend === 'down' ? 'text-red-500' :
                                                'text-gray-500'
                                    }`}>
                                        {card.change}
                                    </span>
                                </div>
                                <card.icon className="w-12 h-12 text-gray-400" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8" aria-label="Tabs">
                            {['overview', 'students', 'tests', 'questions'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${
                                        activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                                >
                                    {t(`analytics.tabs.${tab}`)}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Contents */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Test Performance Trend */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.testPerformance')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={testStats?.performanceTrend || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="avgScore"
                                            stroke="#8884d8"
                                            name={t('analytics.metrics.avgScore')}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="totalTests"
                                            stroke="#82ca9d"
                                            name={t('analytics.metrics.totalTests')}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Question Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.questionTypes')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={questionStats?.typeDistribution || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="type"
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {(questionStats?.typeDistribution || []).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="grid grid-cols-1 gap-6">
                        {/* Student Performance Over Time */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.studentProgress')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={studentPerformance?.progressData || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Area
                                            type="monotone"
                                            dataKey="averageScore"
                                            fill="#8884d8"
                                            stroke="#8884d8"
                                            name={t('analytics.metrics.avgScore')}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Student Activity Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.studentActivity')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={studentPerformance?.activityData || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="timeSlot" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="activeUsers"
                                            fill="#82ca9d"
                                            name={t('analytics.metrics.activeUsers')}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div className="grid grid-cols-1 gap-6">
                        {/* Test Completion Rates */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.testCompletion')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={testStats?.completionRates || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="testName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="completionRate"
                                            fill="#8884d8"
                                            name={t('analytics.metrics.completionRate')}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Average Time per Test */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.testTime')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={testStats?.averageTimePerTest || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="testName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="averageTime"
                                            fill="#82ca9d"
                                            name={t('analytics.metrics.avgTime')}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'questions' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Question Difficulty Distribution */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.questionDifficulty')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={questionStats?.difficultyDistribution || []}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                            nameKey="difficulty"
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {(questionStats?.difficultyDistribution || []).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Most Used Questions */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.mostUsedQuestions')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={questionStats?.mostUsedQuestions || []}
                                              layout="vertical"
                                              margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="questionTitle" />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="useCount"
                                            fill="#8884d8"
                                            name={t('analytics.metrics.timesUsed')}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Question Success Rate */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                {t('analytics.charts.questionSuccessRate')}
                            </h3>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={questionStats?.successRates || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="questionId" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="successRate"
                                            fill="#82ca9d"
                                            name={t('analytics.metrics.successRate')}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;