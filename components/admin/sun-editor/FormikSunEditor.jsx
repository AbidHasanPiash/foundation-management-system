'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { useField } from 'formik';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false });

export default function FormikSunEditor({ name, ...props }) {
    const [field, , helpers] = useField(name || 'description');
    const { setValue } = helpers;

    const handleEditorChange = (content) => {
        setValue(content);
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SunEditor
                {...props}
                height='280px'
                defaultValue={field?.value || ''}
                onChange={handleEditorChange}
                hideToolbar={false}
                setOptions={{
                    buttonList: [
                        ['undo', 'redo'],
                        ['font', 'fontSize', 'formatBlock'],
                        [
                            'bold',
                            'italic',
                            'underline',
                            'strike',
                            'subscript',
                            'superscript',
                        ],
                        ['fontColor', 'hiliteColor', 'align', 'list', 'table'],
                        ['link', 'codeView'],
                        ['removeFormat', 'fullScreen'],
                    ],
                }}
            />
        </Suspense>
    );
}
