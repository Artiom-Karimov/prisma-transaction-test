import { PrismaClient } from '@prisma/client';
import { manyAnimals, logTimeRange } from './utils';

describe('Test prisma transactions with Promise.all', () => {
  let client: PrismaClient;

  beforeAll(async () => {
    client = new PrismaClient();
    await client.$connect();
    await client.skill.deleteMany();
    await client.animal.deleteMany();
  });

  it('Create 1000 animals (Promise.all)', async () => {
    const animals = manyAnimals(1000);

    const start = new Date();

    await client.$transaction(async (tx) => {
      const promises = animals.map((data) => tx.animal.create({ data }));
      await Promise.all(promises);
    });

    const end = new Date();

    logTimeRange('1000 insertions with Promise.all', start, end);
  });

  it('Get > update all records', async () => {
    const start = new Date();

    let amount = 0;
    await client.$transaction(async (tx) => {
      const animals = await tx.animal.findMany();
      amount = animals.length;

      for (const a of animals) {
        a.age++;
      }

      const promises = animals.map((a) =>
        tx.animal.update({
          where: { id: a.id },
          data: { age: a.age },
        }),
      );

      await Promise.all(promises);
    });

    const end = new Date();

    logTimeRange(`${amount} updates`, start, end);
  });
});
