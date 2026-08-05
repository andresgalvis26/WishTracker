import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const ElegantDropdown = ({
    value,
    onChange,
    options,
    placeholder,
    className = '',
    triggerClassName = '',
    menuClassName = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const selectedOption = options.find((option) => option.value === value) || options[0];
    const buttonLabel = selectedOption?.label || placeholder;

    return (
        <div ref={containerRef} className={`relative flex-1 min-w-0 ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-gray-600 bg-white/95 dark:bg-gray-700/90 px-4 py-3 text-sm md:text-base text-slate-700 dark:text-gray-100 shadow-sm transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${triggerClassName}`}
            >
                <span className="flex min-w-0 items-center gap-2 truncate">
                    {selectedOption?.icon && <span className="text-base leading-none">{selectedOption.icon}</span>}
                    <span className={`truncate ${selectedOption?.isPlaceholder ? 'text-slate-400 dark:text-gray-500' : 'text-slate-700 dark:text-gray-100'}`}>
                        {buttonLabel}
                    </span>
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    className={`absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-200 dark:border-gray-600 bg-white/95 dark:bg-gray-700/95 shadow-2xl backdrop-blur ${menuClassName}`}
                >
                    <div className="max-h-72 overflow-y-auto py-2">
                        {options.map((option) => {
                            const isSelected = option.value === value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors duration-150 ${
                                        isSelected
                                            ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                            : 'text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span className="flex min-w-0 items-center gap-2 truncate">
                                        {option.icon && <span className="text-base leading-none">{option.icon}</span>}
                                        <span className="truncate">{option.label}</span>
                                    </span>
                                    <span className="flex items-center gap-2 shrink-0">
                                        {typeof option.count === 'number' && (
                                            <span className="rounded-full bg-slate-100 dark:bg-gray-700 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:text-gray-400">
                                                {option.count}
                                            </span>
                                        )}
                                        {isSelected && <Check className="h-4 w-4 text-purple-600" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ElegantDropdown;