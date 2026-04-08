import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

const activityMultipliers: Record<
  ActivityLevel,
  { label: string; emoji: string; multiplier: number }
> = {
  sedentary: { label: "Tidak Aktif", emoji: "🪑", multiplier: 1.2 },
  light: { label: "Ringan", emoji: "🚶", multiplier: 1.375 },
  moderate: { label: "Sedang", emoji: "🏃", multiplier: 1.55 },
  active: { label: "Aktif", emoji: "💪", multiplier: 1.725 },
  veryActive: { label: "Sangat Aktif", emoji: "🏋️", multiplier: 1.9 },
};

interface CalorieCalculatorProps {
  gender: "male" | "female";
  age: number;
  weight: number;
  height: number;
  onTdeeCalculated?: (tdee: number) => void;
}

const CalorieCalculator = ({
  gender,
  age,
  weight,
  height,
  onTdeeCalculated,
}: CalorieCalculatorProps) => {
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  // Mifflin-St Jeor equation
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  const tdee = Math.round(bmr * activityMultipliers[activity].multiplier);
  onTdeeCalculated?.(tdee);
  const lose = Math.round(tdee - 500);
  const gain = Math.round(tdee + 500);

  const macros = {
    protein: Math.round((tdee * 0.3) / 4),
    carbs: Math.round((tdee * 0.45) / 4),
    fat: Math.round((tdee * 0.25) / 9),
  };

  return (
    <Card className="p-6 shadow-lg border-0 bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-foreground text-center mb-1">
        🔥 Kebutuhan Kalori Harian
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-5">
        Berdasarkan rumus Mifflin-St Jeor
      </p>

      {/* Activity selector */}
      <div className="mb-5">
        <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
          Tingkat Aktivitas
        </Label>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(activityMultipliers) as ActivityLevel[]).map((key) => {
            const { label, emoji } = activityMultipliers[key];
            return (
              <button
                key={key}
                onClick={() => setActivity(key)}
                className={`py-2 px-1 rounded-lg text-center transition-all duration-200 ${
                  activity === key
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                <span className="block text-lg">{emoji}</span>
                <span className="block text-[10px] font-semibold leading-tight">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TDEE */}
      <div className="bg-secondary rounded-xl p-5 text-center mb-4">
        <p className="text-xs text-muted-foreground font-medium">
          Kebutuhan Kalori (TDEE)
        </p>
        <p className="text-5xl font-extrabold text-primary mt-1">{tdee}</p>
        <p className="text-sm text-muted-foreground">kkal / hari</p>
      </div>

      {/* Goals */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-secondary rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
            Turun BB
          </p>
          <p className="text-xl font-bold text-bmi-underweight">{lose}</p>
          <p className="text-[10px] text-muted-foreground">kkal/hari</p>
        </div>
        <div className="bg-secondary rounded-xl p-3 text-center ring-2 ring-primary/20">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
            Pertahankan
          </p>
          <p className="text-xl font-bold text-primary">{tdee}</p>
          <p className="text-[10px] text-muted-foreground">kkal/hari</p>
        </div>
        <div className="bg-secondary rounded-xl p-3 text-center">
          <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
            Naik BB
          </p>
          <p className="text-xl font-bold text-accent">{gain}</p>
          <p className="text-[10px] text-muted-foreground">kkal/hari</p>
        </div>
      </div>

      {/* Macros */}
      <div>
        <p className="text-sm font-semibold text-muted-foreground mb-3 text-center">
          Distribusi Makronutrien
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Protein",
              value: macros.protein,
              unit: "g",
              pct: "30%",
              color: "bg-primary",
            },
            {
              label: "Karbohidrat",
              value: macros.carbs,
              unit: "g",
              pct: "45%",
              color: "bg-accent",
            },
            {
              label: "Lemak",
              value: macros.fat,
              unit: "g",
              pct: "25%",
              color: "bg-bmi-overweight",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-secondary rounded-xl p-3 text-center"
            >
              <p className="text-[10px] text-muted-foreground font-semibold">
                {m.label} ({m.pct})
              </p>
              <p className="text-lg font-bold text-foreground">
                {m.value}
                {m.unit}
              </p>
              <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${m.color}`}
                  style={{ width: m.pct }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CalorieCalculator;
