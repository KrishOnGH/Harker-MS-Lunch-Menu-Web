"use client"
import React, { useState, useEffect, useRef } from "react";
import { Calendar } from 'lucide-react';
import { format, addDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export default function Home() {
  const [isSingleView, setIsSingleView] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const entriesRef = useRef([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [year, setYear] = useState(0);
  const [dayIndex, setDayIndex] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Resize
  useEffect(() => {
    const handleResize = () => {
      const newIsSingleView = window.innerWidth < 830;
      setIsSingleView(newIsSingleView);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch current data
  useEffect(() => {
    const currentDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth() + 1);
    setDay(currentDate.getDate());
  }, []);

  // Load data
  useEffect(() => {
    const fetchScheduleData = async () => {
      if (month === 0 || day === 0 || year === 0) return;
      
      try {
        const response = await fetch(`http://localhost:5000/week/${month}/${day}/${year}`);
        if (!response.ok) {
          throw new Error('Failed to fetch schedule data');
        }
        const data = await response.json();
        setScheduleData(data);
        setIsLoading(false)
      } catch (err) {
        setError(err.message);
        setIsLoading(false)
      }
    };

    fetchScheduleData();
  }, [month, day, year]);

  // Make all entry heights equal to the height of the biggest height (UI)
  useEffect(() => {
    const updateMaxHeight = () => {
      const heights = entriesRef.current.map(ref => ref?.offsetHeight || 0);
      const newMaxHeight = Math.max(...heights);
      setMaxHeight(newMaxHeight);
    };

    updateMaxHeight();

    const resizeObserver = new ResizeObserver(updateMaxHeight);
    entriesRef.current.forEach(ref => {
      if (ref) resizeObserver.observe(ref);
    });

    return () => resizeObserver.disconnect();
  }, [isSingleView, scheduleData]);

  const handleNextButton = () => {
    if (isSingleView) {
      if (dayIndex < 4) {
        setDayIndex(prevIndex => prevIndex + 1);
      } else {
        const nextDate = new Date(year, month - 1, day + 7);
        setYear(nextDate.getFullYear());
        setMonth(nextDate.getMonth() + 1);
        setDay(nextDate.getDate());
        setDayIndex(0);
      }
    } else {
      const nextDate = new Date(year, month - 1, day + 7);
      setYear(nextDate.getFullYear());
      setMonth(nextDate.getMonth() + 1);
      setDay(nextDate.getDate());
      setDayIndex(0);
    }
  };

  const handlePrevButton = () => {
    if (isSingleView) {
      if (dayIndex > 0) {
        setDayIndex(prevIndex => prevIndex - 1);
      } else {
        const prevDate = new Date(year, month - 1, day - 7);
        setYear(prevDate.getFullYear());
        setMonth(prevDate.getMonth() + 1);
        setDay(prevDate.getDate());
        setDayIndex(4);
      }
    } else {
      const prevDate = new Date(year, month - 1, day - 7);
      setYear(prevDate.getFullYear());
      setMonth(prevDate.getMonth() + 1);
      setDay(prevDate.getDate());
      setDayIndex(0);
    }
  };

  const toggleCalendar = () => setIsCalendarOpen(!isCalendarOpen);

  const handleDateClick = (selectedDate) => {
    setYear(selectedDate.getFullYear());
    setMonth(selectedDate.getMonth() + 1);
    setDay(selectedDate.getDate());
    setIsCalendarOpen(false);
    setDayIndex(0);
  };

  const renderCalendar = () => {
    const currentDate = new Date(year, month - 1, day);
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    return (
      <div className="bg-white shadow-lg rounded-lg p-6 absolute top-full right-[-80px] mt-4 z-10 border border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setMonth(prev => prev > 1 ? prev - 1 : 12)} className="text-black hover:bg-gray-200 p-2 rounded-full">&lsaquo;</button>
          <span className="font-bold text-black text-lg">{format(currentDate, 'MMMM yyyy')}</span>
          <button onClick={() => setMonth(prev => prev < 12 ? prev + 1 : 1)} className="text-black hover:bg-gray-200 p-2 rounded-full">&rsaquo;</button>
        </div>
        <div className="grid grid-cols-7 gap-4 gap-x-10 pr-4">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center font-bold text-black">{day}</div>
          ))}
          {days.map(day => (
            <button
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`p-2 flex items-center justify-center text-sm rounded-full ${format(day, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
                ? 'bg-blue-500 text-white'
                : 'text-black hover:bg-gray-200'
              }`}
            >
              {format(day, 'd')}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) return <div className="bg-white w-screen h-screen"></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="bg-white flex flex-col items-center space-y-4 p-4 h-screen w-screen overflow-hidden">
      <div className="flex space-x-4 mb-4 relative">
        <button onClick={handlePrevButton} className="px-4 py-2 text-lg text-black rounded">&lsaquo;</button>
        <button onClick={toggleCalendar} className="p-2 rounded-full text-black">
          <Calendar size={24} />
        </button>
        <button onClick={handleNextButton} className="px-4 py-2 text-lg text-black rounded">&rsaquo;</button>
        {isCalendarOpen && renderCalendar()}
      </div>
      <div className={`flex ${isSingleView ? 'flex-col' : 'flex-row'} h-full w-full justify-center items-center space-x-[0.5vw]`}>
        {isSingleView 
          ? scheduleData.length > 0 && (
            <ScheduleEntry 
              entry={scheduleData[dayIndex]} 
              maxHeight={maxHeight} 
              ref={el => entriesRef.current[0] = el}
              date={scheduleData[dayIndex].weekStart}
              dayNum = {dayIndex}
            />
          )
        : scheduleData.map((entry, idx) => (
            <ScheduleEntry 
              key={idx} 
              entry={entry} 
              maxHeight={maxHeight} 
              ref={el => entriesRef.current[idx] = el}
              date={entry.weekStart}
              dayNum = {idx}
            />
          ))
        }
      </div>
    </main>
  );
}

const ScheduleEntry = React.forwardRef(({ entry, maxHeight, date, dayNum }, ref) => {
  date = format(addDays(parseISO(date), dayNum), 'yyyy-MM-dd');
  if (entry.lunch != 'empty') {
    return (
      <div 
        ref={ref}
        className={`bg-white border border-black shadow-md rounded-lg flex-none aspect-auto w-[14rem] md:w-[10rem] lg:w-[11rem] xl:w-[15rem] p-4 overflow-y-auto`}
        style={{ height: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
      >
        <h3 className="font-bold text-md mb-2 text-gray-800">{entry.day} <span className="text-xs">{date}</span> </h3>
        <ul>
          {entry.lunch.lunch.map((item, idx) => (
            <li key={idx} className="mb-3">
              <p className="text-xs lg:text-[0.8rem] text-gray-800 font-medium">{item.food}</p>
              <p className="text-xs text-gray-500">{item.place}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return (
      <div 
        ref={ref}
        className={`bg-white border border-black shadow-md rounded-lg flex-none w-[14rem] md:w-[10rem] lg:w-[11rem] xl:w-[15rem] p-4 overflow-y-auto`}
        style={{ height: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
      >
        <h3 className="font-bold text-md mb-2 text-gray-800">{entry.day} <span className="text-xs">{date}</span> </h3>
        <div className="flex h-[25.2rem] md:h-[18rem] lg:h-[19.8rem] xl:h-[27rem] w-full justify-center items-center text-gray-800">
          Empty
        </div>
      </div>
    )
  }
});

ScheduleEntry.displayName = 'ScheduleEntry';