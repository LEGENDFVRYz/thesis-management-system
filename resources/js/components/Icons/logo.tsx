import { SVGAttributes } from "react";

type LogoVariant = "light" | "dark";

interface AppLogoIconProps extends SVGAttributes<SVGSVGElement> {
  variant?: LogoVariant;
}

export default function AppLogoIcon({ variant, ...props }: AppLogoIconProps) {
  const isDark =
    variant === "dark" ||
    (!variant &&
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark"));

  const currentVariant: LogoVariant = isDark ? "dark" : "light";

  if (currentVariant === "dark") {
    return (
      <svg
        {...props}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark red outer circle */}
        <path
          d="M40 78.4C61.2077 78.4 78.4 61.2077 78.4 40C78.4 18.7923 61.2077 1.6 40 1.6C18.7923 1.6 1.6 18.7923 1.6 40C1.6 61.2077 18.7923 78.4 40 78.4Z"
          fill="#730000"
        />

        {/* Grid lines and dots - yellow */}
        <g opacity="0.2">
          <path d="M16 24H32" stroke="#FFBD00" strokeWidth="1.2" />
          <path d="M48 24H64" stroke="#FFBD00" strokeWidth="1.2" />
          <path d="M16 40H28" stroke="#FFBD00" strokeWidth="1.2" />
          <path d="M52 40H64" stroke="#FFBD00" strokeWidth="1.2" />
          <path d="M16 56H32" stroke="#FFBD00" strokeWidth="1.2" />
          <path d="M48 56H64" stroke="#FFBD00" strokeWidth="1.2" />
          <circle cx="32" cy="24" r="1.6" fill="#FFBD00" />
          <circle cx="48" cy="24" r="1.6" fill="#FFBD00" />
          <circle cx="32" cy="56" r="1.6" fill="#FFBD00" />
          <circle cx="48" cy="56" r="1.6" fill="#FFBD00" />
        </g>

        {/* Cream middle panel */}
        <path
          d="M52.8 24H27.2C25.4327 24 24 25.4327 24 27.2V52.8C24 54.5673 25.4327 56 27.2 56H52.8C54.5673 56 56 54.5673 56 52.8V27.2C56 25.4327 54.5673 24 52.8 24Z"
          fill="#F3EFD0"
          opacity="0.98"
        />

        {/* Yellow decorative bars */}
        <path d="M24 30.4H17.6V32H24V30.4Z" fill="#FFBD00" />
        <path d="M24 38.4H17.6V40H24V38.4Z" fill="#FFBD00" />
        <path d="M24 46.4H17.6V48H24V46.4Z" fill="#FFBD00" />
        <path d="M62.4 30.4H56V32H62.4V30.4Z" fill="#FFBD00" />
        <path d="M62.4 38.4H56V40H62.4V38.4Z" fill="#FFBD00" />
        <path d="M62.4 46.4H56V48H62.4V46.4Z" fill="#FFBD00" />
        <path d="M32 17.6H30.4V24H32V17.6Z" fill="#FFBD00" />
        <path d="M40 17.6H38.4V24H40V17.6Z" fill="#FFBD00" />
        <path d="M48 17.6H46.4V24H48V17.6Z" fill="#FFBD00" />
        <path d="M32 56H30.4V62.4H32V56Z" fill="#FFBD00" />
        <path d="M40 56H38.4V62.4H40V56Z" fill="#FFBD00" />
        <path d="M48 56H46.4V62.4H48V56Z" fill="#FFBD00" />

        {/* Dark blocks */}
        <g>
          <path
            d="M36 30.4H31.2C30.7582 30.4 30.4 30.7582 30.4 31.2V36C30.4 36.4418 30.7582 36.8 31.2 36.8H36C36.4418 36.8 36.8 36.4418 36.8 36V31.2C36.8 30.7582 36.4418 30.4 36 30.4Z"
            fill="#730000"
          />
          <path
            d="M48.8 30.4H44C43.5582 30.4 43.2 30.7582 43.2 31.2V36C43.2 36.4418 43.5582 36.8 44 36.8H48.8C49.2418 36.8 49.6 36.4418 49.6 36V31.2C49.6 30.7582 49.2418 30.4 48.8 30.4Z"
            fill="#730000"
          />
          <path
            d="M36 43.2H31.2C30.7582 43.2 30.4 43.5582 30.4 44V48.8C30.4 49.2418 30.7582 49.6 31.2 49.6H36C36.4418 49.6 36.8 49.2418 36.8 48.8V44C36.8 43.5582 36.4418 43.2 36 43.2Z"
            fill="#730000"
          />
          <path
            d="M48.8 43.2H44C43.5582 43.2 43.2 43.5582 43.2 44V48.8C43.2 49.2418 43.5582 49.6 44 49.6H48.8C49.2418 49.6 49.6 49.2418 49.6 48.8V44C49.6 43.5582 49.2418 43.2 48.8 43.2Z"
            fill="#730000"
          />
          <path d="M43.2 32.8H36.8V34.4H43.2V32.8Z" fill="#730000" />
          <path d="M43.2 45.6H36.8V47.2H43.2V45.6Z" fill="#730000" />
          <path d="M34.4 36.8H32.8V43.2H34.4V36.8Z" fill="#730000" />
          <path d="M47.2 36.8H45.6V43.2H47.2V36.8Z" fill="#730000" />
        </g>

        {/* Yellow accent elements */}
        <g opacity="0.95">
          <path
            d="M49.6 19.2L56 16L62.4 19.2L56 22.4L49.6 19.2Z"
            fill="#FFBD00"
          />
          <path d="M61.6 19.2H60.8V25.6H61.6V19.2Z" fill="#FFBD00" />
          <circle cx="61.2" cy="26" r="1.2" fill="#FFBD00" />
        </g>
      </svg>
    );
  }

  // Light variant
  return (
    <svg
      {...props}
      viewBox="0 0 36 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Yellow outer circle */}
      <path
        d="M17.7408 34.7424C27.5388 34.7424 35.4816 26.965 35.4816 17.3712C35.4816 7.77735 27.5388 0 17.7408 0C7.94283 0 0 7.77735 0 17.3712C0 26.965 7.94283 34.7424 17.7408 34.7424Z"
        fill="#FFBD00"
      />

      {/* Grid lines and dots - white */}
      <g opacity="0.2">
        <path d="M6.6528 10.1332H14.0448" stroke="white" strokeWidth="0.38775" />
        <path d="M21.4368 10.1332H28.8288" stroke="white" strokeWidth="0.38775" />
        <path d="M6.6528 17.3712H12.1968" stroke="white" strokeWidth="0.38775" />
        <path d="M23.2848 17.3712H28.8288" stroke="white" strokeWidth="0.38775" />
        <path d="M6.6528 24.6092H14.0448" stroke="white" strokeWidth="0.38775" />
        <path d="M21.4368 24.6092H28.8288" stroke="white" strokeWidth="0.38775" />
        <circle cx="14.0448" cy="10.1332" r="0.724" fill="white" />
        <circle cx="21.4368" cy="10.1332" r="0.724" fill="white" />
        <circle cx="14.0448" cy="24.6092" r="0.724" fill="white" />
        <circle cx="21.4368" cy="24.6092" r="0.724" fill="white" />
      </g>

      {/* White middle panel */}
      <path
        d="M23.6544 10.1332H11.8272C11.0107 10.1332 10.3488 10.7813 10.3488 11.5808V23.1616C10.3488 23.9611 11.0107 24.6092 11.8272 24.6092H23.6544C24.4709 24.6092 25.1328 23.9611 25.1328 23.1616V11.5808C25.1328 10.7813 24.4709 10.1332 23.6544 10.1332Z"
        fill="white"
        opacity="0.95"
      />

      {/* White decorative bars */}
      <path d="M10.3488 13.0284H7.392V13.7522H10.3488V13.0284Z" fill="white" />
      <path d="M10.3488 16.6475H7.392V17.3713H10.3488V16.6475Z" fill="white" />
      <path d="M10.3488 20.2664H7.392V20.9902H10.3488V20.2664Z" fill="white" />
      <path d="M28.0896 13.0284H25.1328V13.7522H28.0896V13.0284Z" fill="white" />
      <path d="M28.0896 16.6475H25.1328V17.3713H28.0896V16.6475Z" fill="white" />
      <path d="M28.0896 20.2664H25.1328V20.9902H28.0896V20.2664Z" fill="white" />
      <path d="M14.0448 7.23804H13.3056V10.1332H14.0448V7.23804Z" fill="white" />
      <path d="M17.7408 7.23804H17.0016V10.1332H17.7408V7.23804Z" fill="white" />
      <path d="M21.4368 7.23804H20.6976V10.1332H21.4368V7.23804Z" fill="white" />
      <path d="M14.0448 24.6093H13.3056V27.5045H14.0448V24.6093Z" fill="white" />
      <path d="M17.7408 24.6093H17.0016V27.5045H17.7408V24.6093Z" fill="white" />
      <path d="M21.4368 24.6093H20.6976V27.5045H21.4368V24.6093Z" fill="white" />

      {/* Dark blocks */}
      <g>
        <path
          d="M15.8928 13.0284H13.6752C13.4711 13.0284 13.3056 13.1905 13.3056 13.3903V15.5617C13.3056 15.7616 13.4711 15.9236 13.6752 15.9236H15.8928C16.0969 15.9236 16.2624 15.7616 16.2624 15.5617V13.3903C16.2624 13.1905 16.0969 13.0284 15.8928 13.0284Z"
          fill="#730000"
        />
        <path
          d="M21.8064 13.0284H19.5888C19.3847 13.0284 19.2192 13.1905 19.2192 13.3903V15.5617C19.2192 15.7616 19.3847 15.9236 19.5888 15.9236H21.8064C22.0105 15.9236 22.176 15.7616 22.176 15.5617V13.3903C22.176 13.1905 22.0105 13.0284 21.8064 13.0284Z"
          fill="#730000"
        />
        <path
          d="M15.8928 18.8188H13.6752C13.4711 18.8188 13.3056 18.9809 13.3056 19.1807V21.3521C13.3056 21.552 13.4711 21.714 13.6752 21.714H15.8928C16.0969 21.714 16.2624 21.552 16.2624 21.3521V19.1807C16.2624 18.9809 16.0969 18.8188 15.8928 18.8188Z"
          fill="#730000"
        />
        <path
          d="M21.8064 18.8188H19.5888C19.3847 18.8188 19.2192 18.9809 19.2192 19.1807V21.3521C19.2192 21.552 19.3847 21.714 19.5888 21.714H21.8064C22.0105 21.714 22.176 21.552 22.176 21.3521V19.1807C22.176 18.9809 22.0105 18.8188 21.8064 18.8188Z"
          fill="#730000"
        />
        <path d="M19.2192 14.1141H16.2624V14.8379H19.2192V14.1141Z" fill="#730000" />
        <path d="M19.2192 19.9045H16.2624V20.6283H19.2192V19.9045Z" fill="#730000" />
        <path d="M15.1536 15.9236H14.4144V18.8188H15.1536V15.9236Z" fill="#730000" />
        <path d="M21.0672 15.9236H20.328V18.8188H21.0672V15.9236Z" fill="#730000" />
      </g>

      {/* White accent elements */}
      <g opacity="0.9">
        <path
          d="M22.176 7.96176L25.1328 6.51416L28.0896 7.96176L25.1328 9.40936L22.176 7.96176Z"
          fill="white"
        />
        <path d="M27.72 7.96176H27.3504V10.857H27.72V7.96176Z" fill="white" />
        <circle cx="27.5352" cy="11.0379" r="0.306" fill="white" />
      </g>
    </svg>
  );
}