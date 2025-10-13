import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;
    const decimals = 2;
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
    
    return `${size} ${units[i]}`;
};

const FileUploader = ({onFileSelect}: FileUploaderProps) => {
    const [file, setfile] = useState<File | null>(null);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setfile(file);
        onFileSelect?.(file);
    }, [onFileSelect])
    const maxFileSize = 20 * 1024 * 1024; // 20 MB
    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
    onDrop,
    multiple: false,
    accept: {'application/pdf': ['.pdf']},
    maxSize: 20 * 1024 * 1024, // 20 MB
    })

  return (
    <div className='w-full gradient-border'>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            
            {file?(
                <div className='uploader-selected-file' onClick={(e) => e.stopPropagation()}>
                    <div className='flex items-center space-x-3'>
                        <img src="/images/pdf.png" alt="pdf" className='size-10'/>
                        <div>
                            <p className='text-sm font-medium text-gray-700 truncate max-w-xs'>
                                {file.name}
                            </p>
                            <p className='text-sm text-gray-500'>
                                {formatSize(file.size)}
                            </p>
                        </div>
                    </div>
                    <button className='p-2 cursor-pointer' onClick={(e) => {
                        onFileSelect?.(null);
                    }}>
                        <img src="/icons/cross.svg" alt="remove" className='size-4'/>
                    </button>
                </div>
            ):(
                <div>
                    <div className='mx-auto w-16 h-16 flex items-center justify-center mb-2'>
                        <img src="/icons/info.svg" alt="upload" className='size-20'/>
                    </div>
                    <p className='text-lg text-gray-500'>
                        <span className='font-semibold'>
                            Click to Upload
                        </span> or Drag and Drop
                    </p>
                    <p className='text-lg text-gray-500'>PDF(MAX {formatSize(maxFileSize)})</p>
                </div>
            )}
        </div>

    </div>
  )
}

export default FileUploader