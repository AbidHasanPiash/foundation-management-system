'use client';

import { Input } from '@/components/ui/input';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import { encryptData } from '@/util/crypto.client';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import InputWrapper from '@/components/ui/input-wrapper';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import Submit from '@/components/button/Submit';
import { RiSendPlaneLine } from 'react-icons/ri';
import Link from 'next/link';
import { login } from '@/util/auth';
import { useUser } from '@/contexts/UserContext';
import apiConfig from '@/configs/apiConfig';

// Yup validation schema
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
});

export default function LoginPage() {
    const { updateUser } = useUser();
    const router = useRouter();

    const initialValues = {
        email: 'montasimmamun@gmail.com',
        password: 'Qweqwe@12345',
    };

    const submit = async (data) => {
        await login(data, apiConfig?.SUPER_ADMIN_LOGIN);
    };

    const onSuccess = () => {
        formik.resetForm();
        router.push('/admin');
        updateUser();
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const encryptedPassword = encryptData(values.password);
            mutation.mutate({ ...values, password: encryptedPassword });
        },
    });

    const mutation = useMutation({
        mutationKey: ['login'],
        mutationFn: submit,
        onSuccess,
    });

    return (
        <Card className="max-w-sm w-full">
            <CardHeader className="text-center">
                <h2 className="text-lg md:text-xl lg:text-3xl uppercase font-semibold">
                    Super Admin Login
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Please enter your credentials to access your account
                </p>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col items-center justify-center space-y-4 w-full"
                >
                    <InputWrapper
                        label="Email"
                        error={formik.errors?.email}
                        touched={formik.touched?.email}
                    >
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formik.values?.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper
                        label="Password"
                        error={formik.errors?.password}
                        touched={formik.touched?.password}
                    >
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formik.values?.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <div>
                        <Submit
                            disabled={mutation.isPending || mutation.isSuccess}
                            label={
                                mutation.isPending ? 'Submitting...' : 'Login'
                            } // Dynamic label
                            icon={
                                mutation.isPending ? (
                                    <Spinner size="4" />
                                ) : (
                                    <RiSendPlaneLine />
                                )
                            } // Dynamic icon
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <Link href={'#'} className="hover:underline hover:text-primary">
                    Forgot password?
                </Link>
            </CardFooter>
        </Card>
    );
}
