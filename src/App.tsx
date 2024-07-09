import {Route, Routes, useNavigate} from 'react-router-dom';
import Header from './containers/Header/Header';
import React, {useCallback, useState} from 'react';
import MealForm from './components/MealForm/MealFrom';
import {Meal} from './types';
import axiosApi from './axiosApi';
import axios from 'axios';

const App: React.FC= () => {

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCalories, setTotalCalories] = useState(0);
  const navigate = useNavigate();

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      const {data: meals} = await axios.get('/meals.json');

      if(!meals) {
        setMeals([]);
        setTotalCalories(0);
      }else {
        const newMeals = Object.keys(meals)
          .map((id) => ({
          ...meals[id],
          id,
        }));
        setMeals(newMeals);
        setTotalCalories(newMeals.reduce((sum, meal) => sum + meal.calories, 0));
      }
    }finally {
      setLoading(false);
    }
  }, []);

  const addMeal = async (meal: Meal) => {
    try {
      await axiosApi.post('/meals.json', meal);
      void fetchMeals();
    }catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };
  return (
    <>
    <header>
      <div className="body">
        <Header />
      </div>
    </header>

  <main className="container-fluid">
    <div className="header-main d-flex justify-content-around border-bottom-1">
      <p className="calories-counter">
        Total Calories: {totalCalories}
      </p>

      <ul className="d-flex">
        {loading ? (
          <p>Loading...</p>
        ) : (
          meals.map(meal => (
            <li key={meal.id}>
              <span className="text-bg-secondary">{meal.time}</span>
              <span>{meal.description}</span>
              <span>{meal.calories}</span>
            </li>
          ))
        )}
      </ul>

      <button onClick={() => navigate('/mealAdd')}>Add New Meal</button>
    </div>

    <Routes>
      <Route path="/mealAdd" element={<MealForm onSubmit={addMeal}/>}/>
    </Routes>
  </main>
    </>
  )
};

export default App;