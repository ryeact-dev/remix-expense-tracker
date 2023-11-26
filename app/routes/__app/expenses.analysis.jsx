import ExpenseStatistics from '@/components/expenses/ExpenseStatistics';
import Chart from '@/components/expenses/Chart';
import { Link, useCatch, useLoaderData } from '@remix-run/react';
import { getExpenses } from '@/data/expenses.server';
import { json } from '@remix-run/node';
import Error from '@/components/util/Error';

export default function AnalysisExpensesPage() {
  const expenses = useLoaderData();
  const hasExpenses = expenses && expenses?.length > 0;

  // RENDER SECTION
  return (
    <main>
      {hasExpenses && (
        <>
          <Chart expenses={expenses} />
          <ExpenseStatistics expenses={expenses} />
        </>
      )}
      {!hasExpenses && (
        <section id='no-expenses'>
          <h1>No expenses found</h1>
          <p>
            Start <Link to='add'>adding some</Link> today
          </p>
        </section>
      )}
    </main>
  );
}

export async function loader() {
  const expenses = await getExpenses();

  if (!expenses || expenses.length === 0) {
    throw json(
      {
        message: 'Could not load expenses for the request analysis',
      },
      {
        status: 404,
        statusText: 'Expenses not found',
      }
    );
  }

  return expenses;
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  return (
    <main>
      <Error title={caughtResponse.statusText}>
        <p>
          {caughtResponse.data?.message ||
            'Something went wrong - could not load expenses.'}
        </p>
      </Error>
    </main>
  );
}
