import { useEffect, useState } from 'react';
import { useFormik } from 'formik';

import { Status } from '../constants/enums';
import { Message } from '../constants/types';
import { Country } from '../interfaces/countries.interface';
import { getCountryById } from '../services/countries.service';
import { getValidationSchema } from '../utils';

export const useCardFormik = (drug: string, countryId: string, composition: Array<string>, cost?: number) => {
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
            alert(JSON.stringify(values, null, 2));
        }
    });

    useEffect(() => {
        if (status !== Status.Succeeded) {
            formik.values.country && setStatus(Status.Succeeded);
        }
    }, [formik.values.country, status]);

    return { formik, status, message };
};
