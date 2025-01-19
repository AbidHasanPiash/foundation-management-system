import React from 'react';
import dynamic from 'next/dynamic';
import { fetchDataAsServer } from '@/util/axios';
import apiConfig from '@/configs/apiConfig';

// Dynamically import your form components
const TalentPoolScholarshipForm = dynamic(
    () => import('@/components/form/TalentPoolScholarshipForm')
);
const ScholarshipForm = dynamic(
    () => import('@/components/form/ScholarshipForm')
);

// Map form codes to components
const formComponents = {
    SFTS24: TalentPoolScholarshipForm,
    SFS24: ScholarshipForm,
};

export default async function ApplicationForm({ params }) {
    const { id } = params;

    try {
        // Fetch form details
        const formDetails = await fetchDataAsServer(apiConfig?.GET_SCHOLARSHIP_FORM_BY_ID+id);
        const organizationInfo = await fetchDataAsServer(apiConfig?.GET_GENERAL_INFO);

        // Select the appropriate form component based on the code
        const FormComponent = formComponents[formDetails?.formCode];

        // Render the selected form component with formDetails
        return (
            <section className="max-w-7xl mx-auto my-10 sp spy">
                {FormComponent ? (
                    <FormComponent formDetails={formDetails} organizationInfo={organizationInfo}/>
                ) : (
                    <p>Invalid form code. Please check the URL.</p>
                )}
            </section>
        );
    } catch (error) {
        console.error('Error fetching form details:', error);

        return (
            <section className="max-w-7xl mx-auto my-10 shadow-xl rounded-xl sp spy">
                <p>{`Form Code: ${code}`}</p>
                <p>{`Form Id: ${id}`}</p>
                <p>Failed to load form details. Please try again later.</p>
            </section>
        );
    }
}
