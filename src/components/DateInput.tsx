
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DateInputProps {
  value: Date;
  onChange: (date: Date) => void;
  isDarkMode: boolean;
}

export default function DateInput({ value, onChange, isDarkMode }: DateInputProps) {
  const [day, setDay] = useState<string>(value.getDate().toString());
  const [month, setMonth] = useState<string>((value.getMonth() + 1).toString());
  const [year, setYear] = useState<string>(value.getFullYear().toString());

  const updateDate = (newDay?: string, newMonth?: string, newYear?: string) => {
    const updatedDay = newDay || day;
    const updatedMonth = newMonth || month;
    const updatedYear = newYear || year;

    const date = new Date(
      parseInt(updatedYear),
      parseInt(updatedMonth) - 1,
      parseInt(updatedDay)
    );
    
    if (!isNaN(date.getTime())) {
      onChange(date);
    }
  };

  const handleDayChange = (value: string) => {
    setDay(value);
    updateDate(value);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    updateDate(undefined, value);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    updateDate(undefined, undefined, value);
  };

  // Generate options for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString());

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-2">
        <Label 
          htmlFor="dob"
          className={`${isDarkMode ? 'text-white' : 'text-gray-700'}`}
        >
          Date of Birth
        </Label>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label 
              htmlFor="day"
              className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Day
            </Label>
            <Select value={day} onValueChange={handleDayChange}>
              <SelectTrigger 
                id="day"
                className={cn(
                  "w-full",
                  isDarkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""
                )}
              >
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}>
                {days.map(d => (
                  <SelectItem key={d} value={d} className={isDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label 
              htmlFor="month"
              className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Month
            </Label>
            <Select value={month} onValueChange={handleMonthChange}>
              <SelectTrigger 
                id="month"
                className={cn(
                  "w-full",
                  isDarkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""
                )}
              >
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className={isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""}>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value} className={isDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label 
              htmlFor="year"
              className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Year
            </Label>
            <Select value={year} onValueChange={handleYearChange}>
              <SelectTrigger 
                id="year"
                className={cn(
                  "w-full",
                  isDarkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : ""
                )}
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className={cn(
                "max-h-[15rem] overflow-y-auto",
                isDarkMode ? "bg-gray-800 border-gray-700 text-white" : ""
              )}>
                {years.map(y => (
                  <SelectItem key={y} value={y} className={isDarkMode ? "text-white hover:bg-gray-700 focus:bg-gray-700" : ""}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Preview of selected date */}
      <motion.div 
        className={`text-center py-2 px-4 rounded-md ${
          isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-gray-100 text-gray-700'
        }`}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        Selected: {months.find(m => m.value === month)?.label} {day}, {year}
      </motion.div>
    </motion.div>
  );
}
