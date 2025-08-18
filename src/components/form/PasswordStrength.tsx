import React from 'react';

interface PasswordStrengthProps {
    passwordStrength: {
        strength: number;
        label: string;
        color: string;
    },
    password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
    passwordStrength, password
}) => {
    return (
        <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                </div>
                <span className="text-xs text-slate-300 font-medium min-w-[50px]">
                    {passwordStrength.label}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-xs">
                <div className={`${password.length >= 8 ? 'text-green-400' : 'text-slate-500'}`}>
                    ✓ 8+ characters
                </div>
                <div className={`${/[A-Z]/.test(password) ? 'text-green-400' : 'text-slate-500'}`}>
                    ✓ Uppercase
                </div>
                <div className={`${/[a-z]/.test(password) ? 'text-green-400' : 'text-slate-500'}`}>
                    ✓ Lowercase
                </div>
                <div className={`${/\d/.test(password) ? 'text-green-400' : 'text-slate-500'}`}>
                    ✓ Number
                </div>
            </div>
        </div>
    )
}

export default PasswordStrength