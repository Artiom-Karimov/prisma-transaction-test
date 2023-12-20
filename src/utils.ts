import { Prisma } from '@prisma/client';
import { generateSlug } from 'random-word-slugs';

export const generateOne = (): Prisma.AnimalCreateInput => {
  return {
    slug: generateSlug(3),
    age: 0,
  };
};

export const generateMany = (amount: number): Prisma.AnimalCreateInput[] => {
  const result = new Array<Prisma.AnimalCreateInput>(amount);
  for (let i = 0; i < amount; i++) {
    result[i] = generateOne();
  }

  return result;
};

export const logTimeRange = (log: string, start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  console.debug(`${log}: ${diff.toString()} milliseconds`);
};
