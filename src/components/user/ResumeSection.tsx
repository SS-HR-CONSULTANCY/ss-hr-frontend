// import React from 'react';

// // export interface ResumeSectionProps {
    
// // }

// const ResumeSection: React.FC = () => {
//     return (
//         <>
//             <div className="flex flex-col space-y-2">
//                 <label className="font-medium text-sm">Resume</label>
//                 <div className="flex items-center justify-between p-3 border rounded-md">
//                     <div className="truncate max-w-[70%]">
//                         <span className="text-sm font-medium">
//                             {getCleanFileName(resumeUrl as string)}
//                         </span>
//                     </div>
//                     <div className="flex space-x-2">
//                         {resumeUrl ? (
//                             <a
//                                 href={resumeUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 hover:underline text-sm"
//                             >
//                                 View
//                             </a>
//                         ) : (
//                             <span className="text-gray-400 text-sm">Loading...</span>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             ) : (
//             <FormField<CareerData>
//                 id="resume"
//                 label="Resume"
//                 placeholder="Enter your resume link"
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 register={register}
//                 error={errors.resume?.message}
//                 readOnly={!isEditing}
//                 required={(!userCareerData && isEditing)}
//                 info="Allowed file types: .pdf, .doc, .docx"
//             />
//                         )}
//         </>

//     )
// }

// export default ResumeSection