'use client';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const ImagePreviewer = ({ src, alt, className = '' }) => {
    return (
        <TransformWrapper>
            <TransformComponent>
                <img
                    src={src}
                    alt={alt}
                    className={cn(className, 'w-full h-full')}
                />
            </TransformComponent>
        </TransformWrapper>
    );
};

export default ImagePreviewer;
