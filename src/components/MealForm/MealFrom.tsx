
const MealFrom = () => {
  return (
    <div className="row mt-3">
      <form>
        <div className="form-group">
          <label>
            Time:
          </label>
          <select
            name="time"
            required
            className="form-select bg-dark text-light"
            aria-label="Disabled select example">
            <option value="Breakfast">Breakfast</option>
            <option value="Snack">Snack</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <label>
          Description:
        </label>
        <input
          type="text"
          name="title"
          required
          className="form-control bg-dark text-light"
        />

        <label>
          Calories:
        </label>
        <input
          type="number"
          name="calories"
          required
          className="form-control bg-dark text-light"
        />

        <button type="submit">Save</button>
        <button type="button">Cancel</button>
      </form>
    </div>
  );
};

export default MealFrom;