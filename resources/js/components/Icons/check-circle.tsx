import { SVGAttributes } from "react";

interface IconCheckLoginProps extends SVGAttributes<SVGSVGElement> {
    className?: string;
}

export default function IconCheckLogin({ className, ...props }: IconCheckLoginProps) {
    return (
        <svg 
            {...props}
            className={className}
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
        >
            <g clipPath="url(#clip0_icon_check)">
                <path 
                    d="M10.0001 18.3334C14.6025 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6025 1.66669 10.0001 1.66669C5.39771 1.66669 1.66675 5.39765 1.66675 10C1.66675 14.6024 5.39771 18.3334 10.0001 18.3334Z" 
                    stroke="#FFBD00" 
                    strokeWidth="1.66667" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
                <path 
                    d="M7.5 9.99998L9.16667 11.6666L12.5 8.33331" 
                    stroke="#FFBD00" 
                    strokeWidth="1.66667" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_icon_check">
                    <rect width="20" height="20" fill="white"/>
                </clipPath>
            </defs>
        </svg>
    );
}