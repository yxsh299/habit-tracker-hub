import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HABITO_CATEGORIES, FINAL_HABIT_DATA, HabitoCategory, PresetHabit } from '@/constants/habits';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitAdded: () => void;
}

const AddHabitDialog = ({ open, onOpenChange, onHabitAdded }: AddHabitDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HabitoCategory | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetHabit | null>(null);
  
  // Custom habit form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('anytime');
  const [occurrence, setOccurrence] = useState('daily');
  const [specificTime, setSpecificTime] = useState('');
  const [specificDay, setSpecificDay] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('');
    setTimeOfDay('anytime');
    setOccurrence('daily');
    setSpecificTime('');
    setSpecificDay('');
    setIconFile(null);
    setSelectedCategory(null);
    setSelectedPreset(null);
  };

  const uploadIcon = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('habit-icons')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading icon:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('habit-icons')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleCreateCustomHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let iconUrl = null;
      if (iconFile) {
        iconUrl = await uploadIcon(iconFile);
      }

      const habitData = {
        user_id: user.id,
        name,
        description,
        category,
        time_of_day: timeOfDay,
        occurrence,
        specific_time: specificTime || null,
        specific_day: specificDay ? parseInt(specificDay) : null,
        icon_url: iconUrl,
      };

      const { error } = await supabase
        .from('habits')
        .insert([habitData]);

      if (error) throw error;

      toast({
        title: 'Habit created! 🎉',
        description: `${name} has been added to your habits.`,
      });

      resetForm();
      onHabitAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromPreset = async () => {
    if (!user || !selectedPreset || !selectedCategory) return;

    setLoading(true);

    try {
      // Parse occurrence from preset
      const occurrenceMap: Record<string, string> = {
        'Daily': 'daily',
        'Weekly': 'weekly',
        'Monthly': 'monthly',
      };

      const habitData = {
        user_id: user.id,
        name: selectedPreset.title,
        description: selectedPreset.description,
        category: selectedCategory,
        time_of_day: 'anytime',
        occurrence: occurrenceMap[selectedPreset.time] || 'daily',
      };

      const { error } = await supabase
        .from('habits')
        .insert([habitData]);

      if (error) throw error;

      toast({
        title: 'Habit added! 🎉',
        description: `${selectedPreset.title} has been added to your habits.`,
      });

      resetForm();
      onHabitAdded();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-bg-800 border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" />
            Add New Habit
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Create a custom habit or choose from our curated collection
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="custom" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-bg-700">
            <TabsTrigger value="custom" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Custom Habit
            </TabsTrigger>
            <TabsTrigger value="preset" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Choose from Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <form onSubmit={handleCreateCustomHabit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-text-primary">Habit Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Meditation"
                    required
                    className="bg-bg-700 border-border text-text-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-text-primary">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-bg-700 border-border text-text-primary">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-700 border-border">
                      {HABITO_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="text-text-primary">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-text-primary">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your habit..."
                  className="bg-bg-700 border-border text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeOfDay" className="text-text-primary">Time of Day</Label>
                  <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                    <SelectTrigger className="bg-bg-700 border-border text-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-700 border-border">
                      <SelectItem value="morning" className="text-text-primary">Morning</SelectItem>
                      <SelectItem value="afternoon" className="text-text-primary">Afternoon</SelectItem>
                      <SelectItem value="evening" className="text-text-primary">Evening</SelectItem>
                      <SelectItem value="anytime" className="text-text-primary">Anytime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occurrence" className="text-text-primary">Occurrence *</Label>
                  <Select value={occurrence} onValueChange={setOccurrence}>
                    <SelectTrigger className="bg-bg-700 border-border text-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-bg-700 border-border">
                      <SelectItem value="daily" className="text-text-primary">Daily</SelectItem>
                      <SelectItem value="weekly" className="text-text-primary">Weekly</SelectItem>
                      <SelectItem value="monthly" className="text-text-primary">Monthly</SelectItem>
                      <SelectItem value="weekdays" className="text-text-primary">Weekdays</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {occurrence === 'daily' && (
                <div className="space-y-2">
                  <Label htmlFor="specificTime" className="text-text-primary">Specific Time (Optional)</Label>
                  <Input
                    id="specificTime"
                    type="time"
                    value={specificTime}
                    onChange={(e) => setSpecificTime(e.target.value)}
                    className="bg-bg-700 border-border text-text-primary"
                  />
                </div>
              )}

              {(occurrence === 'weekly' || occurrence === 'monthly') && (
                <div className="space-y-2">
                  <Label htmlFor="specificDay" className="text-text-primary">
                    {occurrence === 'weekly' ? 'Day of Week (1-7)' : 'Day of Month (1-31)'}
                  </Label>
                  <Input
                    id="specificDay"
                    type="number"
                    min="1"
                    max={occurrence === 'weekly' ? '7' : '31'}
                    value={specificDay}
                    onChange={(e) => setSpecificDay(e.target.value)}
                    placeholder={occurrence === 'weekly' ? 'e.g., 1 for Monday' : 'e.g., 15 for 15th'}
                    className="bg-bg-700 border-border text-text-primary"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="icon" className="text-text-primary">Habit Icon (JPG/PNG)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="icon"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                    className="bg-bg-700 border-border text-text-primary"
                  />
                  {iconFile && <Upload className="w-4 h-4 text-accent" />}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-accent-foreground"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Habit
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="preset" className="space-y-4 mt-4">
            {!selectedCategory ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {HABITO_CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant="outline"
                    className="h-20 bg-bg-700 border-border hover:bg-accent/20 hover:border-accent text-text-primary"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            ) : !selectedPreset ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">{selectedCategory}</h3>
                  <Button
                    onClick={() => setSelectedCategory(null)}
                    variant="ghost"
                    size="sm"
                    className="text-text-secondary"
                  >
                    ← Back
                  </Button>
                </div>
                <div className="grid gap-3 max-h-96 overflow-y-auto pr-2">
                  {FINAL_HABIT_DATA[selectedCategory].map((habit, index) => (
                    <Card
                      key={index}
                      className="bg-bg-700 border-border hover:border-accent cursor-pointer transition-colors"
                      onClick={() => setSelectedPreset(habit)}
                    >
                      <CardHeader className="p-4">
                        <CardTitle className="text-base text-text-primary">{habit.title}</CardTitle>
                        <CardDescription className="text-sm text-text-secondary">
                          {habit.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex gap-2 text-xs text-text-secondary">
                          <span className="bg-accent/20 text-accent px-2 py-1 rounded">{habit.time}</span>
                          <span className="bg-bg-800 px-2 py-1 rounded">{habit.occurrence}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">Confirm Habit</h3>
                  <Button
                    onClick={() => setSelectedPreset(null)}
                    variant="ghost"
                    size="sm"
                    className="text-text-secondary"
                  >
                    ← Back
                  </Button>
                </div>
                <Card className="bg-bg-700 border-border">
                  <CardHeader>
                    <CardTitle className="text-text-primary">{selectedPreset.title}</CardTitle>
                    <CardDescription className="text-text-secondary">
                      {selectedPreset.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 text-sm">
                      <span className="text-text-secondary">Category:</span>
                      <span className="text-accent font-medium">{selectedCategory}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-text-secondary">Frequency:</span>
                      <span className="text-text-primary">{selectedPreset.time}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-text-secondary">Goal:</span>
                      <span className="text-text-primary">{selectedPreset.occurrence}</span>
                    </div>
                  </CardContent>
                </Card>
                <Button
                  onClick={handleCreateFromPreset}
                  className="w-full bg-accent hover:bg-accent-hover text-accent-foreground"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add This Habit
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitDialog;
