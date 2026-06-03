import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineActivity,
    getOfflineActivities,
    getOfflineActivitiesByRelatedId,
    getOfflineActivityPercentage,
} from "../offline/offlineLocal";

export const getLogNewActivity = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineActivitiesByRelatedId(id);
        }
        const response = await apiRequest({ path: `/related/${id}` })
        return response.data
    } catch (error) {
        console.error("Error fetching activities:", error)
        throw error
    }
}


export const getActivityPercentage = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineActivityPercentage();
        }
        const response = await apiRequest({ path: "/activities/percentage" })
        return response.data
    } catch (error) {
        console.error("Error fetching activities:", error)
        throw error
    }
}



export const getAllactivities = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineActivities();
        }
        const response = await apiRequest({ path: "/activities/timeline" })
        return response.data
    } catch (error) {
        console.error("Error fetching activities:", error)
        throw error
    }
}


export const postAllactivities = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineActivity(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/activities/logactivity",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting activities:", error)
        throw error
    }
}







    //   no api for this 



// export const putAllactivities = async (id,data) => {
//     try {
//         const response = await apiInterceptor.put(`/activities/update/${id}`,data)
//         return response.data
//     } catch (error) {
//         console.error("Error putting activities:", error)
//         throw error
//     }
// }

// export const deleteActivity = async (id) => {
//     try {
//         const response = await apiInterceptor.delete(`/activities/delete/${id}`)
//         return response.data
//     } catch (error) {
//         console.error("Error deleting activity:", error)
//         throw error
//     }
// }

