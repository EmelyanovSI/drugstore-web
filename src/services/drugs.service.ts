import axios from '../axios';
import { Drug } from '../interfaces/drugs.interface';
import { APIResponse } from '../interfaces/response.interface';

export const getDrugs = async (): Promise<APIResponse<Array<Drug>>> => {
    const { data } = await axios.get('/drugs');
    return data;
};

export const getDrugById = async (drugId: string): Promise<APIResponse<Drug>> => {
    const { data } = await axios.get(`/drugs/${drugId}`);
    return data;
};

export const getDrugsByCountry = async (countryId: string): Promise<APIResponse<Array<Drug>>> => {
    const { data } = await axios.get(`/${countryId}/drugs`);
    return data;
};

export const createDrug = async (drug: Drug): Promise<APIResponse<Drug>> => {
    const { data } = await axios.post('/drugs', drug);
    return data;
};

export const updateDrug = async (drugId: string, drug: Drug): Promise<APIResponse<Drug>> => {
    const { data } = await axios.put(`/drugs/${drugId}`, drug);
    return data;
};

export const deleteDrug = async (drugId: string): Promise<APIResponse<Drug>> => {
    const { data } = await axios.delete(`/drugs/${drugId}`);
    return data;
};
