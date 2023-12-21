import { PrismaClient } from '@prisma/client';
import { manyAnimals, logTimeRange } from './utils';

/* 
  These cases test prisma transaction behavior with multiple awaits in sequence.
  These are always ~30% slower than Promise.all because of 
  async/await overhead.
*/
describe('Test prisma transactions with sequential await', () => {
  let client: PrismaClient;

  beforeAll(async () => {
    client = new PrismaClient();
    await client.$connect();
    await client.skill.deleteMany();
    await client.animal.deleteMany();
  });

  it('Create 1000 animals (sequential await)', async () => {
    const animals = manyAnimals(1000);

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
