import React from "react";
import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";
import { Alert } from "@fluentui/react-components/unstable";
import { useTranslation } from "react-i18next";
import { DismissRegular } from "@fluentui/react-icons";

interface SnackbarErrorProps extends CustomContentProps {
    msgItems: string[];
}

export const SnackbarError = React.forwardRef<HTMLDivElement, SnackbarErrorProps>((props, ref) => {
    const { t } = useTranslation();
    const { id, message, msgItems, ..._other } = props;

    function onClick() {
        closeSnackbar(id);
    }
    return (
        <SnackbarContent ref={ref} role="alert">
            <Alert
                intent="error"
                action={{
                    icon: <DismissRegular aria-label={t("common.dismiss")} />,
                    children: null,
                    onClick: onClick,
                    className: "!text-red-800",
                }}
                className="!bg-red-100 !text-red-800"
            >
                {msgItems && Array.isArray(msgItems) ? (
                    <div className="my-3">
                        {msgItems.map((s, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 ? (
                                    <>
                                        <br />
                                        {s}
                                    </>
                                ) : (
                                    s
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    message
                )}
            </Alert>
        </SnackbarContent>
    );
});

SnackbarError.displayName = "SnackbarError";
