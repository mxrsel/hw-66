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

  const deleteMeal = async (id: string) => {
    setLoading(true);
    try {
      await axiosApi.delete(`/meals/${id}.json`);
      void fetchMeals();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <header className="border-bottom">
      <Header />
    </header>
    <main className="container-fluid">
      <div className="d-flex justify-content-between mb-2 mt-3 align-items-center">
        <p>Total Calories: {totalCalories}</p>
        <button className="btn btn-dark mb-3" onClick={() => navigate('/add')}>Add Meal</button>
      </div>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          meals.map(meal => (
            <div className="card border mb-3"
            key={meal.id}>
              <span className="text-dark-emphasis ms-3 mt-2">
                {meal.time} </span>
              <div className="card-body d-flex justify-content-between">
              <span>{meal.description}</span>
             <span> {meal.calories} kcal</span>
              </div>
              <div className="buttons ms-auto mb-0">
              <button className="btn btn-dark me-3 mb-2" onClick={() => navigate(`/edit/${meal.id}`)}>Edit</button>
              <button className="btn btn-danger me-3 mb-2" onClick={() => deleteMeal(meal.id!)}>Delete</button>
              </div>
            </div>
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