// PATHLESS LAYOUT FOR EXPENSES

import { Outlet } from '@remix-run/react';
import expnesesStyles from '@/styles/expenses.css';
import ExpensesHeader from '@/components/navigation/ExpensesHeader';

export default function ExpensesPathlessLayout() {
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}

// LOAD THE CSS THAT IS IMPORTED IN THIS COMPONENT
export function links() {
  return [{ rel: 'stylesheet', href: expnesesStyles }];
}
