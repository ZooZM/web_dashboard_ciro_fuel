import { Check } from "lucide-react";
export function LimitCard() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className=" w-[56px] h-[56px] rounded-2xl bg-[#FF5810] flex items-center justify-center shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6667 23.3333H20M34.843 16.6667H5.15706M34.843 16.6667C34.5627 13.7444 33.948 11.5209 33.3333 11.1111C32.5 10.5556 26.6667 10 20 10C13.3333 10 7.5 10.5556 6.66667 11.1111C6.05197 11.5209 5.4373 13.7444 5.15706 16.6667M34.843 16.6667C34.9427 17.7061 35 18.8339 35 20C35 24.4444 34.1667 28.3333 33.3333 28.8889C32.5 29.4444 26.6667 30 20 30C13.3333 30 7.5 29.4444 6.66667 28.8889C5.83333 28.3333 5 24.4444 5 20C5 18.8339 5.05739 17.7061 5.15706 16.6667" stroke="#FEEEDF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="mb-2">
                            <p className='text-black text-[16px] font-bold'>الدفع بالحد الأئتماني</p>
                        </div>
                        <div>
                            <div className="flex  flex-row gap-2 ">

                                <div className='flex flex-row items-center bg-orange-100 gap-2 px-2 py-1 rounded-lg shadow-sm '>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.66667 9.33333H8M13.9372 6.66667H2.06283M13.9372 6.66667C13.8251 5.49775 13.5792 4.60836 13.3333 4.44444C13 4.22222 10.6667 4 8 4C5.33333 4 3 4.22222 2.66667 4.44444C2.42079 4.60836 2.17492 5.49775 2.06283 6.66667M13.9372 6.66667C13.9771 7.08244 14 7.53357 14 8C14 9.77778 13.6667 11.3333 13.3333 11.5556C13 11.7778 10.6667 12 8 12C5.33333 12 3 11.7778 2.66667 11.5556C2.33333 11.3333 2 9.77778 2 8C2 7.53357 2.02295 7.08244 2.06283 6.66667" stroke="#FF5810" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <div className="text-xs font-semibold text-[#FF5810]">متبقي 84,000 من 150,000 ر.س</div>
                                    <svg width="93" height="8" viewBox="0 0 93 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_1437_11846)">
                                            <rect width="93" height="8" rx="4" fill="white" />
                                            <rect x="46.5" width="46.5" height="8" rx="4" fill="#FF5810" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1437_11846">
                                                <rect width="93" height="8" rx="4" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="text-sm font-bold "
                >

                    <div className="text-xl font-black">46.600 <span className="text-sm font-normal">ر.س</span></div>
                    <div className="flex mt-2 flex-row gap-1 items-center justify-center px-2 py-1 rounded-lg shadow-sm bg-green-50">
                      <Check className="text-green-600 w-4 h-4"/>
                        <p className='text-green-600 gap-2 text-xs font-semibold'> تم الخصم</p>
                    </div>
                </div>
            </div>



        </div>
    );
}
