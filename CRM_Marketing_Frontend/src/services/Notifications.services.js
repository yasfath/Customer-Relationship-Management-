import apiInterceptor from "../interceptors/interceptors";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    clearOfflineNotifications,
    deleteOfflineNotification,
    getOfflineNotifications,
    markOfflineNotificationAsRead,
} from "../offline/offlineLocal";


export const GetNotificationsService = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineNotifications();
        }
        const response = await apiInterceptor.get("/notifications/getall");
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const DeleteNotificationService = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineNotification(id);
        }
        const response = await apiInterceptor.delete(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const ClearAllNotificationsService = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await clearOfflineNotifications();
        }
        const response = await apiInterceptor.delete("/notifications/clear");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const MarkNotificationAsReadService = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await markOfflineNotificationAsRead(id);
        }
        const response = await apiInterceptor.put(`/notifications/read/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
