import React from 'react';
import { PiFilePdfThin } from 'react-icons/pi';

export default function FormPdfViewer({ link, name }) {
    return (
        <div>
            <a
                href={link}
                target='_blank'
                rel='noopener noreferrer'
                className='py-2 px-4 ring-1 ring-gray-300 rounded-md flex items-center gap-2 hover:ring-primary hover:text-primary'
            >
                <PiFilePdfThin />
                {name}
            </a>
        </div>
    );
}
