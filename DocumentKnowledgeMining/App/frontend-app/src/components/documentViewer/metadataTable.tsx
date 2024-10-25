import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@fluentui/react-components";
import { useState } from "react";
import { Document } from "../../api/apiTypes/embedded";
import { ChevronCircleDown24Regular, ChevronCircleRight24Regular } from "@fluentui/react-icons";
import { mapMetadataKeys } from "../../utils/mapper/metadataMapper";
import { useTranslation } from "react-i18next";

interface MetadataTableProps {
    metadata: any;
}

export function MetadataTable({ metadata }: MetadataTableProps) {
    const { t } = useTranslation();

    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const mappedMetadata = mapMetadataKeys(metadata);

    function toggleRow(index: number) {
        setExpandedRows((prevExpandedRows) =>
            prevExpandedRows.includes(index)
                ? prevExpandedRows.filter((i) => i !== index)
                : [...prevExpandedRows, index]
        );
    }

    function renderRow(key: string, value: any) {
        if (value === null) {
            return [
                {
                    key: { label: key },
                    value: { label: "" },
                    isExpandable: false,
                    isExpanded: false,
                },
            ];
        }

        if (Array.isArray(value)) {
            return [
                {
                    key: { label: key },
                    value: { label: value.join(", ") },
                    isExpandable: false,
                    isExpanded: false,
                },
            ];
        }

        if (typeof value === "object" && value !== null) {
            return [
                {
                    key: { label: key },
                    value: { label: "" },
                    subValue: Object.entries(value).map(([subKey, subLabel]) => ({ subKey, subLabel })),
                    isExpandable: true,
                    isExpanded: false,
                },
            ];
        }

        return [
            {
                key: { label: key },
                value: { label: Array.isArray(value) ? value.join(", ") : value.toString() },
                isExpandable: false,
                isExpanded: false,
            },
        ];
    }

    const items = mappedMetadata
        ? Object.entries(mappedMetadata)
              .map(([key, value]) => renderRow(key, value))
              .flat()
        : [];

    return (
        <div className="max-h-[800px] overflow-auto overflow-x-hidden">
            <Table sortable aria-label="Table with controlled sort">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell style={{ fontWeight: "bold" }}>{t('components.metadata-table.key')}</TableHeaderCell>
                        <TableHeaderCell style={{ fontWeight: "bold" }}>{t('components.metadata-table.value')}</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items
                        .sort((a, b) => a.key.label.localeCompare(b.key.label))
                        .map((item, index) => {
                            if (Array.isArray(item.value.label) && item.value.label.length === 0) {
                                return null;
                            }

                            if (item.value.label === "" && !item.isExpandable) {
                                return null;
                            }

                            return (
                                <>
                                    <TableRow key={index} onClick={() => item.isExpandable && toggleRow(index)}>
                                        <TableCell>{item.key.label}</TableCell>
                                        <TableCell style={{ wordWrap: "break-word" }}>
                                            {item.isExpandable ? (
                                                expandedRows.includes(index) ? (
                                                    <ChevronCircleDown24Regular />
                                                ) : (
                                                    <ChevronCircleRight24Regular />
                                                )
                                            ) : (
                                                item.value.label
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {item.isExpandable &&
                                        expandedRows.includes(index) &&
                                        "subValue" in item &&
                                        item.subValue.map((property, propertyIndex) => (
                                            <TableRow key={`${index}-${propertyIndex}`}>
                                                <TableCell style={{ paddingLeft: "30px" }}>{property.subKey}</TableCell>
                                                <TableCell>{String(property.subLabel)}</TableCell>
                                            </TableRow>
                                        ))}
                                </>
                            );
                        })}
                </TableBody>
            </Table>
        </div>
    );
}