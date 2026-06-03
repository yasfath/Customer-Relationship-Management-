import apiInterceptor from "../interceptors/interceptors"
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    getOfflineProfileStats,
    offlineUpdateProfile,
} from "../offline/offlineLocal";


export const profileUpdate = async (id, data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await offlineUpdateProfile(id, data);
        }
        const response = await apiInterceptor.put(`/profile/update/${id}`, data)
        return response.data
    } catch (error) {
        console.error("Error updating profile:", error)
        throw error
    }
}


export const getProfileByEmail = async (email) => {
  const response = await apiInterceptor.get(`/profile/email/${email}`);
  return response.data;
};

export const getProfileStats = async () =>{
    if (IS_OFFLINE_LOCAL_MODE) {
        return await getOfflineProfileStats();
    }
    const response = await apiInterceptor.get(`/profile/stats`);
    return response.data;
}
