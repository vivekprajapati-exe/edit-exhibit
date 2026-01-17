import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
    bucket: string;
    folder?: string;
    accept?: string;
    maxSizeMB?: number;
    onUploadComplete: (filePath: string) => void;
    currentFilePath?: string;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    bucket,
    folder = '',
    accept = '*/*',
    maxSizeMB = 100,
    onUploadComplete,
    currentFilePath,
    label = 'Upload File'
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<string | null>(currentFilePath || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const uploadFile = async (file: File) => {
        if (!file) return;

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
            toast({
                title: "File too large",
                description: `Please upload a file smaller than ${maxSizeMB}MB.`,
                variant: "destructive",
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            // Generate a unique filename
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filename = `${timestamp}-${sanitizedName}`;
            const filePath = folder ? `${folder}/${filename}` : filename;

            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            clearInterval(progressInterval);

            if (uploadError) throw uploadError;

            setUploadProgress(100);
            setUploadedFile(filePath);
            onUploadComplete(filePath);

            toast({
                title: "Success",
                description: "File uploaded successfully!",
            });
        } catch (error: any) {
            console.error('Error uploading file:', error);
            toast({
                title: "Upload failed",
                description: error.message || "Failed to upload file",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            // Reset progress after a short delay
            setTimeout(() => setUploadProgress(0), 1000);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadFile(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemove = () => {
        setUploadedFile(null);
        onUploadComplete('');
    };

    return (
        <div className="space-y-3">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept={accept}
                disabled={uploading}
            />

            {uploadedFile ? (
                <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{uploadedFile}</p>
                        <p className="text-xs text-muted-foreground">File uploaded successfully</p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={handleRemove}
                        className="text-muted-foreground hover:text-destructive"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full border-dashed py-8"
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2 w-full">
                            <Upload className="w-6 h-6 animate-pulse" />
                            <span>Uploading... {uploadProgress}%</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <File className="w-6 h-6" />
                            <span>{label}</span>
                        </div>
                    )}
                </Button>
            )}

            {uploading && (
                <Progress value={uploadProgress} className="h-2" />
            )}
        </div>
    );
};

export default FileUpload;
