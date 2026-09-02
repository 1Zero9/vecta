const unavailable = async () => null;

/**
 * Worker-safe Prisma boundary for the Sites build.
 *
 * Vecta is local-first in this milestone. Sites cannot run the optional native
 * SQLite client, so the API routes receive null and use their documented
 * browser-storage fallback. Standard Next.js builds continue to use Prisma.
 */
export class PrismaClient {
  user = {
    findUnique: unavailable,
    upsert: unavailable,
  };

  consentLog = {
    create: unavailable,
  };
}
