import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineDeal,
    deleteOfflineDeal,
    getOfflineDeals,
    updateOfflineDeal,
} from "../offline/offlineLocal";


export const getDeals = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineDeals();
        }
        const response = await apiRequest({ path: "/deals/getalldeals" })
        return response.data
    } catch (error) {
        console.error("Error fetching deals:", error)
        throw error
    }
}


export const postDeals = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineDeal(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/deals/create",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting deals:", error)
        throw error
    }
}


export const putDeals = async (id,data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await updateOfflineDeal(id, data);
        }
        const response = await apiRequest({
            method: "PUT",
            path: `/deals/${id}`,
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error putting deals:", error)
        throw error
    }
}


export const deleteDeals = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineDeal(id);
        }
        const response = await apiRequest({
            method: "DELETE",
            path: `/deals/${id}`,
        })
        return response.data
    } catch (error) {
        console.error("Error deleting deals:", error)
        throw error
    }
}
