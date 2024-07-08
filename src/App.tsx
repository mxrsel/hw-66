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
const navigate = useNavigate();

  const fetchMeals = useCallback(async () => {
    try {
      setLoading(true);
      const {data: meals} = await axios.get('/meals.json');

      if(!meals) {
        setMeals([]);
      }else {
        const newMeals = Object.keys(meals)
          .map((id) => ({
          ...meals[id],
          id,
        }));
        setMeals(newMeals);
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
      <Routes>
        <Route path="/" element={<Header/>}/>
      </Routes>
      </div>
    </header>

  <main className="container-fluid">
    <div className="header-main d-flex justify-content-around border-bottom-1">
   <p className="calories-counter">
     Total Calories: 900kcal
   </p>

      <button onClick={() => navigate('/mealAdd')}>Add New Meal</button>
    </div>

    <Routes>
      <Route path="/mealAdd" element={<MealForm onSubmit={addMeal} /> }/>
    </Routes>
  </main>
</>
)
};

export default App;