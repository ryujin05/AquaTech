import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { services, servicesBySlug } from "../data/services.mjs";

const configuredDatabaseUrl = process.env.DATABASE_URL?.trim();

export const isDatabaseConfigured = Boolean(configuredDatabaseUrl);
export const databaseMode = isDatabaseConfigured ? "postgresql" : "not-configured";

const prisma = isDatabaseConfigured
  ? new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    })
  : null;

const normalize = (value) => String(value ?? "").trim();

const slugify = (value) =>
  normalize(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const resolveServiceIdentity = (serviceInterestInput) => {
  const rawValue = normalize(serviceInterestInput);

  if (!rawValue) {
    return { slug: "general-consulting", name: "General consulting" };
  }

  const serviceBySlug = servicesBySlug.get(rawValue);
  if (serviceBySlug) {
    return { slug: serviceBySlug.slug, name: serviceBySlug.name };
  }

  const lowered = rawValue.toLowerCase();
  const serviceByName = services.find((service) => service.name.toLowerCase() === lowered);
  if (serviceByName) {
    return { slug: serviceByName.slug, name: serviceByName.name };
  }

  const generatedSlug = slugify(rawValue) || `service-${Date.now()}`;
  return { slug: generatedSlug, name: rawValue };
};

export const syncServiceCatalog = async () => {
  if (!prisma) {
    return;
  }

  await Promise.all(
    services.map((service) =>
      prisma.serviceInterest.upsert({
        where: { slug: service.slug },
        update: { name: service.name },
        create: {
          slug: service.slug,
          name: service.name,
        },
      }),
    ),
  );
};

export const createLeadRecord = async (payload, context = {}) => {
  if (!prisma) {
    throw new Error("POSTGRES_NOT_CONFIGURED");
  }

  const serviceIdentity = resolveServiceIdentity(payload.service_interest);

  const serviceInterest = await prisma.serviceInterest.upsert({
    where: { slug: serviceIdentity.slug },
    update: { name: serviceIdentity.name },
    create: {
      slug: serviceIdentity.slug,
      name: serviceIdentity.name,
    },
  });

  return prisma.lead.create({
    data: {
      fullName: normalize(payload.full_name),
      email: normalize(payload.email).toLowerCase(),
      serviceInterestText: normalize(payload.service_interest),
      serviceInterestId: serviceInterest.id,
      message: normalize(payload.message) || null,
      sourcePage: normalize(payload.source_page) || null,
      ipAddress: normalize(context.ipAddress) || null,
      userAgent: normalize(context.userAgent) || null,
    },
  });
};

export const createNewsletterRecord = async (payload) => {
  if (!prisma) {
    throw new Error("POSTGRES_NOT_CONFIGURED");
  }

  const email = normalize(payload.email).toLowerCase();
  const sourcePage = normalize(payload.source_page) || null;

  return prisma.newsletterSubscriber.upsert({
    where: { email },
    update: sourcePage ? { sourcePage } : {},
    create: {
      email,
      sourcePage,
    },
  });
};

export const getDatabaseHealth = async () => {
  if (!prisma) {
    return {
      configured: false,
      connected: false,
      mode: databaseMode,
      detail: "DATABASE_URL is not configured",
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      configured: true,
      connected: true,
      mode: databaseMode,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      mode: databaseMode,
      detail: error.message,
    };
  }
};

export const disconnectDatabase = async () => {
  if (!prisma) {
    return;
  }

  await prisma.$disconnect();
};
