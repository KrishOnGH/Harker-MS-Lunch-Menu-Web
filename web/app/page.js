"use client"
import React, { useState, useEffect, useRef } from "react";

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
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/week/${3}/${14}/${2024}`);
        if (!response.ok) {
          throw new Error('Failed to fetch schedule data');
        }
        const data = await response.json();
        console.log(data)
        setScheduleData(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="flex flex-col items-center space-y-4 p-4 h-screen w-screen overflow-hidden">
      <div className="flex space-x-4 mb-4">
        <button onClick={handlePrevButton} className="px-4 py-2 bg-blue-500 text-white rounded">{isSingleView ? 'Previous Day' : 'Previous Week'}</button>
        <button onClick={handleNextButton} className="px-4 py-2 bg-blue-500 text-white rounded">{isSingleView ? 'Next Day' : 'Next Week'}</button>
      </div>
      <div className={`flex ${isSingleView ? 'flex-col' : 'flex-row'} h-full w-full justify-center items-center space-x-[0.5vw]`}>
        {isSingleView 
          ? scheduleData.length > 0 && (
              <ScheduleEntry 
                key={dayIndex}
                entry={scheduleData[dayIndex]} 
                maxHeight={maxHeight} 
                ref={el => entriesRef.current[0] = el}
              />
            )
          : scheduleData.map((entry, idx) => (
              <ScheduleEntry 
                key={idx} 
                entry={entry} 
                maxHeight={maxHeight} 
                ref={el => entriesRef.current[idx] = el}
              />
            ))
        }
      </div>
    </main>
  );
}

const ScheduleEntry = React.forwardRef(({ entry, maxHeight }, ref) => {
  if (entry.lunch != 'empty') {
    return (
      <div 
        ref={ref}
        className={`bg-white shadow-md rounded-lg flex-none aspect-auto w-[14rem] md:w-[10rem] lg:w-[11rem] xl:w-[15rem] p-4 overflow-y-auto`}
        style={{ height: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
      >
        <h3 className="font-bold text-lg mb-2 text-gray-800">{entry.day}</h3>
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
        className={`bg-white shadow-md rounded-lg flex-none w-[14rem] md:w-[10rem] lg:w-[11rem] xl:w-[15rem] p-4 overflow-y-auto`}
        style={{ height: maxHeight > 0 ? `${maxHeight}px` : 'auto' }}
      >
        <h3 className="font-bold text-lg mb-2 text-gray-800">{entry.day}</h3>
        <div className="flex h-[25.2rem] md:h-[18rem] lg:h-[19.8rem] xl:h-[27rem] w-full justify-center items-center text-gray-800">
          Empty
        </div>
      </div>
    )
  }
});

ScheduleEntry.displayName = 'ScheduleEntry';