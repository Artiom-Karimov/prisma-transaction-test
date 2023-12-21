import { PrismaClient } from '@prisma/client';
import { manyAnimals, manySkills, oneAnimal, oneSkill } from './utils';

/*
  This case proves stability of Promise.all:
  Inside of a transaction, Promise.all behaves as 
  a synchronous ooperation, but always faster than multiple awaits
 */
describe('Test relation operations with Promise.all', () => {
  let client: PrismaClient;

  beforeAll(async () => {
    client = new PrismaClient();
    await client.$connect();
    await client.skill.deleteMany();
    await client.animal.deleteMany();
  });

  it('Expect delete restriction', async () => {
    const animal = await client.animal.create({ data: oneAnimal() });
    await client.skill.create({ data: oneSkill(animal.id) });

    expect(async () =>
      client.animal.delete({ where: { id: animal.id } }),
    ).rejects.toBeTruthy();

    await client.skill.deleteMany();
    await client.animal.deleteMany();
  });

  it('Delete related entities', async () => {
    await client.animal.createMany({ data: manyAnimals(100) });
    const animals = await client.animal.findMany();
    expect(animals.length).toBe(100);

    const createSkills = animals.map((a) => manySkills(a.id, 20)).flat(1);
    await client.skill.createMany({ data: createSkills });
    const skills = await client.skill.findMany();
    expect(skills.length).toBe(2000);

    await client.$transaction(async (tx) => {
      const deleteSkills = skills.map((s) =>
        tx.skill.delete({ where: { id: s.id } }),
      );
      const deleteAnimals = animals.map((a) =>
        tx.animal.delete({ where: { id: a.id } }),
      );

      await Promise.all([...deleteSkills, ...deleteAnimals]);
    });

    const noAnimals = await client.animal.findMany();
    expect(noAnimals).toEqual([]);
  }, 20_000);
});
