import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineEmailResponse,
    getOfflineEmailResponses,
} from "../offline/offlineLocal";


export const getEmailResponse = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineEmailResponses();
        }
        const response = await apiRequest({ path: "/logs/dashboard" })
        return response.data
    } catch (error) {
        console.error("Error fetching email response:", error)
        throw error
    }
}

export const postEmailResponse = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineEmailResponse(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/logs/activity",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting email response:", error.response.data.message)
        throw error
    }
}
