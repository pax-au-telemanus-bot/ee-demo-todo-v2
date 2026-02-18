import { seed } from "./seed";
import { closeDb } from "./db";

try {
  const count = seed();
  console.log(`✅ Database seeded with ${count} tasks`);
} catch (error) {
  console.error("❌ Seed failed:", error);
  process.exit(1);
} finally {
  closeDb();
}
