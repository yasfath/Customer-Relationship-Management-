import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineEvent,
    deleteOfflineEvent,
    getOfflineEvents,
    updateOfflineEvent,
} from "../offline/offlineLocal";


export const getEvents = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineEvents();
        }
        const response = await apiRequest({ path: "/events/getallevents" })
        return response.data
    } catch (error) {
        console.error("Error fetching events:", error)
        throw error
    }
}


export const postEvents = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineEvent(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/events/create",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting events:", error)
        throw error
    }
}


export const putEvents = async (id, data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await updateOfflineEvent(id, data);
        }
        const response = await apiRequest({
            method: "PUT",
            path: `/events/${id}`,
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error putting events:", error)
        throw error
    }
}


export const deleteEvents = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineEvent(id);
        }
        const response = await apiRequest({
            method: "DELETE",
            path: `/events/${id}`,
        })
        return response.data
    } catch (error) {
        console.error("Error deleting events:", error)
        throw error
    }
}
