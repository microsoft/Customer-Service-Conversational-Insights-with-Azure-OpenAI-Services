import React from "react";
import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";
import { Alert } from "@fluentui/react-components/unstable";
import { useTranslation } from "react-i18next";
import { DismissRegular } from "@fluentui/react-icons";

interface SnackbarSuccessProps extends CustomContentProps {}

export const SnackbarSuccess = React.forwardRef<HTMLDivElement, SnackbarSuccessProps>((props, ref) => {
    const { t } = useTranslation();
    const { id, message, ..._other } = props;

    function onClick() {
        closeSnackbar(id);
    }
    return (
        <SnackbarContent ref={ref} role="alert">
            <Alert
                intent="success"
                action={{
                    icon: <DismissRegular aria-label={t("common.dismiss")} />,
                    children: null,
                    onClick: onClick,
                    className: "!text-green-800",
                }}
                className="!bg-green-100 !text-green-800"
            >
                {message}
            </Alert>
        </SnackbarContent>
    );
});

SnackbarSuccess.displayName = "SnackbarSuccess";
