import React, { useState, useRef, useEffect } from 'react';
import { countries } from '@/lib/countries';

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    dialCode: string;
    onDialCodeChange: (code: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, dialCode, onDialCodeChange }) => {
    const [showDialDropdown, setShowDialDropdown] = useState(false);
    const [dialSearch, setDialSearch] = useState('');
    const dialRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialRef.current && !dialRef.current.contains(event.target as Node)) {
                setShowDialDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredDialCodes = countries.filter(c => 
        c.name.toLowerCase().includes(dialSearch.toLowerCase()) ||
        c.dial.includes(dialSearch)
    );

    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
            <div className="flex gap-3 relative">
                <div className="relative" ref={dialRef}>
                    <button 
                        type="button" 
                        onClick={() => setShowDialDropdown(!showDialDropdown)} 
                        className="h-[52px] bg-[#F8F8F6] rounded-xl px-4 flex items-center gap-2 min-w-[100px] hover:bg-gray-100 transition-colors"
                    >
                        <span>{countries.find(c => c.dial === dialCode)?.flag || '🇳🇬'}</span>
                        <span className="text-[15px]">{dialCode}</span>
                        <svg className={`w-4 h-4 transition-transform ${showDialDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showDialDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                            <div className="p-3 border-b border-gray-50">
                                <input 
                                    type="text"
                                    placeholder="Search code..."
                                    value={dialSearch}
                                    onChange={(e) => setDialSearch(e.target.value)}
                                    className="w-full bg-gray-50 rounded-lg px-4 py-2 text-[14px] outline-none border-none focus:ring-1 focus:ring-[#E8593C]/20"
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-60 overflow-y-auto py-2">
                                {filteredDialCodes.map(c => (
                                    <button 
                                        key={c.code} 
                                        type="button" 
                                        onClick={() => { 
                                            onDialCodeChange(c.dial); 
                                            setShowDialDropdown(false); 
                                            setDialSearch('');
                                        }} 
                                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{c.flag}</span>
                                            <span className="text-[14px] font-medium">{c.name}</span>
                                        </span>
                                        <span className="text-[12px] text-gray-400 font-medium">{c.dial}</span>
                                    </button>
                                ))}
                                {filteredDialCodes.length === 0 && (
                                    <div className="px-4 py-4 text-[13px] text-gray-400 text-center">No results</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <input 
                    type="tel" 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    className="flex-1 bg-[#F8F8F6] rounded-xl px-5 h-[52px] outline-none focus:ring-2 focus:ring-[#E8593C]/20" 
                    placeholder="0812 345 6789" 
                    required 
                />
            </div>
        </div>
    );
};
