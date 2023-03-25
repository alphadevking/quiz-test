export interface GlobalProps {
    children?: React.ReactNode;
    className?: undefined | string;
    action?: React.MouseEventHandler<HTMLButtonElement>;
    text?: undefined | string;
    title?: undefined | string;
    disabled?: boolean;
}