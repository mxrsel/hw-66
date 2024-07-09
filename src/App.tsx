import { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Meal } from './types';
import axiosApi from './axiosApi';
import MealForm from './components/MealForm/MealFrom';
import Header from './containers/Header/Header';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      const { data: meals } = await axiosApi.get('/meals.json');
      if (!meals) {
        setMeals([]);
        setTotalCalories(0);
      } else {
        const newMeals = Object.keys(meals).map((id) => ({
          ...meals[id],
          id,
        }));
        setMeals(newMeals);
        setTotalCalories(newMeals.reduce((sum, meal) => sum + meal.calories, 0));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      void fetchMeals();
    }
  }, [fetchMeals, location]);

  const addMeal = async (meal: Meal) => {
    setLoading(true);
    try {
      await axiosApi.post('/meals.json', meal);
      void fetchMeals();
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const editMeal = async (meal: Meal) => {
    if (!meal.id) return;
    setLoading(true);
    try {
      await axiosApi.put(`/meals/${meal.id}.json`, meal);
      void fetchMeals();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <header>
      <Header />
    </header>
    <main className="container-fluid">
      <button onClick={() => navigate('/add')}>Add Meal</button>
      <p>Total Calories: {totalCalories}</p>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          meals.map(meal => (
            <li key={meal.id}>
              <span className="d-flex flex-column align-items-center">
                {meal.time} -
                {meal.description} -
                {meal.calories} kcal</span>
              <button onClick={() => navigate(`/edit/${meal.id}`)}>Edit</button>
            </li>
          ))
        )}
      </ul>
      <Routes>
        <Route path="/add" element={<MealForm onSubmit={addMeal} />} />
        <Route path="/edit/:id" element={<MealForm onSubmit={editMeal} />} />
      </Routes>
    </main>
    </>
  );
};

export default App;