"use client"
import React from "react";
import { useState, useEffect, useRef } from "react";

const scheduleData = [
  {
    "day": "Monday",
    "lunch": {
      "date": "2024-05-13T00:00:00.000Z",
      "lunch": [
        {
          "food": "Korean BBQ Bowl\nSteamed Rice\nVegetable Stir Fry",
          "place": "Chef's Grill"
        },
        {
          "food": "(VEG, GF) Spice Trade Beans and Bulgur\n(VEG, GF) Tuscan Portobello Stew",
          "place": "Veggie Cafe"
        },
        {
          "food": "Deli Bar Served Daily\n(GF) Carving Station: Grilled Chicken with Berry Basil Sauce",
          "place": "Bistro Garden"
        },
        {
          "food": "Closed for AP Testing",
          "place": "Mexican Fiesta"
        },
        {
          "food": "Clam Strips with Lemon Dill Coleslaw",
          "place": "Chowda House"
        },
        {
          "food": "(VEG) Veggie Burger Served Daily\n(GF) Pork Sandwich with Whole Grain Dijonnaise",
          "place": "Burgerland"
        },
        {
          "food": "(GF) Meat Sauce",
          "place": "Taste of Italy"
        }
      ]
    }
  },
  {
    "day": "Tuesday",
    "lunch": {
      "date": "2024-05-14T00:00:00.000Z",
      "lunch": [
        {
          "food": "(GF) Cilantro Lime Chicken\n(GF) Southwest Corn and Bean Medley\n(GF) Jalapeno Cornbread",
          "place": "Chef's Grill"
        },
        {
          "food": "(VEG, GF) Tropical Fusion Salad with Spicy Tortilla Strips\n(VEG, GF) Vegetarian Pepperoni Pizza Dip in Bread Bowl",
          "place": "Veggie Cafe"
        },
        {
          "food": "Deli Bar Served Daily\n(GF) Carving Station: Harissa Spiced Lamb",
          "place": "Bistro Garden"
        },
        {
          "food": "Closed for AP Testing",
          "place": "Mexican Fiesta"
        },
        {
          "food": "Haddock Polanaise with Honey Parsley Butter",
          "place": "Chowda House"
        },
        {
          "food": "(VEG) Veggie Burger Served Daily\n(GF) Warm BBQ Chicken Wrap",
          "place": "Burgerland"
        },
        {
          "food": "(GF) Sicilian Lentil Pasta Sauce",
          "place": "Taste of Italy"
        }
      ]
    }
  },
  {
    "day": "Wednesday",
    "lunch": {
      "date": "2024-05-15T00:00:00.000Z",
      "lunch": [
        {
          "food": "Sweet and Sour Pork\nVeggie Lo Mein\nSauteed Bok Choy",
          "place": "Chef's Grill"
        },
        {
          "food": "(VEG, GF) Garlicky Quinoa and Lentils with Ricotta\n(VEG, GF) Potato Samosas",
          "place": "Veggie Cafe"
        },
        {
          "food": "Deli Bar Served Daily\n(GF) Carving Station: Steak Fajitas with Mango Avocado Salsa",
          "place": "Bistro Garden"
        },
        {
          "food": "Closed for AP Testing",
          "place": "Mexican Fiesta"
        },
        {
          "food": "(GF) Mexican Shrimp Cocktails with Saltine Crackers",
          "place": "Chowda House"
        },
        {
          "food": "(VEG) Veggie Burger Served Daily\n(GF) Turkey Reuben",
          "place": "Burgerland"
        },
        {
          "food": "(GF) Creamy Pasta Pomodoro",
          "place": "Taste of Italy"
        }
      ]
    }
  },
  {
    "day": "Thursday",
    "lunch": {
      "date": "2024-05-16T00:00:00.000Z",
      "lunch": [
        {
          "food": "(GF) Mojo Marinated Beef\n(GF) Yuca Fries\n(GF) Roasted Asparagus",
          "place": "Chef's Grill"
        },
        {
          "food": "(VEG, GF) Tofu Rancheros\n(VEG, GF) Bean and Cheese Burritos",
          "place": "Veggie Cafe"
        },
        {
          "food": "Deli Bar Served Daily\nCarving Station: Vietnamese Caramel Pork with Butterfly Bao Buns",
          "place": "Bistro Garden"
        },
        {
          "food": "Closed for AP Testing",
          "place": "Mexican Fiesta"
        },
        {
          "food": "(GF) Smoked Salmon Gyro with Tzatziki and Greek Salsa",
          "place": "Chowda House"
        },
        {
          "food": "(VEG) Veggie Burger Served Daily\n(GF) Pancake Breakfast Sandwich with Raspberry Maple Syrup",
          "place": "Burgerland"
        },
        {
          "food": "(GF) Coconut Tomato Sauce",
          "place": "Taste of Italy"
        }
      ]
    }
  },
  {
    "day": "Friday",
    "lunch": {
      "date": "2024-05-17T00:00:00.000Z",
      "lunch": [
        {
          "food": "Oven Baked Fried Chicken\nLoaded Mashed Potatoes\nWilted Mixed Greens",
          "place": "Chef's Grill"
        },
        {
          "food": "(VEG, GF) Aloo Tamatar Sabzi with Garlic Naan\n(VEG, GF) Crustless Caprese Quiche",
          "place": "Veggie Cafe"
        },
        {
          "food": "Deli Bar Served Daily\n(GF) Carving Station: Pesto Turkey with Lemon Orzo",
          "place": "Bistro Garden"
        },
        {
          "food": "Closed for AP Testing",
          "place": "Mexican Fiesta"
        },
        {
          "food": "(GF) Cod with Cilantro Vinaigrette over Creamed Corn",
          "place": "Chowda House"
        },
        {
          "food": "(VEG) Veggie Burger Served Daily\n(GF) Chef\u2019s Choice",
          "place": "Burgerland"
        },
        {
          "food": "(GF) Sweet Corn Pasta with Basil",
          "place": "Taste of Italy"
        }
      ]
    }
  }
]

export default function Home() {
  const [isSingleView, setIsSingleView] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const entriesRef = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      const newIsSingleView = window.innerWidth < 830;
      setIsSingleView(newIsSingleView);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  }, [isSingleView]);

  return (
    <main className="flex flex-col items-center space-y-4 p-4 h-screen w-screen overflow-hidden">
      <div className={`flex ${isSingleView ? 'flex-col' : 'flex-row'} h-full w-full justify-center items-center space-x-[0.5vw]`}>
        {scheduleData.slice(0, isSingleView ? 1 : 5).map((entry, idx) => (
          <ScheduleEntry 
            key={idx} 
            entry={entry} 
            maxHeight={maxHeight} 
            ref={el => entriesRef.current[idx] = el}
          />
        ))}
      </div>
    </main>
  );
}

const ScheduleEntry = React.forwardRef(({ entry, maxHeight }, ref) => {
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
});

ScheduleEntry.displayName = 'ScheduleEntry';