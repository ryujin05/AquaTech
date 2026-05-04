# AquaTech Project To-Do

## 0) Scope da chot
- [x] Giai doan 1 lam single-page cao cap bang HTML, CSS, JS thuan.
- [x] Theme mau chinh: xanh duong, trang, xam dam.
- [x] Muc animation: cinematic vua phai, uu tien muot va hieu nang.
- [x] Ngon ngu giai doan dau: tieng Viet.
- [x] Co smooth scroll + GSAP + ScrollTrigger + micro-animation CSS.
- [x] Background duoc tinh gon: bo sun/moon/bubble, giu motion o diem can nhan manh.

## 1) Frontend Architecture (P0)
- [x] Rebuild trang chu index thanh bo cuc conversion-first.
- [x] Tao bo design token CSS bang bien mau, radius, shadow, spacing.
- [x] Tach animation JS rieng (assets/js/main.js).
- [x] Tach style rieng (assets/css/main.css).
- [x] Tao section: Hero, Services, Process, Technology, Pricing, Showcase, FAQ, Contact.
- [x] Chuan hoa ten file dich vu de de quan ly (slug thong nhat).
- [x] Tao bo reusable component pattern (button, card, section title, chip).
- [x] Chuan bi branch/page cho ban da trang (neu can): /services, /about, /case-studies.

## 2) Animation System (P0)
- [x] Bo preloader de giam lag va giu first paint nhanh.
- [x] Tao scroll progress bar.
- [x] Tao hero reveal timeline bang GSAP.
- [x] Tao reveal animation theo viewport bang ScrollTrigger.
- [x] Loai bo parallax sun/moon, giu transition nhe o section quan trong.
- [x] Loai bo bubble field de toi uu hieu nang tren mobile.
- [x] Tao micro hover cho button, card, nav.
- [x] Dung smooth scroll native + trigger animation nhe.
- [x] Tinh chinh timing/curve theo mobile thuc te.
- [x] Them motion variant cho CTA cuoi trang.
- [ ] Them reduced-motion profile nang cao cho tat ca hieu ung nang.

## 3) Content va Conversion (P0)
- [x] Doi branding trang chu sang AquaTech.
- [x] Chuan hoa thong tin dich vu va moc gia tham chieu tu banggia.txt.
- [x] Dat CTA kep: Bat dau du an + Xem nang luc dich vu.
- [x] Viet lai copy theo outcome (khong chi tinh nang).
- [ ] Them 3 case study that voi metric da xac thuc.
- [x] Them testimonial that (ten, chuc danh, cong ty).
- [x] Them section cam ket SLA phan hoi va bao hanh.
- [ ] Chot bo thong tin doanh nghiep dung chuan (ten phap ly, dia chi, email, social).

## 4) Accessibility + SEO + Performance (P0)
- [x] Co skip-link va heading semantic co cau truc.
- [x] Co nav mobile co aria-expanded.
- [x] Co focus style cho input va button.
- [ ] Kiem tra contrast theo WCAG AA cho tat ca text/chip.
- [ ] Kiem tra full keyboard navigation (tab order, trap, close menu).
- [ ] Toi uu anh OG/logo va bo favicon day du size.
- [x] Bo sung robots.txt va sitemap.xml.
- [ ] Kiem tra schema.org va metadata cho toan bo trang.
- [ ] Dat muc tieu Lighthouse: Perf >= 85, A11y >= 90, SEO >= 90.

## 5) Backend Planning (Elysia.js + PostgreSQL + Prisma) (P1)
- [ ] Khoi tao backend Elysia.js project structure.
- [x] Cai dat Prisma va ket noi PostgreSQL.
- [ ] Tao model: Lead, ServiceInterest, ContactMessage, SourceTracking.
- [ ] Tao migration dau tien va seed mau.
- [ ] Tao API endpoints:
- [x] POST /api/leads
- [x] GET /api/health
- [x] POST /api/newsletter (neu can)
- [x] Add validation request (zod hoac equivalent).
- [x] Them rate limit va anti-spam cho form.
- [x] Noi form frontend voi API that.

## 6) Docker + Environment (P1)
- [ ] Tao Dockerfile cho backend Elysia.
- [x] Tao docker-compose cho app + postgres.
- [x] Tao file .env.example day du bien moi truong.
- [x] Viet script startup local 1 lenh.
- [ ] Kiem tra migration khi chay trong container.
- [ ] Kiem tra backup/restore PostgreSQL co tai lieu.

