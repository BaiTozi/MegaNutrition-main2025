import React, { useState } from 'react';
import './BMICalculator.css'; // Ако имаш CSS за стилизиране

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState('');

  const calculateBMI = () => {
    if (!weight || !height) {
      setError('Please enter your weight and height.');
      return;
    }

    // Преобразувай височината от сантиметри в метри
    const heightInMeters = height / 100;

    // Изчисли BMI
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);
    setError('');
  };

  return (
    <div className="bmi-calculator">
      <h1>BMI Calculator</h1>
      <div className="input-group">
        <label>
          Weight (kg):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Height (cm):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Enter height"
          />
        </label>
      </div>
      <button onClick={calculateBMI}>Calculate BMI</button>
      {error && <p className="error">{error}</p>}
      {bmi && (
        <div className="result">
          <h2>Your BMI е: {bmi}</h2>
          <p>
            {bmi < 18.5
              ? 'Underweight'
              : bmi < 24.9
              ? 'Normal weight'
              : bmi < 29.9
              ? 'Overweight'
              : 'Obesity'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;