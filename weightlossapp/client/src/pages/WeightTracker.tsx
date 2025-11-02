import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getWeightEntries, saveWeightEntry, getUserProfile } from '@/lib/storage';
import { getTodayString } from '@/lib/insights';
import type { WeightEntry } from '@/lib/types';
import { Plus, TrendingDown, Target, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function WeightTracker() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [profile, setProfile] = useState(getUserProfile());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    notes: '',
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = getWeightEntries().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setEntries(allEntries);
  };

  const handleAddEntry = () => {
    if (!newEntry.weight) {
      toast.error('Please enter your weight');
      return;
    }

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: getTodayString(),
      weight: parseFloat(newEntry.weight),
      notes: newEntry.notes,
    };

    saveWeightEntry(entry);
    loadEntries();
    setNewEntry({ weight: '', notes: '' });
    setIsDialogOpen(false);
    toast.success('Weight logged successfully!');
  };

  if (!profile) return null;

  const latestWeight = entries.length > 0 ? entries[0].weight : profile.currentWeight;
  const weightLost = profile.currentWeight - latestWeight;
  const weightToGo = latestWeight - profile.targetWeight;
  const progressPercent = ((profile.currentWeight - latestWeight) / (profile.currentWeight - profile.targetWeight)) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weight Tracker</h1>
            <p className="text-gray-600 mt-1">Monitor your progress over time</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Weight
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Your Weight</DialogTitle>
                <DialogDescription>
                  Record your current weight to track your progress
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 165.0"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="How are you feeling? Any observations?"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleAddEntry} className="w-full">
                  Save Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-900">Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{latestWeight.toFixed(1)}</div>
              <p className="text-xs text-blue-700 mt-1">lbs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-900 flex items-center">
                <TrendingDown className="mr-2 h-4 w-4" />
                Weight Lost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{weightLost.toFixed(1)}</div>
              <p className="text-xs text-green-700 mt-1">lbs</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-900 flex items-center">
                <Target className="mr-2 h-4 w-4" />
                To Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{weightToGo.toFixed(1)}</div>
              <p className="text-xs text-purple-700 mt-1">lbs remaining</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-900">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{Math.max(0, progressPercent).toFixed(0)}%</div>
              <p className="text-xs text-orange-700 mt-1">of goal achieved</p>
            </CardContent>
          </Card>
        </div>

        {/* Weight History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Weight History
            </CardTitle>
            <CardDescription>Your weight log entries</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No entries yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Start logging your weight to track your progress over time.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Your First Entry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">
                          {entry.weight.toFixed(1)} lbs
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {entry.notes && (
                        <p className="mt-2 text-sm text-gray-600">{entry.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

