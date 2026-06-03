import { apiRequest } from "./request";
import { IS_OFFLINE_LOCAL_MODE } from "../config/runtime";
import {
    createOfflineCampaign,
    deleteOfflineCampaign,
    getOfflineCampaignSummary,
    getOfflineCampaigns,
    getOfflineLeadsBySource,
    updateOfflineCampaign,
} from "../offline/offlineLocal";


export const getCampaignOverallViewData = async () => {

    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineCampaignSummary();
        }
        const response = await apiRequest({ path: "/campaigns/analytics/summary" });
        return response.data;
    }
    catch (error) {
        throw error;
    }
}


export const getLeadsBySource = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineLeadsBySource();
        }
        const response = await apiRequest({ path: "/analytics/leads-by-source" });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getAllcampaignsRoot = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await getOfflineCampaigns();
        }
        const response = await apiRequest({ path: "/campaigns/getallcampaigns" });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const postAllcampaignsRoot = async (data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await createOfflineCampaign(data);
        }
        const response = await apiRequest({
            method: "POST",
            path: "/campaigns/create",
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const putAllcampaignsRoot = async (id, data) => {
    // eslint-disable-next-line no-useless-catch
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await updateOfflineCampaign(id, data);
        }
        const response = await apiRequest({
            method: "PUT",
            path: `/campaigns/${id}`,
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const deleteCampaignsRoot = async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
        if (IS_OFFLINE_LOCAL_MODE) {
            return await deleteOfflineCampaign(id);
        }
        const response = await apiRequest({
            method: "DELETE",
            path: `/campaigns/${id}`,
        });
        console.log(id);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


