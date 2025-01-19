'use client';

import * as React from 'react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';

export function InputNumber({ value, onChange, onBlur, totalDigits = 10 }) {
    return (
        <InputOTP maxLength={totalDigits} value={value} onChange={onChange}>
            <InputOTPGroup>
                {Array.from({ length: totalDigits }, (_, index) => (
                    <InputOTPSlot key={index} index={index} onBlur={onBlur} />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
}
