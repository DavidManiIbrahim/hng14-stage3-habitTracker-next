import { createVitest } from 'vitest/node';

async function main() {
  const vitest = await createVitest({
    config: './vitest.config.ts',
  });
  await vitest.run();
}

main().catch(console.error);