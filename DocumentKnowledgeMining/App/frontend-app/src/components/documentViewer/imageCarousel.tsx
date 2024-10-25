import { useEffect, useState } from "react";
import { Document } from "../../api/apiTypes/embedded";
import { GetImage } from "../../api/storageService";
import { Button, Image, Spinner } from "@fluentui/react-components";
import {
    ChevronCircleLeftRegular,
    ChevronCircleRightRegular,
    ChevronLeftFilled,
    ChevronRightFilled,
} from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

interface ImageCarouselProps {
    pageMetadata: Document[] | null;
    currentImageIndex: number;
}

export const ImageCarousel = ({ pageMetadata, currentImageIndex }: ImageCarouselProps) => {
    const { t } = useTranslation();
    
    const [images, setImages] = useState<(string | undefined)[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchImage = async (document_url: string) => {
        if (document_url) {
            const blob = await GetImage(document_url);
            const objectURL = URL.createObjectURL(blob);
            return objectURL;
        }
        return null;
    };

    useEffect(() => {
        setIsLoading(true);

        const fetchImages = async () => {
            if (pageMetadata) {
                const fetchedImages = await Promise.all(pageMetadata.map((doc) => fetchImage(doc.document_url)));
                setImages(fetchedImages.map((image) => (image === null ? undefined : image)));
                
                setIsLoading(false);
            }
            
        };

        fetchImages();
        
    }, [pageMetadata]);

    return (
        <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center justify-center">
                {isLoading ? (
                    <Spinner size="large" />
                ) : (
                    <div className="">
                        {images && images[currentImageIndex] && images.length > 0 ? (
                            <Image
                                src={images[currentImageIndex]}
                                alt="carousel"
                                block={true}
                                bordered={true}
                                fit="contain"
                                
                            />
                        ) : (
                            <>
                                <Image src="../img/illustration-desert.svg" alt="Desert illustration" />
                                <div className="text-[30px] font-semilight">{t("pages.home.no-results")}</div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
