import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineLead,
    deleteOfflineLead,
    getOfflineLeadStats,
    getOfflineLeads,
    getOfflineLeadsBySource,
    updateOfflineLead,
} from "../offline/offlineLocal";


export const getLeads = async () => {
  try {
    if (IS_OFFLINE_LOCAL_MODE) {
      return await getOfflineLeads();
    }

    const session = JSON.parse(sessionStorage.getItem("userSession"));
    const profileId = session?.profileId;

    const response = await apiRequest({
      path: `/leads/getallleads`,
      params: profileId ? { profileId } : undefined,
    });

    return response.data;

  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const getLeadsBySource = async () => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineLeadStats();
        }
        const response = await apiRequest({ path: "/leads/stats" })
        return response.data
    } catch (error) {
        console.error("Error fetching leads by source:", error)
        throw error
    }
}

export const getAllStatusFlowLeads = async (profileId) => {
  try {
    if (IS_OFFLINE_LOCAL_MODE) {
      return await getOfflineLeads(profileId);
    }
    const response = await apiRequest({
      path: `/leads/getallleads`,
      params: profileId ? { profileId } : undefined,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching leads by source:", error);
    throw error;
  }
};
export const postAllStatusFlowLeads = async (data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineLead(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/leads/create",
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error posting leads by source:", error)
        throw error
    }
}

export const putAllStatusFlowLeads = async (id, data) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await updateOfflineLead(id, data);
        }
        const response = await apiRequest({
            method: "PUT",
            path: `/leads/update/${id}`,
            data,
        })
        return response.data
    } catch (error) {
        console.error("Error putting leads by source:", error)
        throw error
    }
}

export const deleteStatusFlowLeads = async (id) => {
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineLead(id);
        }
        const response = await apiRequest({
            method: "DELETE",
            path: `/leads/${id}`,
        })
        return response.data
    } catch (error) {
        console.error("Error deleting leads by source:", error)
        throw error
    }
}
