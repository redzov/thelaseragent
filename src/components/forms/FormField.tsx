import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";

interface BaseFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}

interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
  options?: never;
  rows?: never;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  placeholder?: string;
  rows?: number;
  options?: never;
  inputProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  placeholder?: string;
  options: { value: string; label: string }[];
  rows?: never;
  inputProps?: SelectHTMLAttributes<HTMLSelectElement>;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

const baseInputClasses =
  "w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border border-[#333] text-white placeholder:text-[#666] focus:outline-none focus:border-[#2196F3] transition-colors";

export default function FormField(props: FormFieldProps) {
  const { label, name, error, required, type = "text", placeholder } = props;

  const id = `field-${name}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#c9c9c9] mb-1.5">
        {label}
        {required && <span className="text-[#2196F3] ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          rows={(props as TextareaFieldProps).rows ?? 4}
          className={`${baseInputClasses} resize-vertical`}
          {...(props as TextareaFieldProps).inputProps}
        />
      ) : type === "select" ? (
        <select
          id={id}
          name={name}
          className={`${baseInputClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:20px]`}
          {...(props as SelectFieldProps).inputProps}
        >
          <option value="" className="bg-[#1a1a1a] text-[#666]">
            {placeholder || `Select ${label.toLowerCase()}`}
          </option>
          {(props as SelectFieldProps).options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1a1a] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={baseInputClasses}
          {...(props as InputFieldProps).inputProps}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}
