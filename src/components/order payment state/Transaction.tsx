import { Check } from "lucide-react";
export function Transaction() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className=" w-[56px] h-[56px] rounded-2xl bg-[#1E5FFF] flex items-center justify-center shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M33.3327 23.3333L6.66602 23.3333L16.666 33.3333" stroke="#E7EEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.66602 16.6667H33.3327L23.3327 6.66675" stroke="#E7EEFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="mb-2">
                            <div className="text-[20px] mb-2 font-black text-slate-900">
                                تحويل بنكي
                            </div>
                            <div className="flex flex-row gap-2 ">
                                <div className='flex flex-row items-center gap-2 bg-purple-100  px-2 py-1 rounded-lg'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.3327 6.58997C12.3327 6.58997 12.666 7.74071 12.666 9.66663C12.666 11.5926 12.4068 13.2777 12.1475 13.5185C11.8882 13.7592 10.0734 14 7.99935 14C5.92527 14 4.11046 13.7592 3.8512 13.5185C3.59194 13.2777 3.33268 11.5926 3.33268 9.66663C3.33268 7.74071 3.66602 6.58997 3.66602 6.58997M3.66602 6.58997C4.438 6.63194 6.12616 6.66663 7.99935 6.66663C9.87254 6.66663 11.5607 6.63194 12.3327 6.58997C12.5376 6.57883 12.6779 6.56717 12.7401 6.55552C13.0364 6.49996 13.3327 6.11107 13.3327 5.66663C13.3327 5.22218 13.0364 4.83329 12.7401 4.77774C12.4438 4.72218 10.3697 4.66663 7.99935 4.66663C5.62898 4.66663 3.5549 4.72218 3.25861 4.77774C2.96231 4.83329 2.66602 5.22218 2.66602 5.66663C2.66602 6.11107 2.96231 6.49996 3.25861 6.55552C3.32076 6.56717 3.46112 6.57883 3.66602 6.58997ZM7.90995 4.56661C8.27603 3.20067 10.374 0.834528 11.3741 2.5666C12.3741 4.29877 9.27603 4.93272 7.90995 4.56661ZM8.04089 4.56661C7.67482 3.20067 5.57681 0.834528 4.57679 2.5666C3.57673 4.29877 6.67482 4.93272 8.04089 4.56661Z" stroke="#8B3FE8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <div className="text-xs font-medium text-[#6B7280]"> كاش باك (0.05%) — 466 ر.س </div>
                                </div>
                                <div className='flex flex-row items-center gap-2 bg-green-100 px-2 py-1 rounded-lg'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M5.33333 10.6667L10.6667 5.33333M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM11.3333 10C11.3333 10.7364 10.7364 11.3333 10 11.3333C9.26362 11.3333 8.66667 10.7364 8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667C10.7364 8.66667 11.3333 9.26362 11.3333 10ZM7.33333 6C7.33333 6.73638 6.73638 7.33333 6 7.33333C5.26362 7.33333 4.66667 6.73638 4.66667 6C4.66667 5.26362 5.26362 4.66667 6 4.66667C6.73638 4.66667 7.33333 5.26362 7.33333 6Z" stroke="#0E8A44" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <div className="text-xs font-medium text-[#6B7280]">عمولة المنصة (0.07%) — 2,097 ر.س</div>
                                </div>
                                <div className='flex flex-row items-center gap-2 bg-[#F9FAFB]  px-2 py-1 rounded-lg'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.99992 1.66675V4.33341M5.99992 1.66675V4.33341M13.655 7.66675H2.34481M2.34481 7.66675C2.337 7.88064 2.33325 8.10278 2.33325 8.33341C2.33325 12.6667 3.66659 14.0001 7.99992 14.0001C12.3333 14.0001 13.6666 12.6667 13.6666 8.33341C13.6666 8.10278 13.6628 7.88064 13.655 7.66675C13.5161 3.86193 12.1026 2.66675 7.99992 2.66675C3.89722 2.66675 2.48365 3.86193 2.34481 7.66675Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <div className="text-xs font-medium text-[#6B7280]">مسدد في 12/12/2026, 10:10 ص </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="text-sm font-bold "
                >

                    <div className="text-xl font-bold">46.600 <span className="text-sm font-normal">ر.س</span></div>
                    <div className="flex mt-2 flex-row gap-1 items-center justify-center px-2 py-1 rounded-lg shadow-sm bg-green-50">
                        <Check className="text-green-600 w-4 h-4" />

                        <p className='text-green-600 gap-2'> مؤكد</p>
                    </div>
                </div>
            </div>



        </div>
    );
}
