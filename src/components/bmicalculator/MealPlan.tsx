import { Card } from "@/components/ui/card";
import { useState } from "react";

interface MealPlanProps {
  tdee: number;
}

interface FoodItem {
  name: string;
  cal: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  emoji: string;
  items: FoodItem[];
}

type MenuType = "regular" | "vegetarian" | "lowcarb" | "highprotein";

const menuOptions: { key: MenuType; label: string; emoji: string }[] = [
  { key: "regular", label: "Reguler", emoji: "🍚" },
  { key: "vegetarian", label: "Vegetarian", emoji: "🥬" },
  { key: "lowcarb", label: "Low Carb", emoji: "🥑" },
  { key: "highprotein", label: "High Protein", emoji: "💪" },
];

const generateMealPlan = (tdee: number, menuType: MenuType): Meal[] => {
  const breakfast = Math.round(tdee * 0.25);
  const lunch = Math.round(tdee * 0.35);
  const dinner = Math.round(tdee * 0.3);
  const snack = Math.round(tdee * 0.1);

  const scale = (base: number, target: number) => {
    const factor = target / base;
    return (val: number) => Math.round(val * factor);
  };

  if (menuType === "vegetarian") {
    const s1 = scale(430, breakfast);
    const s2 = scale(600, lunch);
    const s3 = scale(520, dinner);
    const s4 = scale(180, snack);
    return [
      {
        name: "Sarapan",
        emoji: "🌅",
        items: [
          {
            name: "Oatmeal susu almond",
            cal: s1(180),
            protein: s1(6),
            carbs: s1(30),
            fat: s1(5),
          },
          {
            name: "Smoothie pisang bayam",
            cal: s1(150),
            protein: s1(4),
            carbs: s1(28),
            fat: s1(3),
          },
          {
            name: "Roti gandum selai kacang",
            cal: s1(100),
            protein: s1(4),
            carbs: s1(12),
            fat: s1(5),
          },
        ],
      },
      {
        name: "Makan Siang",
        emoji: "☀️",
        items: [
          {
            name: "Nasi merah",
            cal: s2(150),
            protein: s2(3),
            carbs: s2(32),
            fat: s2(1),
          },
          {
            name: "Tahu & tempe bakar",
            cal: s2(200),
            protein: s2(16),
            carbs: s2(10),
            fat: s2(12),
          },
          {
            name: "Capcay sayuran",
            cal: s2(100),
            protein: s2(4),
            carbs: s2(10),
            fat: s2(5),
          },
          {
            name: "Perkedel kentang",
            cal: s2(150),
            protein: s2(4),
            carbs: s2(18),
            fat: s2(7),
          },
        ],
      },
      {
        name: "Makan Malam",
        emoji: "🌙",
        items: [
          {
            name: "Quinoa",
            cal: s3(180),
            protein: s3(7),
            carbs: s3(30),
            fat: s3(3),
          },
          {
            name: "Curry jamur & chickpea",
            cal: s3(200),
            protein: s3(10),
            carbs: s3(22),
            fat: s3(8),
          },
          {
            name: "Salad edamame",
            cal: s3(140),
            protein: s3(10),
            carbs: s3(10),
            fat: s3(6),
          },
        ],
      },
      {
        name: "Camilan",
        emoji: "🥤",
        items: [
          {
            name: "Buah potong & yoghurt",
            cal: s4(120),
            protein: s4(5),
            carbs: s4(18),
            fat: s4(3),
          },
          {
            name: "Kacang mete (10 biji)",
            cal: s4(60),
            protein: s4(2),
            carbs: s4(3),
            fat: s4(5),
          },
        ],
      },
    ];
  }

  if (menuType === "lowcarb") {
    const s1 = scale(420, breakfast);
    const s2 = scale(580, lunch);
    const s3 = scale(500, dinner);
    const s4 = scale(200, snack);
    return [
      {
        name: "Sarapan",
        emoji: "🌅",
        items: [
          {
            name: "Telur orak-arik (3 butir)",
            cal: s1(210),
            protein: s1(18),
            carbs: s1(2),
            fat: s1(15),
          },
          {
            name: "Alpukat setengah",
            cal: s1(120),
            protein: s1(1),
            carbs: s1(6),
            fat: s1(10),
          },
          {
            name: "Smoked beef",
            cal: s1(90),
            protein: s1(12),
            carbs: s1(1),
            fat: s1(4),
          },
        ],
      },
      {
        name: "Makan Siang",
        emoji: "☀️",
        items: [
          {
            name: "Dada ayam panggang",
            cal: s2(220),
            protein: s2(35),
            carbs: s2(0),
            fat: s2(8),
          },
          {
            name: "Brokoli & kembang kol kukus",
            cal: s2(80),
            protein: s2(5),
            carbs: s2(8),
            fat: s2(2),
          },
          {
            name: "Salad caesar (tanpa crouton)",
            cal: s2(150),
            protein: s2(5),
            carbs: s2(4),
            fat: s2(12),
          },
          {
            name: "Keju cheddar (2 slice)",
            cal: s2(130),
            protein: s2(8),
            carbs: s2(1),
            fat: s2(10),
          },
        ],
      },
      {
        name: "Makan Malam",
        emoji: "🌙",
        items: [
          {
            name: "Salmon panggang",
            cal: s3(250),
            protein: s3(28),
            carbs: s3(0),
            fat: s3(14),
          },
          {
            name: "Tumis zucchini & paprika",
            cal: s3(100),
            protein: s3(3),
            carbs: s3(8),
            fat: s3(6),
          },
          {
            name: "Sup krim bayam",
            cal: s3(150),
            protein: s3(5),
            carbs: s3(8),
            fat: s3(10),
          },
        ],
      },
      {
        name: "Camilan",
        emoji: "🥤",
        items: [
          {
            name: "Keju string",
            cal: s4(80),
            protein: s4(7),
            carbs: s4(1),
            fat: s4(5),
          },
          {
            name: "Kacang almond (15 biji)",
            cal: s4(120),
            protein: s4(4),
            carbs: s4(3),
            fat: s4(10),
          },
        ],
      },
    ];
  }

  if (menuType === "highprotein") {
    const s1 = scale(480, breakfast);
    const s2 = scale(650, lunch);
    const s3 = scale(560, dinner);
    const s4 = scale(210, snack);
    return [
      {
        name: "Sarapan",
        emoji: "🌅",
        items: [
          {
            name: "Telur rebus (3 butir)",
            cal: s1(210),
            protein: s1(18),
            carbs: s1(2),
            fat: s1(15),
          },
          {
            name: "Oatmeal + whey protein",
            cal: s1(180),
            protein: s1(20),
            carbs: s1(22),
            fat: s1(3),
          },
          {
            name: "Greek yoghurt",
            cal: s1(90),
            protein: s1(15),
            carbs: s1(5),
            fat: s1(0),
          },
        ],
      },
      {
        name: "Makan Siang",
        emoji: "☀️",
        items: [
          {
            name: "Nasi merah",
            cal: s2(150),
            protein: s2(3),
            carbs: s2(32),
            fat: s2(1),
          },
          {
            name: "Dada ayam bakar (200g)",
            cal: s2(260),
            protein: s2(42),
            carbs: s2(0),
            fat: s2(9),
          },
          {
            name: "Tempe goreng (3 ptg)",
            cal: s2(150),
            protein: s2(15),
            carbs: s2(8),
            fat: s2(9),
          },
          {
            name: "Tumis kangkung",
            cal: s2(90),
            protein: s2(4),
            carbs: s2(6),
            fat: s2(5),
          },
        ],
      },
      {
        name: "Makan Malam",
        emoji: "🌙",
        items: [
          {
            name: "Ikan tuna steak",
            cal: s3(250),
            protein: s3(40),
            carbs: s3(0),
            fat: s3(8),
          },
          {
            name: "Kentang rebus",
            cal: s3(130),
            protein: s3(3),
            carbs: s3(28),
            fat: s3(0),
          },
          {
            name: "Brokoli & edamame",
            cal: s3(100),
            protein: s3(10),
            carbs: s3(8),
            fat: s3(3),
          },
          {
            name: "Tahu kukus saus tiram",
            cal: s3(80),
            protein: s3(7),
            carbs: s3(4),
            fat: s3(4),
          },
        ],
      },
      {
        name: "Camilan",
        emoji: "🥤",
        items: [
          {
            name: "Protein bar",
            cal: s4(130),
            protein: s4(15),
            carbs: s4(12),
            fat: s4(4),
          },
          {
            name: "Susu protein",
            cal: s4(80),
            protein: s4(15),
            carbs: s4(3),
            fat: s4(1),
          },
        ],
      },
    ];
  }

  // Regular
  const s1 = scale(450, breakfast);
  const s2 = scale(630, lunch);
  const s3 = scale(540, dinner);
  const s4 = scale(180, snack);
  return [
    {
      name: "Sarapan",
      emoji: "🌅",
      items: [
        {
          name: "Nasi merah",
          cal: s1(150),
          protein: s1(3),
          carbs: s1(32),
          fat: s1(1),
        },
        {
          name: "Telur rebus (2 butir)",
          cal: s1(140),
          protein: s1(12),
          carbs: s1(1),
          fat: s1(10),
        },
        {
          name: "Sayur bayam tumis",
          cal: s1(60),
          protein: s1(3),
          carbs: s1(4),
          fat: s1(3),
        },
        {
          name: "Pisang",
          cal: s1(100),
          protein: s1(1),
          carbs: s1(27),
          fat: s1(0),
        },
      ],
    },
    {
      name: "Makan Siang",
      emoji: "☀️",
      items: [
        {
          name: "Nasi putih",
          cal: s2(200),
          protein: s2(4),
          carbs: s2(44),
          fat: s2(0),
        },
        {
          name: "Ayam panggang",
          cal: s2(200),
          protein: s2(30),
          carbs: s2(0),
          fat: s2(8),
        },
        {
          name: "Tumis brokoli wortel",
          cal: s2(80),
          protein: s2(3),
          carbs: s2(8),
          fat: s2(4),
        },
        {
          name: "Tempe goreng (2 ptg)",
          cal: s2(150),
          protein: s2(10),
          carbs: s2(8),
          fat: s2(9),
        },
      ],
    },
    {
      name: "Makan Malam",
      emoji: "🌙",
      items: [
        {
          name: "Nasi merah",
          cal: s3(150),
          protein: s3(3),
          carbs: s3(32),
          fat: s3(1),
        },
        {
          name: "Ikan salmon panggang",
          cal: s3(220),
          protein: s3(25),
          carbs: s3(0),
          fat: s3(12),
        },
        {
          name: "Salad sayuran",
          cal: s3(70),
          protein: s3(2),
          carbs: s3(6),
          fat: s3(4),
        },
        {
          name: "Tahu kukus",
          cal: s3(100),
          protein: s3(8),
          carbs: s3(3),
          fat: s3(5),
        },
      ],
    },
    {
      name: "Camilan",
      emoji: "🥤",
      items: [
        {
          name: "Yoghurt Greek",
          cal: s4(100),
          protein: s4(10),
          carbs: s4(6),
          fat: s4(3),
        },
        {
          name: "Kacang almond (10 biji)",
          cal: s4(80),
          protein: s4(3),
          carbs: s4(2),
          fat: s4(7),
        },
      ],
    },
  ];
};

