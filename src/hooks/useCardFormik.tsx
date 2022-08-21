import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Status } from '../constants/enums';
import { Message } from '../constants/types';
import { Country } from '../interfaces/countries.interface';
import { getCountryById } from '../services/countries.service';

const nameValidationSchema = () => Yup.string()
    .trim()
    .min(2, 'Please enter a name more than 2 characters')
    .max(20, 'Must be 20 characters or less')
    .required('Required');

export const useCardFormik = (drug: string, countryId: string) => {
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
            country: country?.name ?? ''
        },
        validationSchema: Yup.object({
            drug: nameValidationSchema(),
            country: nameValidationSchema()
        }),
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
