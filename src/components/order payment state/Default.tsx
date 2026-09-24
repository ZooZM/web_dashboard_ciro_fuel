import { Check } from "lucide-react";
export function Default() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className=" w-[56px] h-[56px] rounded-2xl bg-[#EF3F3F] flex items-center justify-center shrink-0">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6673 33.7499V28.5092C11.6673 27.8511 11.8621 27.2077 12.2272 26.6602L15.4347 21.8489C16.1811 20.7293 16.1811 19.2706 15.4347 18.1509L12.2272 13.3397C11.8621 12.7921 11.6673 12.1488 11.6673 11.4907V6.24992M11.6673 33.7499C9.58398 33.5416 8.33398 33.3333 8.33398 33.3333M11.6673 33.7499C13.7507 33.9583 16.6673 34.1666 20.0007 34.1666C23.334 34.1666 26.2506 33.9583 28.334 33.7499M11.6673 6.24992C9.58398 6.45825 8.33398 6.66659 8.33398 6.66659M11.6673 6.24992C13.7507 6.04159 16.6673 5.83325 20.0007 5.83325C23.334 5.83325 26.2506 6.04159 28.334 6.24992M28.334 33.7499V28.5092C28.334 27.8511 28.1392 27.2077 27.7741 26.6602L24.5666 21.8489C23.8202 20.7293 23.8202 19.2706 24.5666 18.1509L27.7741 13.3397C28.1392 12.7921 28.334 12.1488 28.334 11.4907V6.24992M28.334 33.7499C30.4173 33.5416 31.6673 33.3333 31.6673 33.3333M28.334 6.24992C30.4173 6.45825 31.6673 6.66659 31.6673 6.66659" stroke="#FDE9E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                        <div className="mb-2 font-bold text-[22px]">
                            الطلب لم يصل للدفع بعد
                        </div>
                        <div>
                            <div className="flex  flex-row gap-2 ">
                                <div className='flex flex-row items-center gap-2 border-[1.5px] border-dashed border-[#9CA3AF]    px-2 py-1 rounded-lg'>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 8.66675H8.66667M6 11.3334H10M8.71427 1.68626V4.55564C8.71427 5.29202 9.31123 5.88897 10.0476 5.88897H12.8996M12.8996 5.88897L8.71427 1.68626C8.48715 1.67308 8.2492 1.66675 8 1.66675C4.17647 1.66675 3 3.15694 3 8.00008C3 12.8432 4.17647 14.3334 8 14.3334C11.8235 14.3334 13 12.8432 13 8.00008C13 7.2098 12.9687 6.5088 12.8996 5.88897Z" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>

                                    <div className="text-xs font-medium text-[#6B7280]"> سيتم تحديدها تلقائياً </div>
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

                        <p className='text-green-600 gap-2'> مسدد</p>
                    </div>
                </div>
            </div>



        </div>
    );
}
