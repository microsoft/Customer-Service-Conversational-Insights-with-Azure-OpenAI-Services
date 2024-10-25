import React from "react";
import { useTranslation } from "react-i18next";

export function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-neutral-50">
            <ul className="_max-content-width mx-auto flex flex-wrap justify-end gap-6 whitespace-nowrap p-8 text-[12px] text-neutral-700 md:px-24">
                <li>{t("components.footer.copyright", { year: currentYear })}</li>
            </ul>
        </footer>
    );
}