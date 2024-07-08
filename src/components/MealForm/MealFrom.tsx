import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {Meal} from '../../types';
import axiosApi from '../../axiosApi';

interface Props {
  onSubmit: (meal: Meal) => void;
}

const initialState: Meal = {
  time: 'Breakfast',
  description: '',
  calories: 0,
};

const MealForm: React.FC<Props> = ({ onSubmit }) => {
  const [mealMutation, setMealMutation] = useState<Meal>(initialState);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeal = async () => {
      if (id) {
        try {
          const { data: meals } = await axiosApi.get<Meal>(`/meals/${id}.json`);
          setMealMutation(meals);
        } catch (error) {
          console.error(error);
        }
      }
    };

    void fetchMeal();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setMealMutation(prev => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (id) {
      onSubmit({ ...mealMutation, id });
    } else {
      onSubmit(mealMutation);
    }
    navigate('/');
  };
  return (
    <div className="row mt-3">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Time:
          </label>
          <select
            name="time"
            required
            className="form-select border-2"
            aria-label="Disabled select example"
            onChange={handleChange}
            value={mealMutation.time}>
            <option value="Breakfast">Breakfast</option>
            <option value="Snack">Snack</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <label>
          Description:
        </label>
        <textarea
          name="text"
          required
          className="form-control border-2"
          onChange={handleChange}
          value={mealMutation.description}
        />

        <label>
          Calories:
        </label>
        <input
          type="number"
          name="calories"
          required
          className="form-control border-2"
          onChange={handleChange}
          value={mealMutation.calories}
        />

        <button type="submit" className="btn btn-dark mt-3 me-3 text-light">Save</button>
        <button type="submit" className="btn btn-danger border-2 mt-3 ">Cancel</button>
      </form>
    </div>
  );
};

export default MealForm;