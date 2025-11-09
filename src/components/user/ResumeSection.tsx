import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { FileUpload } from '../ui/file-upload';
import React, { useEffect, useState } from 'react';
import { updateResume } from '@/utils/apis/userApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { updateResumeKey } from '@/store/slices/authSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { setResumeSignedUrl } from '@/store/slices/userSlice';
import { getCleanFileName } from '@/utils/helpers/filenameReducer';
import { resumeZodSchema, type ResumeDataForm } from '@/utils/validationSchema';
import { deleteFileFromS3, getSignedUrl, getUploadUrl, uploadToS3 } from '@/utils/apis/s3Api';

const ResumeSection: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { resumeSignedUrl } = useSelector((state: RootState) => state.user);
    const [fileSelected, setFileSelected] = useState<boolean>(false);

    const {
        handleSubmit,
        formState: { isSubmitting },
        setValue,
        formState: { errors },
    } = useForm<ResumeDataForm>({
        resolver: zodResolver(resumeZodSchema),
        defaultValues: {
            resume: undefined,
        },
    });

    useEffect(() => {
        if (resumeSignedUrl) return;
        const fetchResumeUrl = async () => {
            if (user?.resume) {
                const signedUrl = await getSignedUrl(user.resume as string);
                dispatch(setResumeSignedUrl(signedUrl));
            }
        };
        fetchResumeUrl();
    }, [user, dispatch, resumeSignedUrl]);

    const handleFileChange = (file: File | null) => {
        setValue("resume", file as File, { shouldValidate: true });
        setFileSelected(!!file);
    };

    const onSubmit: SubmitHandler<ResumeDataForm> = async (data) => {
        const file = data.resume as File;
        try {
            if (!user) {
                toast.error("User not found");
                return;
            }
            if (file && user?.resume) {
                await deleteFileFromS3(user.resume as string);
            }

            const { uploadUrl, key } = await getUploadUrl(file, user._id, "resumes");
            dispatch(updateResumeKey(key));
            await uploadToS3(file, uploadUrl);

            const res = await dispatch(updateResume({ resume: key })).unwrap();

            if (res.success) {
                toast.success(res.message || "File updated successfully");
                setFileSelected(false);
                const signedUrl = await getSignedUrl(key);
                dispatch(setResumeSignedUrl(signedUrl));
            } else {
                toast.error(res.message || "Failed to upload file");
            }
        } catch {
            setFileSelected(false);
            toast.error("Failed to upload file");
        }
    };

    // Show shimmer while submitting
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

    if (user?.resume && resumeSignedUrl) {
        return (
            <div className="flex flex-col space-y-2">
                <label className="font-medium text-sm">Resume</label>
                <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="truncate max-w-[70%] flex flex-col gap-2">
                        <span className="text-sm font-medium">
                            {getCleanFileName(resumeSignedUrl)}
                        </span>
                        {resumeSignedUrl && /\.pdf$/i.test(resumeSignedUrl) ? (
                            <iframe
                                src={resumeSignedUrl}
                                className="border rounded w-full h-40"
                                title="Resume PDF"
                            />
                        ) : (
                            <span className="text-xs text-neutral-400">
                                {resumeSignedUrl && /\.(doc|docx)$/i.test(resumeSignedUrl)
                                    ? "Preview unavailable for DOC/DOCX files."
                                    : "No preview available."}
                            </span>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <a
                            href={resumeSignedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-56 w-96 flex flex-col items-center justify-center">
            <FileUpload
                onChange={handleFileChange}
                error={errors.resume?.message}
                fileSelected={fileSelected}
            />
            {fileSelected && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    className="cursor-pointer mt-3"
                    onClick={handleSubmit(onSubmit)}
                >
                    Upload
                </Button>
            )}
        </div>
    );
};

export default ResumeSection;
