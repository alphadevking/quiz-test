import { ButtonProps } from "."

export const Button = ({
    className,
    children,
    title,
    action,
    text,
} : ButtonProps ) => {
    return (
        <button className={`px-3 py-1 ring-1 ring-slate-500 hover:bg-slate-700 hover:text-slate-100 transition-all duration-300 rounded-md ${className}`} title={title} onClick={action}>{text}{children}</button>
    )
}
