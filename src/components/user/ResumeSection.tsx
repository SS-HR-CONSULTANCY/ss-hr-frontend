import {
    uploadToS3,
    getSignedUrl,
    getUploadUrl,
    deleteUserFileFromS3,
} from '@/utils/apis/s3Api';
import { Edit } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { FileUpload } from '../ui/file-upload';
import React, { useRef, useState } from 'react';
import { updateResume } from '@/utils/apis/userApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { setResumeSignedUrl } from '@/store/slices/authSlice';
import { getCleanFileName } from '@/utils/helpers/filenameReducer';
import { resumeZodSchema, type ResumeDataForm } from '@/utils/zod/userZod';

const ResumeSection: React.FC = () => {
    
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [fileSelected, setFileSelected] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        setValue,
    } = useForm<ResumeDataForm>({
        resolver: zodResolver(resumeZodSchema),
        defaultValues: {
            resume: undefined,
        },
    });

    const handleFileChange = (file: File | null) => {
        if (file) {
            setValue('resume', file, { shouldValidate: true });
            setFileSelected(true);
        } else {
            setFileSelected(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const onSubmit: SubmitHandler<ResumeDataForm> = async (data) => {
        const file = data.resume as File;
        try {
            if (!user || !user._id) {
                toast.error('User not found');
                return;
            }

            if (file && user.resume) {
                await deleteUserFileFromS3('resumes');
            }

            const { uploadUrl, key } = await getUploadUrl(file, user._id, 'resumes');
            await uploadToS3(file, uploadUrl);

            const res = await dispatch(updateResume({ resume: key })).unwrap();

            if (res.success) {
                toast.success(res.message || 'File updated successfully');
                setFileSelected(false);
                setIsEditing(false);
                const signedUrl = await getSignedUrl(key);
                dispatch(setResumeSignedUrl(signedUrl));
            } else {
                toast.error(res.message || 'Failed to upload file');
            }
        } catch {
            setFileSelected(false);
            setIsEditing(false);
            toast.error('Failed to upload file');
        }
    };

    if (isSubmitting) {
        return (
            <div className="h-56 w-96 flex items-center justify-center">
                <div className="flex flex-col space-y-2 w-full h-full justify-center items-center">
                    <div className="shimmer w-2/5 h-2/3 shadow-md rounded-md"></div>
                    <span>Uploading...</span>
                </div>
            </div>
        );
    }

    if (user?.resume && !isEditing) {
        return (
            <div className="flex flex-col space-y-2 relative">
                <div className="space-x-2">
                    <label htmlFor="resume" className="font-medium text-sm">
                        Resume
                    </label>
                    <Button
                        variant="outline"
                        className='text-xs cursor-pointer'
                        onClick={handleEditClick}
                    >
                        <Edit className='size-4' />
                    </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md relative">
                    <div className="truncate max-w-[70%] flex flex-col gap-2">
                        <span className="text-sm font-medium">
                            {getCleanFileName(user.resume as string)}
                        </span>
                        {user.resume && /\.pdf$/i.test(user.resume as string) ? (
                            <iframe
                                src={user.resume as string}
                                className="border rounded w-full h-40"
                                title="Resume PDF"
                            />
                        ) : (
                            <span className="text-xs text-neutral-400">
                                {user.resume && /\.(doc|docx)$/i.test(user.resume as string)
                                    ? 'Preview unavailable for DOC/DOCX files.'
                                    : 'No preview available.'}
                            </span>
                        )}
                    </div>

                    <div className="flex space-x-2">
                        <a
                            href={user.resume as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View
                        </a>
                    </div>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
            </div>
        );
    }

    return (
        <div className="h-56 w-96 flex flex-col items-center justify-center">
            <FileUpload
                onChange={handleFileChange}
                error={errors.resume?.message}
                fileSelected={fileSelected}
                accept=".pdf, .doc, .docx"
            />
            {fileSelected && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting || !isValid}
                    className="cursor-pointer mt-3"
                    onClick={handleSubmit(onSubmit)}
                >
                    Upload
                </Button>
            )}
            {isEditing && (
                <Button
                    type="button"
                    variant="destructive"
                    className="cursor-pointer mt-3"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    Cancel
                </Button>
            )}
        </div>
    );
};

export default ResumeSection;

