import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import {
  createLeadRecord,
  createNewsletterRecord,
  disconnectDatabase,
  getDatabaseHealth,
  isDatabaseConfigured,
  syncServiceCatalog,
} from "./db/repository.mjs";
import { services, servicesBySlug } from "./data/services.mjs";
import { pricingCatalog } from "./data/pricing.mjs";
import { caseStudies, caseStudiesBySlug } from "./data/case-studies.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const port = Number(process.env.PORT || 8787);
const siteUrl = (process.env.SITE_URL || `http://localhost:${port}`).replace(/\/+$/, "");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(express.json({ limit: "120kb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  "/assets",
  express.static(path.join(rootDir, "assets"), {
    maxAge: "7d",
  }),
);
app.use(
  "/legacy",
  express.static(path.join(rootDir, "legacy"), {
    maxAge: "1d",
  }),
);
app.get("/site.webmanifest", (_req, res) => {
  res.sendFile(path.join(rootDir, "site.webmanifest"));
});
app.get("/banggia.txt", (_req, res) => {
  res.sendFile(path.join(rootDir, "banggia.txt"));
});
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(rootDir, "robots.txt"));
});
app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(rootDir, "sitemap.xml"));
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    message: "Bạn gửi request quá nhanh. Vui lòng thử lại sau 1 phút.",
  },
});

app.use("/api", apiLimiter);

const leadSchema = z.object({
  full_name: z.string().trim().min(2, "Vui lòng nhập họ và tên.").max(80),
  email: z.string().trim().email("Email không hợp lệ.").max(120),
  service_interest: z.string().trim().min(2, "Vui lòng chọn dịch vụ.").max(80),
  message: z.string().trim().max(1500).optional().default(""),
  source_page: z.string().trim().max(240).optional().default("/"),
});

const newsletterSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ.").max(120),
  source_page: z.string().trim().max(240).optional().default("/"),
});

const toCanonicalUrl = (currentPath) => `${siteUrl}${currentPath === "/" ? "/" : currentPath}`;

const baseViewData = (currentPath, overrides = {}) => ({
  currentPath,
  canonicalUrl: toCanonicalUrl(currentPath),
  robotsMeta: "index,follow",
  siteUrl,
  services,
  serviceNavItems: services.map((service) => ({
    name: service.name,
    slug: service.slug,
  })),
  ...overrides,
});

const renderPage = (res, currentPath, template, pageData = {}) => {
  res.render(template, baseViewData(currentPath, pageData));
};

const getRequestIpAddress = (req) => {
  const forwarded = req.headers["x-forwarded-for"];

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }

  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }

  return req.socket.remoteAddress || "unknown";
};

app.get("/api/health", async (_req, res) => {
  const database = await getDatabaseHealth();
  const isHealthy = !database.configured || database.connected;

  return res.status(isHealthy ? 200 : 503).json({
    ok: isHealthy,
    service: "aquatech-backend",
    uptimeSeconds: Math.round(process.uptime()),
    now: new Date().toISOString(),
    database,
  });
});

app.get("/api/services", (_req, res) => {
  res.json({
    ok: true,
    count: services.length,
    items: services.map((service) => ({
      slug: service.slug,
      name: service.name,
      teaser: service.teaser,
      category: service.category,
      price: service.price,
      timeline: service.timeline,
    })),
  });
});

