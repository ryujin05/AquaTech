export const services = [
  {
    slug: "phan-mem-desktop",
    name: "Phần mềm Desktop",
    category: "Desktop",
    teaser:
      "Xây ứng dụng cho vận hành nội bộ như CRM mini, quản lý đơn, báo cáo hoặc công cụ chuyên biệt.",
    price: "Từ 700K",
    timeline: "1-2 ngày",
    technologies: ["Electron", "Node.js", "SQLite", "PostgreSQL"],
    deliverables: [
      "Thiết kế luồng thao tác theo nghiệp vụ thực tế của doanh nghiệp.",
      "Xây giao diện desktop gọn và ưu tiên tốc độ xử lý.",
      "Kết nối dữ liệu file Excel/CSV hoặc API nếu cần.",
      "Đóng gói bản cài cho Windows và hướng dẫn sử dụng.",
    ],
    outcomes: [
      { label: "Tốc độ nhập liệu", value: "+35%" },
      { label: "Tỷ lệ sai thao tác", value: "-40%" },
      { label: "Onboarding nhân sự", value: "< 2h" },
    ],
    process: [
      "Khảo sát nghiệp vụ và lên danh sách màn hình",
      "Chạy prototype thao tác chính",
      "Triển khai tính năng + QA theo checklist",
      "Bàn giao source và tài liệu vận hành",
    ],
    faqs: [
      {
        q: "Có đồng bộ dữ liệu online được không?",
        a: "Có. Có thể chạy offline-first rồi đồng bộ khi có mạng hoặc kết nối server thời gian thực.",
      },
      {
        q: "Có thể nâng cấp thành SaaS sau này không?",
        a: "Được. Kiến trúc sẽ được đặt theo hướng tách backend để dễ nâng cấp lên web app.",
      },
    ],
  },
  {
    slug: "landing-page",
    name: "Landing Page",
    category: "Website",
    teaser:
      "Thiết kế landing page tập trung chuyển đổi, tối ưu thông điệp và hành động chính của khách hàng.",
    price: "Từ 500K",
    timeline: "1 ngày",
    technologies: ["HTML5", "CSS3", "GSAP", "SEO On-page"],
    deliverables: [
      "Viết cấu trúc nội dung theo hành vi ra quyết định của khách hàng.",
      "Thiết kế section conversion-first: problem, solution, proof, CTA.",
      "Tối ưu responsive cho mobile và tốc độ tải trang.",
      "Gắn form lead và tracking cơ bản cho chiến dịch ads.",
    ],
    outcomes: [
      { label: "Tỷ lệ để lại thông tin", value: "+28%" },
      { label: "Tốc độ tải LCP", value: "~2.2s" },
      { label: "Thời gian bàn giao", value: "24h" },
    ],
    process: [
      "Chốt offer và chân dung khách hàng mục tiêu",
      "Lên wireframe + copy khung",
      "Thiết kế UI + motion tinh gọn",
      "Bàn giao và hỗ trợ tối ưu conversion",
    ],
    faqs: [
      {
        q: "Landing page có phù hợp chạy ads không?",
        a: "Có. Cấu trúc ưu tiên cho chiến dịch ads với CTA rõ và form lead nổi bật.",
      },
      {
        q: "Bao lâu có bản demo đầu tiên?",
        a: "Thông thường trong ngày nếu đã có đủ nội dung và tài nguyên branding.",
      },
    ],
  },
  {
    slug: "website-thuong-mai",
    name: "Website Thương mại",
    category: "E-commerce",
    teaser:
      "Xây website bán hàng có quản lý sản phẩm, đơn hàng, thanh toán và báo cáo vận hành.",
    price: "Từ 2.900K",
    timeline: "3-5 ngày",
    technologies: ["Node.js", "Express", "PostgreSQL", "VNPay/Momo"],
    deliverables: [
      "Thiết kế giao diện bán hàng đa thiết bị, tối ưu trải nghiệm mua nhanh.",
      "Xây giỏ hàng, checkout, đơn hàng, voucher và trạng thái thanh toán.",
      "Tích hợp cổng thanh toán phổ biến theo nhu cầu thực tế.",
      "Thiết lập dashboard theo dõi doanh thu và đơn hàng.",
    ],
    outcomes: [
      { label: "Giảm bỏ giỏ", value: "-18%" },
      { label: "Tốc độ xử lý đơn", value: "+32%" },
      { label: "Thời gian triển khai", value: "5-14 ngày" },
    ],
    process: [
      "Thiết kế kiến trúc sản phẩm và luồng checkout",
      "Phát triển frontend + backend theo milestone",
      "QA đơn hàng/thanh toán và dữ liệu báo cáo",
      "Go-live và theo dõi chỉ số sau triển khai",
    ],
    faqs: [
      {
        q: "Có đồng bộ kho và vận chuyển không?",
        a: "Có thể tích hợp API kho, vận chuyển hoặc ERP tùy hạ tầng hiện tại của doanh nghiệp.",
      },
      {
        q: "Website có mở rộng thành app được không?",
        a: "Có. Nếu backend tách chuẩn API từ đầu thì mở rộng mobile app rất thuận lợi.",
      },
    ],
  },
  {
    slug: "tool-scraping",
    name: "Tool Scraping Data",
    category: "Data",
    teaser:
      "Thu thập dữ liệu từ website/map/sàn TMĐT có lọc tiêu chí và xuất file phục vụ vận hành.",
    price: "Từ 500K",
    timeline: "1-2 ngày",
    technologies: ["Playwright", "Cheerio", "Node.js", "CSV/Excel"],
    deliverables: [
      "Xây bộ crawl theo nguồn dữ liệu và điều kiện lọc bạn yêu cầu.",
      "Làm sạch dữ liệu đầu ra và chuẩn hóa định dạng cột.",
      "Xuất file CSV/Excel hoặc đẩy vào database.",
      "Thêm cơ chế chạy định kỳ và chống trùng dữ liệu.",
    ],
    outcomes: [
      { label: "Tốc độ gom lead", value: "+4x" },
      { label: "Dữ liệu dùng được", value: "> 90%" },
      { label: "Khởi tạo job", value: "Trong ngày" },
    ],
    process: [
      "Khảo sát nguồn và quy định truy cập dữ liệu",
      "Thiết kế pipeline thu thập + làm sạch",
      "Triển khai script và test độ ổn định",
      "Bàn giao lịch chạy và định dạng xuất chuẩn",
    ],
    faqs: [
      {
        q: "Scraping có bị chặn không?",
        a: "Có thể xảy ra. Team sẽ thiết kế cơ chế retry, pacing và fallback để tăng ổn định.",
      },
      {
        q: "Có thể gom dữ liệu nhiều nguồn cùng lúc không?",
        a: "Được. Có thể chia pipeline theo nguồn và hợp nhất kết quả theo schema chung.",
      },
    ],
  },
  {
    slug: "chrome-automation",
    name: "Chrome Automation",
    category: "Automation",
    teaser:
      "Tự động hóa thao tác trên trình duyệt: đăng bài, điền form, tạo tài khoản, xử lý workflow.",
    price: "Từ 500K",
    timeline: "1-2 ngày",
    technologies: ["Playwright", "Puppeteer", "Node.js", "Captcha Flow"],
    deliverables: [
      "Mô hình hóa workflow browser theo từng bước rõ ràng.",
      "Xây bot chạy ổn định có log và cảnh báo lỗi.",
      "Hỗ trợ multi-profile/multi-account nếu cần.",
      "Bàn giao script + video hướng dẫn vận hành.",
    ],
    outcomes: [
      { label: "Tiết kiệm thời gian", value: "3-6h/ngày" },
      { label: "Tỷ lệ hoàn thành task", value: "+40%" },
      { label: "Bản POC", value: "Trong ngày" },
    ],
    process: [
      "Chụp workflow hiện tại và điểm nghẽn",
      "Build bản auto MVP theo trường hợp phổ biến",
      "Tối ưu ổn định và xử lý edge case",
      "Đào tạo vận hành và checklist theo dõi",
    ],
    faqs: [
      {
        q: "Bot có chạy 24/7 được không?",
        a: "Có thể, tùy hạ tầng triển khai local/VPS và giới hạn của nền tảng đích.",
      },
      {
        q: "Có hỗ trợ anti-detect không?",
        a: "Có thể hỗ trợ theo mức phù hợp với use-case hợp pháp và chính sách nền tảng.",
      },
    ],
  },
  {
    slug: "app-mobile",
    name: "App Android & iOS",
    category: "Mobile",
    teaser:
      "Xây app mobile cho đặt lịch, bán hàng, nội bộ hoặc startup SaaS với nền tảng backend-ready.",
    price: "Từ 3.000K",
    timeline: "1-2 tuần",
    technologies: ["Flutter", "React Native", "Node.js", "Firebase"],
    deliverables: [
      "Thiết kế UX theo hành vi mobile-first và luồng thao tác ngắn.",
      "Phát triển app có đăng nhập, dữ liệu realtime, thông báo đẩy.",
      "Kết nối API backend và chuẩn hóa trạng thái lỗi/timeout.",
      "Build bản testflight/apk để nghiệm thu theo milestone.",
    ],
    outcomes: [
      { label: "Retention D7", value: "+22%" },
      { label: "Crash rate", value: "< 1%" },
      { label: "Thời gian MVP", value: "2-4 tuần" },
    ],
    process: [
      "Research user flow và KPI cốt lõi",
      "Thiết kế wireframe + prototype mobile",
      "Phát triển app + API integration",
      "QA thiết bị thật và bàn giao release",
    ],
    faqs: [
      {
        q: "Có build được cả Android và iOS không?",
        a: "Có. Team có thể build đa nền tảng hoặc native theo ngân sách và thời gian.",
      },
      {
        q: "Có hỗ trợ publish store không?",
        a: "Có hỗ trợ từ bước chuẩn bị metadata đến submit bản release.",
      },
    ],
  },
  {
    slug: "dich-vu-khac",
    name: "Dịch vụ khác",
    category: "Custom",
    teaser:
      "Nhận các task công nghệ đặc thù: migration, tối ưu hiệu năng, fix bug khó, tích hợp hệ thống.",
    price: "Từ 300K",
    timeline: "Dưới 1h",
    technologies: ["Web", "Backend", "Automation", "Consulting"],
    deliverables: [
      "Phân rã bài toán thành các đầu việc có estimate rõ ràng.",
      "Ưu tiên xử lý phần critical ảnh hưởng doanh thu/vận hành.",
      "Báo cáo tiến độ ngắn theo mốc thời gian thống nhất.",
      "Bàn giao checklist kiểm tra sau fix.",
    ],
    outcomes: [
      { label: "Thời gian phản hồi", value: "< 24h" },
      { label: "Tỷ lệ xử lý đúng hẹn", value: "> 95%" },
      { label: "Mức độ linh hoạt", value: "Cao" },
    ],
    process: [
      "Khoanh vùng vấn đề và mức độ ưu tiên",
      "Xác nhận phạm vi + estimate",
      "Triển khai và test theo case thật",
      "Nghiệm thu + khuyến nghị bước tiếp theo",
    ],
    faqs: [
      {
        q: "Có nhận task gấp trong ngày không?",
        a: "Có thể, tùy mức độ phức tạp và khối lượng đang xử lý trong sprint hiện tại.",
      },
      {
        q: "Có hỗ trợ dài hạn sau khi fix không?",
        a: "Có. Bạn có thể chọn gói bảo trì định kỳ hoặc hỗ trợ theo ticket.",
      },
    ],
  },
];

export const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