## 7) QA va Testing (P1)
- [ ] Tao test checklist frontend theo viewport: 320, 768, 1024, 1440.
- [ ] Test animation tren Chrome, Edge, Safari iOS.
- [ ] Test form submit happy path va error path.
- [ ] Test payload xau va spam behavior.
- [ ] Viet unit test cho service validation backend.
- [ ] Viet integration test cho endpoint /api/leads.

## 8) Deployment + Monitoring (P1)
- [ ] Chot target host (VPS, Render, Railway, Fly.io, hoac khac).
- [ ] Thiet lap CI/CD (lint, test, build, deploy).
- [ ] Bat log co cau truc cho backend.
- [ ] Bat monitoring uptime va alert email/telegram.
- [ ] Bat web-vitals theo doi sau deploy.

## 9) Legal + Operational (P1)
- [ ] Cap nhat chinh sach bao mat theo brand AquaTech.
- [ ] Co dong y thu thap du lieu cho form (consent).
- [ ] Chot quy trinh luu tru va xoa lead data.
- [ ] Chot NDA mau neu lam du an doanh nghiep.

## 10) Expansion Roadmap (P2)
- [x] Them trang About co profile team.
- [x] Them trang Case Studies chi tiet.
- [ ] Them blog chia se giai phap ky thuat.
- [ ] Them dashboard admin quan ly lead.
- [ ] Them song ngu Viet/Anh.
- [ ] Them bo design system tai su dung.

## Current sprint ghi nhan
- [x] Khoi tao giao dien trang chu AquaTech moi.
- [x] Chuyen he thong motion sang ban nhe (GSAP + ScrollTrigger).
- [x] Tinh gon background de uu tien hieu nang va do muot.
- [x] Them icon brand custom cho AquaTech.
- [x] Tao file checklist tong the cho du an (to-do.md).
- [x] Dung backend Node.js + Express cho route da trang.
- [x] Tao route: /dich-vu, /dich-vu/:slug, /lien-he.
- [x] Tao API: /api/health, /api/services, /api/leads, /api/newsletter.
- [x] Noi form frontend voi API /api/leads va status message realtime.
- [x] Nang cap persistence sang PostgreSQL + Prisma (thay JSON runtime store).
- [x] Xac minh luong ghi DB that: db:push OK, /api/leads va /api/newsletter tra 201.
- [x] Tach port PostgreSQL rieng (55432) de tranh xung dot voi Postgres local.
- [x] Them route va page About + Case Studies.
- [x] Chuan hoa SEO EJS pages voi canonical + og:url + robots meta.
- [x] Cap nhat run.bat chi chay trong VS Code terminal va start ca frontend/backend.
- [x] Them section Cam ket + Testimonial + Final CTA o homepage.
- [x] Them robots.txt + sitemap.xml va route backend phuc vu SEO files.
- [x] Khoi phuc bubble interaction: di chuot de day bong tren canvas.
- [x] Dong bo navbar da trang theo thu tu ro rang, bo link anchor gay nhay ve trang chu tren trang con.
- [x] Them trang Bang gia chi tiet (/bang-gia) va route redirect /pricing.
- [x] Cap nhat bang gia moi vao banggia.txt + cap nhat gia/timeline service summary.
- [x] Tach them 2 trang rieng: /quy-trinh va /cong-nghe, bo sung vao nav da trang.
- [x] Chuyen Case Studies sang mo hinh data-driven va tao URL rieng cho tung du an (/case-studies/:slug).
- [x] Chuan hoa noi dung tieng Viet co dau tren cac page chinh + bang gia text/data.

## Ocean night redesign sprint (2026-04-23)
- [x] Rebuild homepage HTML skeleton theo bo cuc moi.
- [x] Tao he thong visual ocean night (blue/purple, glow, jellyfish, coral, kelp).
- [x] Doi logo concept: chu T dang neo, chu A theo cam hung bach tuoc.
- [x] Xoa cac doan copy nghi ngo va de trong vung noi dung de cap nhat sau.
- [ ] Chot QA cuoi va run build sau khi review UI tren desktop/mobile.