app.post("/api/leads", async (req, res) => {
  const parsed = leadSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return res.status(400).json({
      ok: false,
      message: firstIssue?.message || "Dữ liệu không hợp lệ.",
    });
  }

  if (!isDatabaseConfigured) {
    return res.status(503).json({
      ok: false,
      message: "Hệ thống tạm thời chưa kết nối PostgreSQL. Vui lòng cấu hình DATABASE_URL.",
    });
  }

  const payload = parsed.data;

  try {
    const leadRecord = await createLeadRecord(payload, {
      ipAddress: getRequestIpAddress(req),
      userAgent: req.headers["user-agent"] || "unknown",
    });

    return res.status(201).json({
      ok: true,
      id: leadRecord.id,
      message: "Đã nhận thông tin. AquaTech sẽ liên hệ với bạn sớm nhất.",
    });
  } catch (error) {
    const isMissingConfig = error instanceof Error && error.message === "POSTGRES_NOT_CONFIGURED";

    if (isMissingConfig) {
      return res.status(503).json({
        ok: false,
        message: "Hệ thống tạm thời chưa kết nối PostgreSQL. Vui lòng cấu hình DATABASE_URL.",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Không thể lưu lead lúc này. Vui lòng thử lại sau.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.post("/api/newsletter", async (req, res) => {
  const parsed = newsletterSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return res.status(400).json({
      ok: false,
      message: firstIssue?.message || "Dữ liệu không hợp lệ.",
    });
  }

  if (!isDatabaseConfigured) {
    return res.status(503).json({
      ok: false,
      message: "Hệ thống tạm thời chưa kết nối PostgreSQL. Vui lòng cấu hình DATABASE_URL.",
    });
  }

  const payload = parsed.data;

  try {
    await createNewsletterRecord(payload);

    return res.status(201).json({
      ok: true,
      message: "Đăng ký newsletter thành công.",
    });
  } catch (error) {
    const isMissingConfig = error instanceof Error && error.message === "POSTGRES_NOT_CONFIGURED";

    if (isMissingConfig) {
      return res.status(503).json({
        ok: false,
        message: "Hệ thống tạm thời chưa kết nối PostgreSQL. Vui lòng cấu hình DATABASE_URL.",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Không thể đăng ký newsletter lúc này.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.get("/lien-he", (req, res) => {
  renderPage(res, req.path, "pages/contact", {
    pageTitle: "Liên hệ | AquaTech",
    pageDescription:
      "Gửi nhu cầu để AquaTech đề xuất hướng triển khai website, app, automation và backend phù hợp ngân sách.",
    pageKeywords: "liên hệ triển khai, báo giá website, báo giá app mobile, tư vấn backend",
  });
});

app.get("/dich-vu", (req, res) => {
  renderPage(res, req.path, "pages/services", {
    pricingCatalog,
    pageTitle: "Dịch vụ | AquaTech",
    pageDescription:
      "Tổng hợp đầy đủ dịch vụ AquaTech với bảng giá chi tiết: website, app mobile, desktop software, scraping, automation và banner design.",
    pageKeywords: "dịch vụ công nghệ, web app, mobile app, automation, scraping, bảng giá",
  });
});

app.get("/bang-gia", (_req, res) => {
  res.redirect(301, "/dich-vu#pricing-catalog");
});

app.get("/pricing", (_req, res) => {
  res.redirect(301, "/dich-vu#pricing-catalog");
});


app.get("/about", (req, res) => {
  renderPage(res, req.path, "pages/about", {
    pageTitle: "About AquaTech | Team và cách vận hành",
    pageDescription:
      "Tìm hiểu cách AquaTech vận hành: team cross-functional, nguyên tắc delivery và định hướng xây sản phẩm theo kết quả kinh doanh.",
    pageKeywords: "about aquatech, đội ngũ product engineering, quy trình triển khai",
  });
});

app.get("/quy-trinh", (req, res) => {
  renderPage(res, req.path, "pages/process", {
    pageTitle: "Quy trình triển khai | AquaTech",
    pageDescription:
      "Khung triển khai 4 bước của AquaTech từ discovery đến handover, giúp dự án đi nhanh nhưng vẫn kiểm soát được chất lượng.",
    pageKeywords: "quy trình triển khai, discovery, sprint delivery, handover",
  });
});

app.get("/cong-nghe", (req, res) => {
  renderPage(res, req.path, "pages/technology", {
    pageTitle: "Công nghệ sử dụng | AquaTech",
    pageDescription:
      "Toàn bộ stack công nghệ AquaTech đang dùng cho frontend, backend, data, automation và vận hành sản phẩm.",
    pageKeywords: "stack công nghệ, frontend backend, automation, data pipeline",
  });
});

app.get("/case-studies", (req, res) => {
  renderPage(res, req.path, "pages/case-studies", {
    caseStudies,
    pageTitle: "Case Studies | AquaTech",
    pageDescription:
      "Một số case study thực tế về website, automation và data system được AquaTech triển khai theo hướng tăng tốc độ bán hàng và vận hành.",
    pageKeywords: "case studies, dự án website, dự án automation, dự án scraping",
  });
});

app.get("/case-studies/:slug", (req, res, next) => {
  const caseStudy = caseStudiesBySlug.get(req.params.slug);
  if (!caseStudy) {
    return next();
  }

  return renderPage(res, req.path, "pages/case-study-detail", {
    caseStudy,
    pageTitle: `${caseStudy.title} | AquaTech Case Study`,
    pageDescription: caseStudy.summary,
    pageKeywords: [
      "case study",
      caseStudy.industry,
      ...caseStudy.stack.slice(0, 4),
      "AquaTech",
    ].join(", "),
  });
});

app.get("/ve-chung-toi", (_req, res) => {
  res.redirect(301, "/about");
});

app.get("/du-an-thuc-te", (_req, res) => {
  res.redirect(301, "/case-studies");
});


app.get("/dich-vu/:slug", (req, res, next) => {
  const service = servicesBySlug.get(req.params.slug);
  if (!service) {
    return next();
  }

  const pageDescription = `${service.teaser} Muc gia tham chieu ${service.price}, timeline ${service.timeline}.`;

  return renderPage(res, req.path, "pages/service-detail", {
    service,
    pageTitle: `${service.name} | AquaTech`,
    pageDescription,
    pageKeywords: [service.name, service.category, ...service.technologies.slice(0, 5), "AquaTech"]
      .join(", "),
  });
});

app.get("/legacy/contact", (_req, res) => {
  res.redirect(301, "/lien-he");
});

app.use((req, res) => {
  return res.status(404).render("pages/not-found", {
    ...baseViewData(req.path, {
      robotsMeta: "noindex, nofollow",
    }),
    pageTitle: "404 | AquaTech",
    pageDescription: "Không tìm thấy nội dung bạn đang truy cập.",
  });
});

let isShuttingDown = false;
let httpServer;

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`${signal} received. Closing AquaTech backend...`);

  if (httpServer) {
    await new Promise((resolve) => {
      httpServer.close(() => resolve());
    });
  }

  await disconnectDatabase();
  process.exit(0);
};

const startServer = async () => {
  if (isDatabaseConfigured) {
    try {
      await syncServiceCatalog();
      console.log("Service catalog synced to PostgreSQL.");
    } catch (error) {
      console.error("Unable to sync service catalog at startup.", error);
    }
  } else {
    console.warn("DATABASE_URL is not configured. Lead/newsletter API will return 503 until PostgreSQL is set.");
  }

  httpServer = app.listen(port, () => {
    console.log(`AquaTech backend running at http://localhost:${port}`);
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

startServer().catch(async (error) => {
  console.error("Failed to start AquaTech backend", error);
  await disconnectDatabase();
  process.exit(1);
});
