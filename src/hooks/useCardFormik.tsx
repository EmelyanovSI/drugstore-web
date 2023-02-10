import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { useAppDispatch, useAppSelector } from '@/redux/store';
import { findAndUpdateDrug } from '@/redux/drugsSlice';
import { Country } from '@/interfaces/countries.interface';
import { Drug } from '@/interfaces/drugs.interface';
import { getCountryById } from '@/services/countries.service';
import { updateDrug } from '@/services/drugs.service';
import { Status } from '@/constants/enums';
import { Message } from '@/constants/types';
import { getValidationSchema } from '@/utils';

export const useCardFormik = (
    drug: string,
    countryId: string,
    composition: Array<string>,
    drugId?: string,
    cost?: number
) => {
    const dispatch = useAppDispatch();
    const countries = useAppSelector<Array<Country>>((state) => state.countriesReducer.countries);

    const [status, setStatus] = useState(Status.Idle);
    const [message, setMessage] = useState<Message>(null);
    const [country, setCountry] = useState<Country | null>(null);

    useEffect(() => {
        setStatus(Status.Loading);
        getCountryById(countryId).then(response => {
            setCountry(response.data);
            setMessage(null);
        }).catch(error => {
            setMessage(error.message);
            setStatus(Status.Failed);
        });
    }, [countryId]);

    const formik = useFormik({
        initialValues: {
            drug,
            country: country?.name ?? '',
            composition,
            cost: cost ?? ''
        },
        validationSchema: getValidationSchema(),
        enableReinitialize: true,
        onSubmit: values => {
            const country = countries.find(({ name }) => name === values.country)!._id;
            const drug: Drug = {
                name: values.drug,
                country: `${country}`,
                composition: values.composition.map(value => ({ name: value, activeSubstance: false })),
                cost: values.cost ? +values.cost : undefined
            };
            updateDrug(`${drugId}`, drug).then(() => {
                dispatch(findAndUpdateDrug({ ...drug, _id: `${drugId}` }));
            });
        }
    });

    useEffect(() => {
        if (status !== Status.Succeeded) {
            formik.values.country && setStatus(Status.Succeeded);
        }
    }, [formik.values.country, status]);

    return { formik, status, message };
};
