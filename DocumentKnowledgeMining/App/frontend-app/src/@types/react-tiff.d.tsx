declare module "react-tiff" {
    import * as React from "react";

    interface TiffProps {
        // Define the props your component uses

        tiff?: string;
        style?: any;
        // Add any other props you need
    }

    export const TIFFViewer: React.FC<TiffProps>;
}
