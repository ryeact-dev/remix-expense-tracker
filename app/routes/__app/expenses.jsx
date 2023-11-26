//  /expenses => shared layout
// Expenses Index Layout

import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { FaPlus, FaDownload } from 'react-icons/fa';

import ExpensesList from '@/components/expenses/ExpensesList';
import { getExpenses } from '@/data/expenses.server';

export default function ExpensesLayout() {
  // DATA FROM useLoaderData IS ALREADY A SERIALIZE JSON FILE
  const expenses = useLoaderData();

  const hasExpenses = expenses && expenses.length > 0;

  // RENDER SECTION
  return (
    <>
      <Outlet />
      <main>
        <section id='expenses-actions'>
          <Link to='add'>
            <FaPlus />
            <span>Add Expense</span>
          </Link>
          <a href='/expenses/raw'>
            <FaDownload /> <span>Load Raw Data</span>
          </a>
        </section>
        {hasExpenses && <ExpensesList expenses={expenses} />}
        {!hasExpenses && (
          <section id='no-expenses'>
            <h1>No expenses found</h1>
            <p>
              Start <Link to='add'>adding some</Link> today
            </p>
          </section>
        )}
      </main>
    </>
  );
}

// LOADER FUNCTION TO BE CALLED BY THE MAIN FUNCTION ABOVE TO GET THE DATA
export async function loader() {
  const expenses = await getExpenses();

  // if (!expenses || expenses.length === 0) {
  //   throw json(
  //     { message: 'Could not find any expenses' },
  //     { status: 404, statusText: 'No expenses found' }
  //   );
  // }

  return expenses;
}

// export function CatchBoundary() {
//   return <p>Error</p>;
// }
