import ExpenseForm from '@/components/expenses/ExpenseForm';
import Modal from '@/components/util/Modal';
import { addExpense } from '@/data/expenses.server';
import { validateExpenseInput } from '@/data/validation.server';
import { redirect } from '@remix-run/node';
import { useNavigate } from '@remix-run/react';

export default function AddExpensesPage() {
  const navigate = useNavigate();

  const closeHandler = () => {
    navigate('..');
  };

  return (
    <Modal onClose={closeHandler}>
      <ExpenseForm />
    </Modal>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  // GET ALL THE DATA INPUTTED IN AN OBJECT FORM
  const expenseData = Object.fromEntries(formData);

  try {
    validateExpenseInput(expenseData);
  } catch (err) {
    return err;
  }

  await addExpense(expenseData);
  return redirect('/expenses');
}
