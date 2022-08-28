import * as Yup from 'yup';

export const correctName = (name: string) => {
    return name
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
};

export const nameValidationSchema = () => (
    Yup.string()
        .min(2, 'Must be 2 characters or more')
        .max(20, 'Must be 20 characters or less')
        .required('Required')
);

export const getValidationSchema = () => {
    return Yup.object({
        drug: nameValidationSchema(),
        country: nameValidationSchema().nullable(),
        composition: Yup.array().of(nameValidationSchema()).test({
            message: 'Must be 1 substance or more',
            test: arr => !!arr?.length
        }),
        cost: Yup.number()
            .min(1, 'Must be $1 or more')
            .max(999999999, 'Too much amount')
    });
};
