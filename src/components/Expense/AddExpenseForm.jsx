import React, { useState } from 'react'
import EmojiPikerPopup from '../EmojiPikerPopup';
import Input from '../inputs/input';

const AddExpenseForm = ({onAddExpense}) => {
     const [income,setIncome] = useState({
            category:"",
            amount:"",
            date:"",
            icon:"",
        })
    const handleChange = (key,value) => setIncome({...income,[key]:value});
  return (
    <div>
        <EmojiPikerPopup
        icon={income.icon}
        onSelect={(selectIcon) =>handleChange("icon",selectIcon)}
        />
        <Input
      value={income.category}
      onChange={({target}) => handleChange("category",target.value)}
      label="Category"
      placeholder="Rent,bill,etc"
      type="text"
      />
       <Input
      value={income.amount}
      onChange={({target}) => handleChange("amount",target.value)}
      label="Amount"
      placeholder=""
      type="number"
      />
       <Input
      value={income.date}
      onChange={({target}) => handleChange("date",target.value)}
      label="Date"
      placeholder=""
      type="date"
      />
      <div className='flex justify-end mt-6'>
        <button
        type="button"
        className='add-btn add-btn-fill'
        onClick={() =>onAddExpense(income)}
        >
           Add Expense
        </button>
      </div>
    </div>
  )
}

export default AddExpenseForm