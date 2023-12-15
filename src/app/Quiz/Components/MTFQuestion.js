// MTFQuestion.js
import React, { useState } from 'react';

function MTFQuestion({ question, handleOrderSubmit }) {
  const [selectedOrder, setSelectedOrder] = useState([]);

  const handleOrderChange = (index, character) => {
    const updatedOrder = [...selectedOrder];
    updatedOrder[index] = character;
    setSelectedOrder(updatedOrder);
  };

  const handleSubmit = () => {
    handleOrderSubmit(selectedOrder);
  };

  return (
    <div>
      <p>{question.question}</p>
      {question.options.map((option, index) => (
        <div key={index}>
          {option.character}: 
          <select onChange={(e) => handleOrderChange(index, e.target.value)}>
            <option value="">Select Role</option>
            {question.options.map((roleOption, roleIndex) => (
              <option key={roleIndex} value={roleOption.role}>
                {roleOption.role}
              </option>
            ))}
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Order</button>
    </div>
  );
}

export default MTFQuestion;
