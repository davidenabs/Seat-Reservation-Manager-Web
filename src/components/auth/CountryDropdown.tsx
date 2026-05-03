import React, { useState, useRef, useEffect } from 'react';
import { countries } from '@/lib/countries';

interface CountryDropdownProps {
    value: string;
    onChange: (value: string) => void;
    onDialCodeChange?: (code: string) => void;
}

export const CountryDropdown: React.FC<CountryDropdownProps> = ({ value, onChange, onDialCodeChange }) => {
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const countryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setShowCountryDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-detect country via IP
    useEffect(() => {
        if (!value) {
            const detectCountry = async () => {
                try {
                    const res = await fetch('https://ipapi.co/json/');
                    const data = await res.json();
                    if (data.country_code) {
                        const found = countries.find(c => c.code === data.country_code);
                        if (found) {
                            onChange(found.name);
                            if (onDialCodeChange) onDialCodeChange(found.dial);
                        }
                    }
                } catch (err) {
                    console.error("IP detection failed", err);
                }
            };
            detectCountry();
        }
    }, [value, onChange, onDialCodeChange]);

    const filteredCountries = countries.filter(c => 
        c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );

    return (
        <div className="space-y-1.5 relative" ref={countryRef}>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Country</label>
            <button 
                type="button" 
                onClick={() => setShowCountryDropdown(!showCountryDropdown)} 
                className="w-full h-[52px] bg-[#F8F8F6] rounded-xl px-5 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
                <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || 'Select your country'}</span>
                <svg className={`w-5 h-5 text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {showCountryDropdown && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-50">
                        <input 
                            type="text" 
                            placeholder="Search country..." 
                            value={countrySearch} 
                            onChange={e => setCountrySearch(e.target.value)} 
                            className="w-full bg-gray-50 rounded-lg px-4 py-2 text-[14px] outline-none" 
                            autoFocus 
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto py-2">
                        {filteredCountries.map(c => (
                            <button 
                                key={c.code} 
                                type="button" 
                                onClick={() => { 
                                    onChange(c.name); 
                                    if (onDialCodeChange) onDialCodeChange(c.dial);
                                    setShowCountryDropdown(false); 
                                    setCountrySearch(''); 
                                }} 
                                className="w-full px-5 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                            >
                                <span>{c.flag}</span>
                                <span className="text-[14px]">{c.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
