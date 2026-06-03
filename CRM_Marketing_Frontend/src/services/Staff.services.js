import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineStaff,
    deleteOfflineStaff,
    getOfflineStaff,
    updateOfflineStaff,
} from "../offline/offlineLocal";


export const getStaff = async () => {
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

export const postStaff = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineStaff(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/staff/create",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting staff:", error)
        throw error
    }
}

export const putStaff = async (id, data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await updateOfflineStaff(id, data);
        }
        const response = await apiRequest({
            method: "PUT",
            path: `/staff/${id}`,
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error putting staff:", error)
        throw error
    }
}

export const deleteStaff = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineStaff(id);
        }
        const response = await apiRequest({
            method: "DELETE",
            path: `/staff/${id}`,
        })
        return response.data
    } catch (error) {
        console.error("Error deleting staff:", error)
        throw error
    }
}
