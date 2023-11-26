import { useNavigate } from '@remix-run/react';
import ExpenseForm from '@/components/expenses/ExpenseForm';
import Modal from '@/components/util/Modal';
import { validateExpenseInput } from '@/data/validation.server';
import { redirect } from '@remix-run/node';
import { deleteExpense, updateExpense } from '@/data/expenses.server';
// import { getExpense } from '@/data/expenses.server';

export default function ExpensesDetailsPage() {
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

// export async function loader({ params }) {
//   const expenseId = params.id;
//   const expense = await getExpense(expenseId);
//   return expense;
// }

export async function action({ params, request }) {
  const expenseId = params.id;

  if (request.method === 'PATCH') {
    const formData = await request.formData();
    // GET ALL THE DATA INPUTTED IN AN OBJECT FORM
    const expenseData = Object.fromEntries(formData);

    try {
      validateExpenseInput(expenseData);
    } catch (err) {
      return err;
    }

    await updateExpense(expenseId, expenseData);
    return redirect('/expenses');
  } else if (request.method === 'DELETE') {
    await deleteExpense(expenseId);
    return redirect('/expenses');
  }
}
