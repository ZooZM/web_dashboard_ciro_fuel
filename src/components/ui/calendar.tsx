import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full flex justify-center", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-bold text-slate-800",
        nav: "space-x-1 flex items-center",
        button_previous: "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-100",
        button_next: "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 flex items-center justify-center rounded-md hover:bg-slate-100",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex w-full justify-between",
        weekday: "text-slate-500 rounded-md w-9 font-normal text-[0.8rem]",
        week: "flex w-full mt-2 justify-between",
        day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-slate-700"
        ),
        range_end: "day-range-end",
        selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white font-bold",
        today: "bg-slate-100 text-slate-900",
        outside:
          "day-outside text-slate-400 opacity-50 aria-selected:bg-slate-100/50 aria-selected:text-slate-500 aria-selected:opacity-30",
        disabled: "text-slate-400 opacity-50 cursor-not-allowed",
        range_middle:
          "aria-selected:bg-blue-50 aria-selected:text-blue-900 aria-selected:rounded-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === 'left') {
            return <ChevronLeft className="h-4 w-4" {...props} />;
          }
          return <ChevronRight className="h-4 w-4" {...props} />;
        }
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
