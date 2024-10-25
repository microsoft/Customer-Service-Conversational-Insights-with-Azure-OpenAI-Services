import {
    BrandVariants,
    GriffelStyle,
    Theme,
    createDarkTheme,
    createLightTheme,
    makeStyles,
    shorthands,
    themeToTokensObject,
    tokens,
} from '@fluentui/react-components';

export const KMBrandRamp: BrandVariants = {
    10: '#000000', // Black
    20: '#1a1a1a',
    30: '#333333',
    40: '#4d4d4d',
    50: '#666666',
    60: '#808080',
    70: '#999999',
    80: '#b3b3b3',
    90: '#cccccc',
    100: '#e6e6e6',
    110: '#f2f2f2',
    120: '#ffffff', // White
    130: '#ffffff',
    140: '#ffffff',
    150: '#ffffff',
    160: '#ffffff',
};

export const KMLightTheme: Theme & { colorMeBackground: string } = {
    ...createLightTheme(KMBrandRamp),
    colorMeBackground: '#e8ebf9',
};

export const semanticKernelDarkTheme: Theme & { colorMeBackground: string } = {
    ...createDarkTheme(KMBrandRamp),
    colorMeBackground: '#2b2b3e',
};

export const customTokens = themeToTokensObject(KMLightTheme);

export const Breakpoints = {
    small: (style: GriffelStyle): Record<string, GriffelStyle> => {
        return { '@media (max-width: 744px)': style };
    },
};

export const ScrollBarStyles: GriffelStyle = {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        display: 'none', // For WebKit browsers
    },
    scrollbarWidth: 'none', // For Firefox
    '-ms-overflow-style': 'none', // For Internet Explorer and Edge
    '&:hover': {
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: tokens.colorScrollbarOverlay,
            visibility: 'visible',
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: tokens.colorNeutralBackground1,
            WebkitBoxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.1)',
            visibility: 'visible',
        },
    },
};

export const SharedStyles: Record<string, GriffelStyle> = {
    scroll: {
        height: '100%',
        ...ScrollBarStyles,
    },
    overflowEllipsis: {
        ...shorthands.overflow('hidden'),
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

export const useSharedClasses = makeStyles({
    informativeView: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.padding('80px'),
        alignItems: 'center',
        ...shorthands.gap(tokens.spacingVerticalXL),
        marginTop: tokens.spacingVerticalXXXL,
    },
});

export const useDialogClasses = makeStyles({
    surface: {
        paddingRight: tokens.spacingVerticalXS,
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        ...shorthands.overflow('hidden'),
        width: '100%',
    },
    paragraphs: {
        marginTop: tokens.spacingHorizontalS,
    },
    innerContent: {
        height: '100%',
        ...SharedStyles.scroll,
        paddingRight: tokens.spacingVerticalL,
    },
    text: {
        whiteSpace: 'pre-wrap',
        textOverflow: 'wrap',
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        minWidth: '175px',
    },
});
