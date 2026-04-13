import { useMemo } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { dpr, format, quality } from "@cloudinary/url-gen/actions/delivery";

interface UseCloudinaryImageProps {
    publicId: string;
    width?: number;
    height?: number;
}


export default function useCloudinaryImage({ publicId, width = 300, height = 300 }: UseCloudinaryImageProps) {

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    const cld = useMemo(() => {
        return new Cloudinary({
            cloud: {
                cloudName: cloudName
            }
        });
    }, []);

    return useMemo(() => {
        return cld
            .image(publicId)
            .resize(fill().width(width).height(height))
            .delivery(dpr("auto"))
            .delivery(quality("auto"))
            .delivery(format("auto"));
    }, [cld, publicId, width, height]);
}