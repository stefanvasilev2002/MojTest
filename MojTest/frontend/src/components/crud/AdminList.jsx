import React from "react";
import { useNavigate } from "react-router-dom";
import useAdmin from "../../hooks/crud/useAdmin.js";
import Alert from "../Alert.jsx";
import CrudActionTable from "../CrudActionTable.jsx";
import { useTranslation } from "react-i18next";

const AdminList = () => {
    const { items: adminsList, loading, error, remove } = useAdmin();
    const navigate = useNavigate();
    const { t } = useTranslation("common");

    const handleDelete = async (id) => {
        if (window.confirm(t("adminList.deleteConfirmation"))) {
            await remove(id);
        }
    };

    if (loading) {
        return (
            <div>
                <h1>{t("adminList.title")}</h1>
                <p>{t("adminList.loading")}</p>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="mb-4">
                    <Alert message={t("adminList.errorMessage")} type="error" />
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-4">{t("adminList.title")}</h1>
            <button
                onClick={() => navigate("/crud/users/admin/new")}
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
                {t("adminList.addAdmin")}
            </button>
            {adminsList.length === 0 ? (
                <p>{t("adminList.noAdminsFound")}</p>
            ) : (
                <CrudActionTable
                    headers={[t("adminList.id"), t("adminList.username"), t("adminList.email"), t("adminList.fullName")]}
                    rows={adminsList.map((admin) => [
                        admin.id,
                        admin.username,
                        admin.email,
                        admin.fullName,
                    ])}
                    onEdit={(id) => navigate(`/crud/users/admin/edit/${id}`)}
                    onDelete={(id) => handleDelete(id)}
                />
            )}
        </div>
    );
};

export default AdminList;
