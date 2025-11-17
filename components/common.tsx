import React from 'react';

export const CustomInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${props.className}`} />
);

export const CustomSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className={`w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none bg-no-repeat pr-10 ${props.className}`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>{props.children}</select>
);

export const CustomTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-800 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${props.className}`} />
);

export const ActionButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }> = ({ children, isLoading, ...props }) => (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${props.className}`}
    >
      {isLoading && <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>}
      {children}
    </button>
);

export const Section: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode, extraHeaderContent?: React.ReactNode }> = ({ icon, title, children, extraHeaderContent }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center text-violet-600">{icon}</div>
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            {extraHeaderContent}
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

export const RadioButton: React.FC<{id: string, name: string, value: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string}> = ({id, name, value, checked, onChange, label}) => (
    <label htmlFor={id} className="flex items-center cursor-pointer">
        <input 
            type="radio" 
            id={id} 
            name={name} 
            value={value} 
            checked={checked}
            onChange={onChange}
            className="hidden peer"
        />
        <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-2 flex items-center justify-center peer-checked:border-violet-600">
            <div className="w-2.5 h-2.5 bg-violet-600 rounded-full transform scale-0 peer-checked:scale-100 transition-transform"></div>
        </div>
        <span className="text-sm font-medium text-gray-700 peer-checked:text-gray-900">{label}</span>
    </label>
);

export const Checkbox: React.FC<{id: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, label: string, disabled?: boolean}> = ({id, checked, onChange, label, disabled}) => (
    <label htmlFor={id} className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <input 
            type="checkbox" 
            id={id} 
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="hidden peer"
        />
        <div className="w-5 h-5 border-2 border-gray-300 rounded-md mr-2 flex items-center justify-center peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-colors">
            <svg className="w-3.5 h-3.5 text-white transform scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span className="text-sm font-medium text-gray-700 peer-checked:text-gray-900">{label}</span>
    </label>
);

export const PositionButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
}> = ({ onClick, isActive }) => (
  <button
    type="button"
    onClick={onClick}
    className={`aspect-square w-full rounded-md flex items-center justify-center transition-colors ${isActive ? 'bg-violet-600' : 'bg-gray-200 hover:bg-gray-300'}`}
  >
    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400'}`}></div>
  </button>
);
