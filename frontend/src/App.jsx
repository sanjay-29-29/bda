import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    AGE: "",
    SEX: "",
    BMI: "",
    BP: "",
    S1: "",
    S2: "",
    S3: "",
    S4: "",
    S5: "",
    S6: ""
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="App">
      <h1>Diabetes Predictor</h1>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => {
          if (key === "SEX") {
            return (
              <div key={key}>
                <label>
                  {key}:{" "}
                  <select
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </select>
                </label>
              </div>
            );
          }

          return (
            <div key={key}>
              <label>
                {key}:{" "}
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
          );
        })}
        <button type="submit">Predict</button>
      </form>
      {prediction !== null && (
        <div className="result">
          <h2>Prediction: {prediction}</h2>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default App;