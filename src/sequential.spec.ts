import { PrismaClient } from '@prisma/client';
import { generateMany, logTimeRange } from './utils';

describe('Test prisma transactions with sequential await', () => {
  let client: PrismaClient;

  beforeAll(async () => {
    client = new PrismaClient();
    await client.$connect();
    await client.animal.deleteMany();
  });

  it('Create 1000 animals (sequential await)', async () => {
    const animals = generateMany(1000);

    const start = new Date();

    await client.$transaction(async (tx) => {
      for (const data of animals) {
        await tx.animal.create({ data });
      }
    });

    const end = new Date();

    logTimeRange('1000 insertions in sequence', start, end);
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

      for (const a of animals) {
        await tx.animal.update({ where: { id: a.id }, data: { age: a.age } });
      }
    });

    const end = new Date();

    logTimeRange(`${amount} updates`, start, end);
  });
});
