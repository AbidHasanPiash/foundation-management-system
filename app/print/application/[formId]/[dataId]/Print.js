'use client';
import { Button } from "@/components/ui/button";
import React from "react";
import { HiOutlineScissors, HiPrinter } from "react-icons/hi";
import { useReactToPrint } from "react-to-print";

export default function Print({ formDetails, applicantDetails, organizationInfo }) {
    const componentRef = React.useRef(null);

    const handleAfterPrint = React.useCallback(() => {
        console.log("Printing completed");
    }, []);

    const handleBeforePrint = React.useCallback(() => {
        console.log("Preparing for printing");
        return Promise.resolve();
    }, []);

    const printFn = useReactToPrint({
        contentRef: componentRef,
        documentTitle: "AwesomeFileName",
        onAfterPrint: handleAfterPrint,
        onBeforePrint: handleBeforePrint,
    });

    return (
        <div>
            <div className="sticky top-0 right-0 flex justify-end mb-2 p-2 bg-gray-200 dark:bg-neutral-700">
                <Button size='sm' onClick={printFn} className='space-x-2'>
                    <HiPrinter className="w-4 h-4" />
                    <span>Print</span>
                </Button>
            </div>
            <div className="p-0">
                <AdmitCard ref={componentRef} formDetails={formDetails} applicantDetails={applicantDetails} organizationInfo={organizationInfo} />
            </div>
        </div>
    );
}

const AdmitCard = React.forwardRef((props, ref) => {
    const { formDetails, applicantDetails, organizationInfo } = props;

    const formInfo = {
        slNo: applicantDetails?.slNo,
        organizer: {
            name: organizationInfo?.name,
            address: organizationInfo?.address,
            founded: new Date(organizationInfo?.startDate).getFullYear(),
        },
        formTitle: formDetails?.formTitle,
        formName: formDetails?.formName,
        venue: formDetails?.venue,
        eligibleSchools: formDetails?.eligibleSchools,
        exam: formDetails?.exam,
        note: formDetails?.note,
        contact: organizationInfo?.contacts,
        email: organizationInfo?.emails,
    };

    if (!formDetails) {
        return (
            <div ref={ref} className="w-full print:w-[8.5in] h-[11in] print:h-fit p-2">
                <p className="w-full max-w-[8.5in] mx-auto p-6 text-center">No data available to display.</p>
            </div>
        );
    }

    return (
        <div ref={ref} className="w-full print:w-[8.5in] h-[11in] print:h-fit p-2">
            <div
                className="w-full max-w-[8.5in] mx-auto space-y-4 bg-white text-black shadow-lg print:shadow-none"
                style={{ height: "100%" }}
            >
                <div className="border border-gray-400 rounded p-6">
                    <AdmitCardHead formInfo={formInfo} applicantDetails={applicantDetails} office />
                    <AdmitCardBody formInfo={formInfo} applicantDetails={applicantDetails} />
                </div>
                <div className="w-full flex items-center my-4">
                    <HiOutlineScissors />
                    <div className="w-full border border-dashed" />
                </div>
                <div className="border border-gray-400 rounded p-6">
                    <AdmitCardHead formInfo={formInfo} applicantDetails={applicantDetails} />
                    <AdmitCardBody formInfo={formInfo} applicantDetails={applicantDetails} />
                    <AdmitCardFooter formInfo={formInfo} />
                </div>

            </div>
        </div>
    );
});

AdmitCard.displayName = "AdmitCard";

const AdmitCardHead = ({ formInfo, applicantDetails, office = false }) => (
    <div className="flex justify-between">
        <div className="w-fit h-fit border py-1 px-3">
            <p>SL No: {formInfo?.slNo}</p>
        </div>
        <div className='flex flex-grow flex-col items-center justify-center text-base'>
            <p className='text-xl uppercase font-bold'>
                {formInfo?.organizer?.name}
            </p>
            <p className='text-sm'>{formInfo?.organizer?.address}</p>
            <p className='font-bold'>
                Since - {formInfo?.organizer?.founded}
            </p>
            <p className='text-lg md:text-xl font-bold'>
                {formInfo?.formTitle}
            </p>
            {office ? (
                <p className='text-xs font-bold p-1 w-fit'>[ Office Copy ]</p>
            ) : (
                <p className='text-xs font-bold border-4 mt-2 border-double p-1 w-fit'>
                    {formInfo?.formName}
                </p>
            )}
        </div>
        <div className="w-[1in] h-[1.17in] border">
            <img
                src={applicantDetails.image?.link}
                alt="Selected Image"
                className="w-full h-full object-cover"
            />
        </div>
    </div>
);

