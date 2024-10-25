import React, { MouseEventHandler } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogContent,
    DialogOpenChangeData,
    DialogOpenChangeEvent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

interface DialogConfirmProps {
    open: boolean;
    onOpenChange?: (event: DialogOpenChangeEvent, data: DialogOpenChangeData) => void;
    title?: string;
    children: React.ReactNode;
    onOk: MouseEventHandler<HTMLElement>;
}

export function DialogConfirm({ open, onOpenChange, title, children, onOk }: DialogConfirmProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>{children}</DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">{t("common.no")}</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={onOk}>
                            {t("common.yes")}
                        </Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
