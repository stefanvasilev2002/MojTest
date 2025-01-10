// Import and update TestExport.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Loader } from 'lucide-react';
import {endpoints} from "../../config/api.config.jsx";

const TestExport = ({ testId, testTitle }) => {
    const { t } = useTranslation('common');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleExport = async (format) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(endpoints.export.test(testId, format), {
                method: 'GET',
                headers: {
                    'Accept': format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                }
            });

            if (!response.ok) {
                throw new Error(t('export.errorMessage'));
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${testTitle.replace(/\s+/g, '_')}_${format}.${format}`;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => handleExport('pdf')}
                disabled={loading}
                className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
                {loading ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <FileText className="h-4 w-4 mr-2" />
                )}
                <span className="whitespace-nowrap">{t('export.pdf')}</span>
            </button>
            <button
                onClick={() => handleExport('docx')}
                disabled={loading}
                className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
                {loading ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                    <FileText className="h-4 w-4 mr-2" />
                )}
                <span className="whitespace-nowrap">{t('export.word')}</span>
            </button>

            {error && (
                <div className="w-full sm:w-auto mt-2 p-2 bg-red-100 text-red-600 rounded text-sm">
                    {error}
                </div>
            )}
        </>
    );
};

export default TestExport;