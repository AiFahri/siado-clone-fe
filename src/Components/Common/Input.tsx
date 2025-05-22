import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    fullWidth = true,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
        <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
                    rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50
                    ${error ? 'border-red-500' : ''}
                    ${fullWidth ? 'w-full' : ''}
                    ${className}
                `}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;
