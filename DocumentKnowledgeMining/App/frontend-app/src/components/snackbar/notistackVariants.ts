declare module "notistack" {
    interface VariantOverrides {
        // removes the `warning` variant
        warning: false;
        // adds `myCustomVariant` variant
        // myCustomVariant: true;
        // adds/changes `error` variant and specifies the "extra" props it takes
        error: {
            msgItems: string[];
        };
    }
}
// Avoids error on build
export {};
