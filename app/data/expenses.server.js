import { prisma } from './database.server';

// ADD EXPENSE
export async function addExpense(expenseData, userId) {
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: Number(expenseData.amount),
        date: new Date(expenseData.date),
        User: { connect: { id: userId } },
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to add expense.');
  }
}

// FETCH EXPENSES
export async function getExpenses(userId) {
  if (!userId) {
    throw new Error('Failed to get expenses.');
  }

  try {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return expenses;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get expenses.');
  }
}

// FETCH SINGLE EXPENSE
export async function getExpense(id) {
  try {
    const expense = await prisma.expense.findFirst({ where: { id } });
    return expense;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get expense.');
  }
}

// UPDATE EXPENSE
export async function updateExpense(id, expenseData) {
  try {
    await prisma.expense.update({
      where: { id },
      data: {
        title: expenseData.title,
        amount: Number(expenseData.amount),
        date: new Date(expenseData.date),
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to update expense.');
  }
}

// DELETE EXPENSE
export async function deleteExpense(id) {
  try {
    await prisma.expense.delete({
      where: { id },
    });
  } catch (err) {
    console.error(err);
    throw new Error('Failed to delete expense.');
  }
}
