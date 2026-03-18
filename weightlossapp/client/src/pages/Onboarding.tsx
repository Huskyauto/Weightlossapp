import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveUserProfile, setOnboardingComplete } from '@/lib/storage';
import { calculateBMR, calculateTDEE, calculateDailyCalorieGoal, calculateWaterGoal } from '@/lib/insights';
import type { UserProfile } from '@/lib/types';
import { ArrowRight, Target, Check } from 'lucide-react';

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    currentWeight: '',
    targetWeight: '',
    height: '',
    age: '',
    gender: 'female' as 'male' | 'female' | 'other',
    activityLevel: 'moderate' as UserProfile['activityLevel'],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleComplete = () => {
    const currentWeight = parseFloat(formData.currentWeight);
    const targetWeight = parseFloat(formData.targetWeight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);

    const bmr = calculateBMR(currentWeight, height, age, formData.gender);
    const tdee = calculateTDEE(bmr, formData.activityLevel);
    const dailyCalorieGoal = calculateDailyCalorieGoal(tdee);
    const dailyWaterGoal = calculateWaterGoal(currentWeight);

    const profile: UserProfile = {
      name: formData.name,
      currentWeight,
      targetWeight,
      height,
      age,
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      startDate: new Date().toISOString(),
      dailyCalorieGoal,
      dailyWaterGoal,
    };

    saveUserProfile(profile);
    setOnboardingComplete();
    setLocation('/dashboard');
  };

  const isStep1Valid = formData.name.trim() !== '';
  const isStep2Valid =
    formData.currentWeight !== '' &&
    formData.targetWeight !== '' &&
    parseFloat(formData.currentWeight) > parseFloat(formData.targetWeight);
  const isStep3Valid =
    formData.height !== '' && formData.age !== '' && parseInt(formData.age) > 0;

  const genderOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' },
    { value: 'other', label: 'Other' },
  ];

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: 'light', label: 'Light', desc: 'Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
    { value: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', desc: 'Intense exercise daily' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Welcome to Weight Loss Companion
          </CardTitle>
          <CardDescription className="text-lg">
            Let's set up your personalized weight loss journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 w-16 rounded-full transition-colors ${
                  s <= step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!isStep1Valid}
                className="w-full"
                size="lg"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Weight Goals */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <Label htmlFor="currentWeight">Current Weight (lbs)</Label>
                <Input
                  id="currentWeight"
                  type="number"
                  placeholder="e.g., 176"
                  value={formData.currentWeight}
                  onChange={(e) => handleInputChange('currentWeight', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="e.g., 154"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  className="mt-2"
                />
              </div>
              {formData.currentWeight && formData.targetWeight && (
                <p className="text-sm text-gray-600">
                  Goal: Lose {(parseFloat(formData.currentWeight) - parseFloat(formData.targetWeight)).toFixed(1)} lbs
                </p>
              )}
              <div className="flex space-x-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid}
                  className="flex-1"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Physical Info */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 67"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('gender', option.value)}
                      className={`relative flex items-center justify-center px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.gender === option.value
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {formData.gender === option.value && (
                        <Check className="absolute top-1 right-1 h-3 w-3 text-green-600" />
                      )}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!isStep3Valid}
                  className="flex-1"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Activity Level */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div>
                <Label>Activity Level</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {activityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('activityLevel', option.value)}
                      className={`relative flex flex-col items-start px-4 py-3 rounded-lg border-2 text-left transition-all ${
                        formData.activityLevel === option.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      {formData.activityLevel === option.value && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-green-600" />
                      )}
                      <span className={`text-sm font-medium ${
                        formData.activityLevel === option.value ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                      <span className={`text-xs ${
                        formData.activityLevel === option.value ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {option.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Based on your information, we'll calculate your personalized daily calorie
                  and water goals to help you reach your target weight safely and effectively.
                </p>
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1">
                  Get Started! 🎉
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