const AdmitCardBody = ({ formInfo, applicantDetails }) => (
    <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
            <p className="flex whitespace-nowrap space-x-2">
                <strong>Applicant Name (Bangle) : </strong>
                <span className="w-full border-b border-dashed font-bengali">{applicantDetails?.applicantNameBn}</span>
            </p>
            <p className="flex whitespace-nowrap space-x-2">
                <strong>Applicant Name (English) : </strong>
                <span className="w-full border-b border-dashed">{applicantDetails?.applicantNameEn}</span>
            </p>
            <p className="flex whitespace-nowrap space-x-2">
                <strong>Father Name : </strong>
                <span className="w-full border-b border-dashed">{applicantDetails?.fatherName}</span>
            </p>
            <p className="flex whitespace-nowrap space-x-2">
                <strong>Mother Name : </strong>
                <span className="w-full border-b border-dashed">{applicantDetails?.motherName}</span>
            </p>
        </div>
        <div className="flex gap-2">
            <p className="flex flex-grow whitespace-nowrap space-x-2">
                <strong>Institute Name : </strong>
                <span className="w-full border-b border-dashed">{applicantDetails?.schoolName}</span>
            </p>
            <p className="flex whitespace-nowrap space-x-2">
                <strong>Class Roll : </strong>
                <span className="w-full border-b border-dashed">{applicantDetails?.classRollNo}</span>
            </p>
        </div>
        <p className="flex whitespace-nowrap space-x-2">
            <strong>Permanent Address : </strong>
            <span className="w-full border-b border-dashed">
                {applicantDetails?.permanentAddress?.village}, {' '}
                {applicantDetails?.permanentAddress?.subdistrict}, {' '}
                {applicantDetails?.permanentAddress?.district},
            </span>
        </p>
        <div className="flex gap-2">
            <p className="flex flex-grow whitespace-nowrap space-x-2">
                <strong>Current Address : </strong>
                <span className="w-full border-b border-dashed">
                    {applicantDetails?.currentAddress?.village}, {' '}
                    {applicantDetails?.currentAddress?.subdistrict}, {' '}
                    {applicantDetails?.currentAddress?.district},
                </span>
            </p>
            <p className="flex whitespace-nowrap space-x-2">
                <strong>Contact : </strong>
                <span className="w-full border-b border-dashed">{applicantDetails?.contact}</span>
            </p>
        </div>

        <div className="flex items-center justify-between gap-20 pt-4">
            <div className="flex flex-grow flex-col items-center justify-center space-y-5 max-w-96">
                <strong>Head Master</strong>
                <div className="w-full border-b border-dashed" />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
                <strong>Exam Controller</strong>
                <strong>{formInfo?.organizer?.name}</strong>
            </div>
        </div>
    </div>
);

const AdmitCardFooter = ({ formInfo }) => (
    <div>
        <p className="text-center font-bold">Exam Timetable</p>
        <table className="border border-collapse w-full text-left text-xs">
            <thead>
                <tr>
                    <th className="border px-2 py-1">SL</th>
                    <th className="border px-2 py-1">Subject</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Time (24 H)</th>
                </tr>
            </thead>
            <tbody>
                {formInfo?.exam.map((exam, index) => (
                    <tr key={index}>
                        <td className="border px-2 py-1">{index + 1}</td>
                        <td className="border px-2 py-1 font-medium">{exam.subject}</td>
                        <td className="border px-2 py-1">{new Date(exam.date).toLocaleDateString()}</td>
                        <td className="border px-2 py-1">{exam.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <p className="text-center">Venue: {formInfo?.venue}</p>
        <div className="w-full flex flex-col items-start gap-2 mt-4 text-sm">
            <div className="flex items-baseline gap-2">
                {formInfo?.note?.map((note, index) => (
                    <p key={index} className="text-justify">* {note}</p>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-5 w-full">
                <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium">Contact:</p>
                    {formInfo?.contact?.map((contact, index) => (
                        <p key={index} className="text-justify">{contact}</p>
                    ))}
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium">Email:</p>
                    {formInfo?.email?.map((email, index) => (
                        <p key={index} className="text-justify">{email}</p>
                    ))}
                </div>
            </div>
        </div>
    </div>
);