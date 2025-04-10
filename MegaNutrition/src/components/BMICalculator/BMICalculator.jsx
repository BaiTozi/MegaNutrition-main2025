import React, { useState } from 'react';
import './BMICalculator.css'; // Ако имаш CSS за стилизиране

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [error, setError] = useState('');

  const calculateBMI = () => {
    if (!weight || !height) {
      setError('Моля, въведете тегло и височина.');
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
      <h1>BMI Калкулатор</h1>
      <div className="input-group">
        <label>
          Тегло (кг):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Въведете тегло"
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Височина (см):
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="Въведете височина"
          />
        </label>
      </div>
      <button onClick={calculateBMI}>Изчисли BMI</button>
      {error && <p className="error">{error}</p>}
      {bmi && (
        <div className="result">
          <h2>Вашият BMI е: {bmi}</h2>
          <p>
            {bmi < 18.5
              ? 'Поднормено тегло'
              : bmi < 24.9
              ? 'Нормално тегло'
              : bmi < 29.9
              ? 'Наднормено тегло'
              : 'Затлъстяване'}
          </p>
        </div>
      )}
    </div>
  );
};

export default BMICalculator;