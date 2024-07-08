export interface Meal {
  id?: string;
  time: 'Breakfast' | 'Snack' | 'Lunch' | 'Dinner';
  description?: string;
  calories: number
}