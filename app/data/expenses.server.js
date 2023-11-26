import { prisma } from './database.server';

export async function addExpense(expenseData) {
  try {
    return await prisma.expense.create({
      data: {
        title: expenseData.title,
        amount: Number(expenseData.amount),
        date: new Date(expenseData.date),
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error('Failed to add expense.');
  }
}

export async function getExpenses() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
    return expenses;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get expenses.');
  }
}

export async function getExpense(id) {
  try {
    const expense = await prisma.expense.findFirst({ where: { id } });
    return expense;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to get expense.');
  }
}

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
