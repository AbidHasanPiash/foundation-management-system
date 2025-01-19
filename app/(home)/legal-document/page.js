import Link from 'next/link';
import NoDataFound from '@/components/admin/common/NoDataFound';
import apiConfig from '@/configs/apiConfig';
import { fetchDataAsServer } from '@/util/axios';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default async function LegalDocument() {
    const response = await fetchDataAsServer(apiConfig?.GET_LEGAL_DOCUMENT);

    const legalDocument = Array.isArray(response) ? response[0] : response;

    return !legalDocument ? (
        <NoDataFound />
    ) : (
        <div className="min-h-screen h-full py-10">
            <div className="max-w-4xl h-full mx-auto p-4 shadow-md rounded-lg bg-muted">
                {/* Page Title */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold">
                        {legalDocument?.title}
                    </h1>
                    <p className="mt-2">
                        Effective Date: {legalDocument?.effectiveDate}
                    </p>
                </div>
                {/* Download PDF Button */}
                <div className="mt-8 flex flex-wrap items-center justify-center pb-4 gap-4">
                    {legalDocument?.documents?.map((doc, index) => (
                        <Link
                            key={index}
                            href={doc?.link}
                            download
                            target="_blank"
                        >
                            <Button className="flex items-center space-x-2">
                                <Download className="w-4 h-4" />
                                <span>{doc?.name}</span>
                            </Button>
                        </Link>
                    ))}
                </div>

                <div className="sun-editor-content text-foreground overflow-x-auto w-full">
                    {/* Rendering HTML content from description */}
                    {legalDocument?.description && (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: legalDocument?.description,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
