import React, { useEffect, useState } from 'react'
import { useUserAuth } from '../../../hooks/useUserAuth';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../../components/Expense/ExpenseOverview';
import Modal from '../../../components/Modal';
import AddExpenseForm from '../../../components/Expense/AddExpenseForm';
import ExpenseList from '../../../components/Expense/ExpenseList';
import DeleteAlert from '../../../components/DeleteAlert';

const Expense = () => {
  useUserAuth();

  const [expenseData, setExpenseData] = useState([]);
    const[loading,setLoading] = useState(false)
    const[openDeleteAlert,setOpenDeleteAlert] = useState({
      show:false,
      data:null,
    });
    const [openAddExpenseModal,setOpenAddExpenseModal] = useState(false);

    const fetchExpenseDetails = async () =>{
    if(loading) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      )
      if(response.data){
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("sometjing went wrong.")
    }finally{
      setLoading(false);
    }
  };

   const handleAddExpense = async (expense) =>{
    const {category,amount,date,icon} = expense;

    if(!category.trim()){
      toast.error("category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0){
      toast.error("Amount should be a valid number greater than 0");
      return;
    }
    if (!date) {
       toast.error("Date is required.");
      return;
    }
    try{
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,{
        category,amount,date,icon
      });
      setOpenAddExpenseModal(false);
      toast.success("Expense Added Succesfully");
      fetchExpenseDetails();

    }catch{
      console.error("Error adding expense:",error.response?.data?.message || error.message);
    }
  };

    const deleteExpense = async(id) =>{
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({show:false,data:null});
      toast.success("Expense details deleted successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error in deleting expense:",
        error.response?.data?.message || error.message
      )
    }
  };

  const handleDownloadExpenseDetails =async() =>{}

   useEffect(() =>{
      fetchExpenseDetails();
  
      return () => {};
    },[]);
  return (
    <DashboardLayout activeMenu="Expense">
        <div className='my-5 mx-auto'>
          <div className='grid grid-cols-1 gap-6'>
            <div className=''>
                <ExpenseOverview
                transactions={expenseData}
                onExpenseIncome={()=> setOpenAddExpenseModal(true)}
             />
            </div>
            <ExpenseList
            transactions={expenseData}
            onDelete={(id) =>{
              setOpenDeleteAlert({show:true,data:id});
               }}
              onDownload ={handleDownloadExpenseDetails}
           />
          </div>

          <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
          >
            <AddExpenseForm onAddExpense= {handleAddExpense}/>
          </Modal>

          <Modal
        isOpen={openDeleteAlert.show}
        onClose={()=>setOpenDeleteAlert({show:false,data:null})}
        title="Delete Expense"
        >
          <DeleteAlert
          content= "Are you sure want to delete this expense?"
          onDelete={() =>deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
        </div>
    </DashboardLayout>
  )
}

export default Expense
