import { useEffect, useState } from "react";
import { Input } from "../../../components/ui/input";


interface OrderImageUploaderProps {
    onFileSelect: (file: File) => void;
    intialPreviewUrl?: string;
}

export default function OrderImageUploader({
    onFileSelect,
    intialPreviewUrl
}: OrderImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(intialPreviewUrl ?? null);

    useEffect(() => {
        setPreview(intialPreviewUrl || null);
    }, [intialPreviewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));
        onFileSelect(file); // pass file back to parent
    };


    return (
        <div className="">
            <Input type="file" accept="image/*" onChange={handleFileChange}  className="w-full" />
            {preview && <img src={preview} alt="Preview" className="mt-2 object-cover" />}
        </div>
    );
}