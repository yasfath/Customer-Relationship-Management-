import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    FaBell,
    FaTrashAlt,
    FaArrowLeft,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { GetNotificationsService, MarkNotificationAsReadService, DeleteNotificationService, ClearAllNotificationsService } from '../services/Notifications.services';

const Notifications = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNotif, setSelectedNotif] = useState(null);


    const [getNotifications, setGetNotifications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Confirmation Modal States
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
    const [notifToDelete, setNotifToDelete] = useState(null);


    const fetchNotifications = async () => {
        try {
            const response = await GetNotificationsService();
            setGetNotifications(response);
            console.log(response, "Get all notifications data ");
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchNotifications();
    }, []);



    const handleNotificationClick = async (notif) => {
        // Optimistic UI update
        setGetNotifications(prev =>
            prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
        );
        setSelectedNotif(notif);
        setIsModalOpen(true);

        // API call to persist read status
        try {
            await MarkNotificationAsReadService(notif.id);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            // Optionally revert UI state if the API fails
        }
    };

    const handleDelete = (e, id) => {
        if (e) e.stopPropagation();
        setNotifToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await DeleteNotificationService(notifToDelete);
            setGetNotifications(prev => prev.filter(n => n.id !== notifToDelete));
            toast.success("Notification deleted successfully");
        } catch (error) {
            console.error("Failed to delete notification:", error);
            toast.error("Failed to delete notification");
        } finally {
            setIsDeleteConfirmOpen(false);
            setNotifToDelete(null);
        }
    };

    const handleClearAll = () => {
        setIsClearAllConfirmOpen(true);
    };

    const confirmClearAll = async () => {
        try {
            await ClearAllNotificationsService();
            setGetNotifications([]);
            toast.success("All notifications cleared");
        } catch (error) {
            console.error("Failed to clear all notifications:", error);
            toast.error("Failed to clear all notifications");
        } finally {
            setIsClearAllConfirmOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/30 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2.5 hover:bg-white rounded-full shadow-sm transition-all text-slate-600 hover:text-[#6d68b0] border border-transparent hover:border-slate-100"
                        >
                            <FaArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Notifications</h1>
                            <p className="text-slate-500 text-sm mt-1">Stay updated with your latest activities</p>
                        </div>
                    </div>
                    {getNotifications.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-100"
                        >
                            <FaTrashAlt className="h-4 w-4" />
                            <span className="hidden sm:inline">Clear all</span>
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {getNotifications.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((notif) => {
                        return (
                            <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`group flex gap-4 p-4 sm:p-5 rounded-2xl border transition-all hover:shadow-md hover:border-[#6d68b0]/20 cursor-pointer 
                                    ${notif.read
                                        ? 'bg-slate-100/50 border-slate-200 opacity-80'
                                        : 'bg-white border-white shadow-sm ring-1 ring-[#6d68b0]/5'
                                    }`}>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <h3 className={`font-semibold truncate ${notif.read ? 'text-slate-600' : 'text-[#6d68b0]'}`}>
                                                {notif.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium text-slate-400 whitespace-nowrap ml-4">
                                                {notif.time}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed line-clamp-2 ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>
                                        {notif.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {getNotifications.length > pageSize && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                        <span className="text-sm text-slate-400 font-medium">
                            Showing {Math.min(currentPage * pageSize, getNotifications.length)} of {getNotifications.length} notifications
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="h-9 px-4 rounded-xl border border-[#e2e8f0] text-slate-400 font-semibold text-xs disabled:opacity-50 hover:border-[#6d68b0] hover:text-[#6d68b0] transition-colors bg-white cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                disabled={currentPage >= Math.ceil(getNotifications.length / pageSize)}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="h-9 px-4 rounded-xl border border-[#6d68b0] text-[#6d68b0] font-semibold text-xs hover:bg-[#6d68b0]/5 disabled:opacity-50 transition-colors bg-white cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {getNotifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="p-8 rounded-full bg-white shadow-sm mb-6">
                            <FaBell className="h-12 w-12 text-slate-200" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-700">All caught up!</h2>
                        <p className="text-slate-500 mt-2">No new notifications at the moment.</p>
                    </div>
                )}
            </div>

            {/* Notification Detail Modal */}
            <Modal
                title={
                    <div className="flex items-center gap-3 py-1">
                        <span className="text-lg font-bold text-slate-800">
                            {selectedNotif?.title}
                        </span>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                    <Button
                        key="close"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-lg border-slate-200 text-slate-600 hover:text-[#6d68b0] hover:border-[#6d68b0]"
                    >
                        Close
                    </Button>,
                    <Button
                        key="delete"
                        danger
                        type="text"
                        icon={<FaTrashAlt className="h-3.5 w-3.5" />}
                        onClick={() => {
                            setIsModalOpen(false);
                            handleDelete(null, selectedNotif.id);
                        }}
                        className="rounded-lg"
                    >
                        Delete Notification
                    </Button>
                ]}
                centered
                width={500}
                className="notification-modal"
            >
                <div className="py-4">
                    <p className="text-xs font-semibold text-[#6d68b0] uppercase tracking-wider mb-2">
                        {selectedNotif?.time}
                    </p>
                    <p className="text-slate-600 text-base leading-relaxed">
                        {selectedNotif?.message}
                    </p>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Notification"
                open={isDeleteConfirmOpen}
                onOk={confirmDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true, className: "rounded-lg" }}
                cancelButtonProps={{ className: "rounded-lg" }}
                centered
            >
                <p>Are you sure you want to delete this notification?</p>
            </Modal>

            {/* Clear All Confirmation Modal */}
            <Modal
                title="Clear All Notifications"
                open={isClearAllConfirmOpen}
                onOk={confirmClearAll}
                onCancel={() => setIsClearAllConfirmOpen(false)}
                okText="Clear All"
                cancelText="Cancel"
                okButtonProps={{ danger: true, className: "rounded-lg" }}
                cancelButtonProps={{ className: "rounded-lg" }}
                centered
            >
                <p>Are you sure you want to clear all notifications? This action cannot be undone.</p>
            </Modal>
        </div>
    );
};

export default Notifications;
