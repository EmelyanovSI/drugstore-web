import axios from '@/axios';
import { Country } from '@/interfaces/countries.interface';
import { APIResponse } from '@/interfaces/response.interface';

export const getCountries = async (): Promise<APIResponse<Array<Country>>> => {
    const { data } = await axios.get('/countries');
    return data;
};

export const getCountryById = async (countryId: string): Promise<APIResponse<Country>> => {
    const { data } = await axios.get(`/countries/${countryId}`);
    return data;
};

export const createCountry = async (country: Country): Promise<APIResponse<Country>> => {
    const { data } = await axios.post('/countries', country);
    return data;
};

export const updateCountry = async (countryId: string, country: Country): Promise<APIResponse<Country>> => {
    const { data } = await axios.put(`/countries/${countryId}`, country);
    return data;
};

export const deleteCountry = async (countryId: string): Promise<APIResponse<Country>> => {
    const { data } = await axios.delete(`/countries/${countryId}`);
    return data;
};
