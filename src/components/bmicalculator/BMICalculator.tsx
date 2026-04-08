import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BMIResult from "./BMIResult";
import CalorieCalculator from "./CalorieCalculator";
import MealPlan from "./MealPlan";

type Gender = "male" | "female";

const BMICalculator = () => {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number>(0);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      setBmi(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const reset = () => {
    setAge("");
    setWeight("");
    setHeight("");
    setBmi(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Kalkulator <span className="text-primary">BMI</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Ketahui indeks massa tubuhmu secara instan
        </p>
      </div>

      <div className="w-full max-w-xl grid gap-6">
        <Card className="p-6 shadow-lg border-0 bg-card">
          {/* Gender */}
          <div className="mb-5">
            <Label className="text-sm font-semibold text-muted-foreground mb-2 block">
              Jenis Kelamin
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    gender === g
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {g === "male" ? "🧑 Laki-laki" : "👩 Perempuan"}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="grid gap-4">
            <div>
              <Label
                htmlFor="age"
                className="text-sm font-semibold text-muted-foreground"
              >
                Usia (tahun)
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="mt-1 h-12 text-lg bg-secondary border-0 focus-visible:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="weight"
                  className="text-sm font-semibold text-muted-foreground"
                >
                  Berat (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="mt-1 h-12 text-lg bg-secondary border-0 focus-visible:ring-primary"
                />
              </div>
              <div>
                <Label
                  htmlFor="height"
                  className="text-sm font-semibold text-muted-foreground"
                >
                  Tinggi (cm)
                </Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="mt-1 h-12 text-lg bg-secondary border-0 focus-visible:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={reset}
              className="h-12 text-base font-semibold"
            >
              Reset
            </Button>
            <Button
              onClick={calculate}
              className="h-12 text-base font-semibold bg-primary text-primary-foreground hover:opacity-90"
            >
              Hitung BMI
            </Button>
          </div>
        </Card>

        {bmi !== null && (
          <>
            <BMIResult bmi={bmi} gender={gender} age={parseInt(age) || 0} />
            <CalorieCalculator
              gender={gender}
              age={parseInt(age) || 25}
              weight={parseFloat(weight) || 70}
              height={parseFloat(height) || 170}
              onTdeeCalculated={setTdee}
            />
            {tdee > 0 && <MealPlan tdee={tdee} />}
          </>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;
