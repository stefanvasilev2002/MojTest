import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation('common');

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">
                            {t('footer.about.title')}
                        </h3>
                        <p className="text-gray-400">
                            {t('footer.about.description')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">
                            {t('footer.quickLinks.title')}
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/about-us" className="text-gray-400 hover:text-white transition-colors">
                                    {t('footer.quickLinks.about')}
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/stefanvasilev2002/MojTest"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {t('footer.quickLinks.sourceCode')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">
                            {t('footer.connect.title')}
                        </h3>
                        <p className="text-gray-400">
                            {t('footer.connect.questions')}<br />
                            <a href="mailto:platforma.moj.test@gmail.com" className="hover:text-white transition-colors">
                                {t('footer.connect.email')}
                            </a>
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} {t('footer.copyright.rights')}</p>
                    <p className="mt-2">
                        {t('footer.copyright.creators')}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;