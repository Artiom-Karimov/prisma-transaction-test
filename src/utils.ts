import { Animal, Prisma } from '@prisma/client';
import { generateSlug } from 'random-word-slugs';

export const oneAnimal = (): Prisma.AnimalCreateInput => {
  return {
    slug: generateSlug(3),
    age: 0,
  };
};

export const manyAnimals = (amount: number): Prisma.AnimalCreateInput[] => {
  const result = new Array<Prisma.AnimalCreateInput>(amount);
  for (let i = 0; i < amount; i++) {
    result[i] = oneAnimal();
  }

  return result;
};

export const oneSkill = (
  animalId: number,
): Prisma.SkillUncheckedCreateInput => {
  const name = generateSlug(1, { partsOfSpeech: ['adjective'] });

  return {
    name,
    animalId,
  };
};

export const manySkills = (
  animalId: number,
  amount: number,
): Prisma.SkillUncheckedCreateInput[] => {
  const result = new Array<Prisma.SkillUncheckedCreateInput>(amount);
  for (let i = 0; i < amount; i++) {
    result[i] = oneSkill(animalId);
  }

  return result;
};

export const logTimeRange = (log: string, start: Date, end: Date) => {
  const diff = end.getTime() - start.getTime();
  console.debug(`${log}: ${diff.toString()} milliseconds`);
};