const MealPlan = ({ tdee }: MealPlanProps) => {
  const [menuType, setMenuType] = useState<MenuType>("regular");
  const meals = generateMealPlan(tdee, menuType);
  const [openMeal, setOpenMeal] = useState<number>(0);

  return (
    <Card className="p-6 shadow-lg border-0 bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-foreground text-center mb-1">
        🍽️ Rekomendasi Menu Harian
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-5">
        Disesuaikan dengan kebutuhan {tdee} kkal/hari
      </p>

      {/* Menu type selector */}
      <div className="mb-5">
        <div className="grid grid-cols-4 gap-2">
          {menuOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setMenuType(opt.key)}
              className={`py-2.5 px-1 rounded-lg text-center transition-all duration-200 ${
                menuType === opt.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              <span className="block text-lg">{opt.emoji}</span>
              <span className="block text-[10px] font-semibold leading-tight">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {meals.map((meal, idx) => {
          const totalCal = meal.items.reduce((s, i) => s + i.cal, 0);
          const totalP = meal.items.reduce((s, i) => s + i.protein, 0);
          const totalC = meal.items.reduce((s, i) => s + i.carbs, 0);
          const totalF = meal.items.reduce((s, i) => s + i.fat, 0);
          const isOpen = openMeal === idx;

          return (
            <div
              key={`${menuType}-${idx}`}
              className={`rounded-xl overflow-hidden transition-all duration-300 ${
                isOpen ? "bg-secondary" : "bg-secondary/60 hover:bg-secondary"
              }`}
            >
              <button
                onClick={() => setOpenMeal(isOpen ? -1 : idx)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meal.emoji}</span>
                  <div className="text-left">
                    <p className="font-bold text-foreground">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {meal.items.length} item
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">
                    {totalCal} kkal
                  </span>
                  <span
                    className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    {meal.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-card rounded-lg p-3"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {item.name}
                        </span>
                        <div className="flex gap-3 text-[10px] font-semibold">
                          <span className="text-primary">{item.cal} kkal</span>
                          <span className="text-muted-foreground">
                            P:{item.protein}g
                          </span>
                          <span className="text-muted-foreground">
                            K:{item.carbs}g
                          </span>
                          <span className="text-muted-foreground">
                            L:{item.fat}g
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex justify-between items-center bg-primary/10 rounded-lg p-3">
                    <span className="text-xs font-bold text-foreground">
                      Total
                    </span>
                    <div className="flex gap-3 text-[10px] font-bold">
                      <span className="text-primary">{totalCal} kkal</span>
                      <span className="text-foreground">P:{totalP}g</span>
                      <span className="text-foreground">K:{totalC}g</span>
                      <span className="text-foreground">L:{totalF}g</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 bg-primary/10 rounded-xl p-4 text-center">
        <p className="text-xs text-muted-foreground font-semibold">
          Total Kalori Menu
        </p>
        <p className="text-2xl font-extrabold text-primary">
          {meals.reduce(
            (s, m) => s + m.items.reduce((ss, i) => ss + i.cal, 0),
            0,
          )}{" "}
          kkal
        </p>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
        ⚠️ Menu ini bersifat panduan umum. Konsultasikan dengan ahli gizi untuk
        diet yang lebih personal.
      </p>
    </Card>
  );
};

export default MealPlan;
