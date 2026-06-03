import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineContact,
    deleteOfflineContact,
    getOfflineContactStats,
    getOfflineContacts,
    getOfflineStaff,
    updateOfflineContact,
} from "../offline/offlineLocal";


export const getAssignedStaff = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineStaff();
        }
        const response = await apiRequest({ path: "/staff/alllist" })
        return response.data
    } catch (error) {
        console.error("Error fetching staff:", error)
        throw error
    }
}



export const getStats = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineContactStats();
        }
        const response = await apiRequest({ path: "/contacts/stats" })
        return response.data
    } catch (error) {
        console.error("Error fetching contacts:", error)
        throw error
    }
}


export const getContacts = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineContacts();
        }
        const response = await apiRequest({ path: "/contacts/getall" })
        return response.data
    } catch (error) {
        console.error("Error fetching contacts:", error)
        throw error
    }
}


export const postContacts = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineContact(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/contacts/create",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting contacts:", error)
        throw error
    }
}


export const putContacts = async (id, data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await updateOfflineContact(id, data);
        }
        const response = await apiRequest({
            method: "PUT",
            path: `/contacts/${id}`,
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error putting contacts:", error)
        throw error
    }
}


export const deleteContacts = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineContact(id);
        }
        const response = await apiRequest({
            method: "DELETE",
            path: `/contacts/${id}`,
        })
        return response.data
    } catch (error) {
        console.error("Error deleting contacts:", error)
        throw error
    }
}
