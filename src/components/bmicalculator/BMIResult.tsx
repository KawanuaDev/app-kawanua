import { Card } from "@/components/ui/card";

interface BMIResultProps {
  bmi: number;
  gender: "male" | "female";
  age: number;
}

const getCategory = (bmi: number) => {
  if (bmi < 18.5)
    return {
      label: "Kurus",
      color: "hsl(var(--bmi-underweight))",
      advice: "Anda perlu menambah asupan kalori dan nutrisi.",
    };
  if (bmi < 25)
    return {
      label: "Normal",
      color: "hsl(var(--bmi-normal))",
      advice: "Berat badan Anda ideal! Pertahankan pola hidup sehat.",
    };
  if (bmi < 30)
    return {
      label: "Berlebih",
      color: "hsl(var(--bmi-overweight))",
      advice: "Pertimbangkan untuk memperbaiki pola makan dan olahraga.",
    };
  return {
    label: "Obesitas",
    color: "hsl(var(--bmi-obese))",
    advice: "Konsultasikan dengan dokter untuk program penurunan berat badan.",
  };
};

const getPointerPosition = (bmi: number) => {
  const clamped = Math.max(12, Math.min(bmi, 40));
  return ((clamped - 12) / (40 - 12)) * 100;
};

const BMIResult = ({ bmi, gender, age }: BMIResultProps) => {
  const category = getCategory(bmi);
  const position = getPointerPosition(bmi);

  const idealWeight =
    gender === "male" ? { min: 56.2, max: 75.0 } : { min: 49.0, max: 66.0 };

  return (
    <Card className="p-6 shadow-lg border-0 bg-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <p className="text-sm font-semibold text-muted-foreground mb-1">
          BMI Anda
        </p>
        <p
          className="text-6xl font-extrabold"
          style={{ color: category.color }}
        >
          {bmi}
        </p>
        <span
          className="inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold text-primary-foreground"
          style={{ backgroundColor: category.color }}
        >
          {category.label}
        </span>
      </div>

      {/* Gauge */}
      <div
        className="relative h-3 rounded-full overflow-hidden mb-6"
        style={{
          background: `linear-gradient(to right, hsl(var(--bmi-underweight)), hsl(var(--bmi-normal)) 30%, hsl(var(--bmi-overweight)) 65%, hsl(var(--bmi-obese)))`,
        }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[3px] border-card shadow-md transition-all duration-700"
          style={{
            left: `${position}%`,
            transform: `translate(-50%, -50%)`,
            backgroundColor: category.color,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground font-medium mb-6">
        <span>Kurus</span>
        <span>Normal</span>
        <span>Berlebih</span>
        <span>Obesitas</span>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Berat Ideal
          </p>
          <p className="text-lg font-bold text-foreground">
            {idealWeight.min} – {idealWeight.max} kg
          </p>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground font-medium">
            Kategori Usia
          </p>
          <p className="text-lg font-bold text-foreground">
            {age < 18 ? "Remaja" : age < 60 ? "Dewasa" : "Lansia"}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center leading-relaxed">
        💡 {category.advice}
      </p>
    </Card>
  );
};

export default BMIResult;
