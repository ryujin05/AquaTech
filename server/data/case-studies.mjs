export const caseStudies = [
  {
    slug: "landing-crm-manufacturing",
    industry: "B2B Manufacturing",
    title: "Landing Page + CRM Lead Flow cho doanh nghiệp thiết bị công nghiệp",
    summary:
      "Tối ưu hành trình từ traffic quảng cáo đến xử lý lead, giúp đội sales chốt nhanh hơn và giảm thất thoát lead nóng.",
    challenge:
      "Doanh nghiệp có traffic ổn nhưng lead rơi rụng nhiều do form dài, thiếu phân loại lead và chậm phản hồi khi khách để lại thông tin.",
    approach: [
      "Rút gọn landing theo đúng pain point của khách B2B, gom nội dung vào một luồng quyết định rõ ràng.",
      "Thiết kế lại form theo từng mức nhu cầu để tăng tỷ lệ hoàn thành và giảm nhiễu dữ liệu đầu vào.",
      "Kết nối CRM để tự động gán điểm lead và phân công sale phụ trách theo ngành hàng.",
      "Tạo automation email/Zalo nhắc follow-up trong 5 phút đầu sau khi phát sinh lead.",
    ],
    stack: ["React", "Node.js", "PostgreSQL", "n8n", "Meta Pixel"],
    timeline: "5 tuần build, 2 tuần tối ưu",
    metrics: [
      { label: "Qualified leads", value: "+61%" },
      { label: "Time-to-contact", value: "-38%" },
      { label: "ROI sau 3 tháng", value: "3.2x" },
    ],
    results: [
      "Tỷ lệ hoàn thành form tăng mạnh nhờ rút bớt trường không cần thiết.",
      "Đội sales có danh sách lead ưu tiên theo điểm chất lượng để gọi trước.",
      "Báo cáo campaign và chất lượng lead được đồng bộ theo ngày.",
    ],
    lessons:
      "Với B2B, tốc độ phản hồi và chất lượng dữ liệu lead quan trọng hơn việc đổ thêm ngân sách quảng cáo.",
  },
  {
    slug: "pricing-intel-education",
    industry: "Education",
    title: "Dashboard + Scraping giá thị trường cho trung tâm đào tạo",
    summary:
      "Xây hệ thống thu thập và chuẩn hóa dữ liệu học phí đối thủ để đội vận hành điều chỉnh pricing theo khu vực theo thời gian thực.",
    challenge:
      "Đội ngũ đang tổng hợp dữ liệu thủ công từ nhiều nguồn, tốn nhiều thời gian và thiếu độ nhất quán nên quyết định giá thường chậm.",
    approach: [
      "Tạo crawler theo từng nguồn dữ liệu với lịch chạy định kỳ và cơ chế chống trùng.",
      "Thiết kế pipeline làm sạch để chuẩn hóa tên khóa học, khu vực và mức học phí.",
      "Xây dashboard cho phép lọc theo tỉnh/thành và theo nhóm sản phẩm đào tạo.",
      "Thiết lập cảnh báo khi thị trường biến động vượt ngưỡng để đội pricing xử lý sớm.",
    ],
    stack: ["Python", "Node.js API", "PostgreSQL", "Metabase"],
    timeline: "4 sprint, release theo module",
    metrics: [
      { label: "Tốc độ tổng hợp dữ liệu", value: "9x" },
      { label: "Độ phủ dữ liệu cạnh tranh", value: "95%" },
      { label: "Tăng đăng ký khóa học", value: "+17%" },
    ],
    results: [
      "Đội vận hành không còn phải tổng hợp bảng giá thủ công mỗi tuần.",
      "Bộ dữ liệu thống nhất giúp so sánh pricing theo khu vực nhanh và rõ ràng.",
      "Quyết định điều chỉnh giá được rút ngắn từ vài ngày xuống trong ngày.",
    ],
    lessons:
      "Data pipeline ổn định giúp doanh nghiệp ra quyết định giá chính xác hơn thay vì dựa vào cảm tính.",
  },
  {
    slug: "mobile-booking-spa-chain",
    industry: "Service Business",
    title: "Ứng dụng mobile đặt lịch và backend vận hành cho chuỗi spa",
    summary:
      "Triển khai app đặt lịch đa chi nhánh, đồng bộ loyalty và báo cáo để tăng tỷ lệ quay lại của khách hàng hiện hữu.",
    challenge:
      "Chuỗi spa quản lý đặt lịch phân tán qua nhiều kênh, dễ trùng lịch và khó theo dõi hiệu quả chăm sóc khách hàng theo từng chi nhánh.",
    approach: [
      "Thiết kế luồng đặt lịch mobile-first, giảm số bước thao tác cho khách mới.",
      "Xây backend đồng bộ lịch theo kỹ thuật viên, phòng dịch vụ và chi nhánh.",
      "Tích hợp push notification cho nhắc lịch, ưu đãi và nhắc tái khám.",
      "Bổ sung dashboard theo dõi tỷ lệ no-show, doanh thu và tần suất quay lại.",
    ],
    stack: ["Flutter", "Node.js", "PostgreSQL", "Firebase"],
    timeline: "MVP 8 tuần, mở rộng 2 tháng",
    metrics: [
      { label: "Tỷ lệ đặt lịch online", value: "+42%" },
      { label: "No-show rate", value: "-29%" },
      { label: "Doanh thu theo quý", value: "+24%" },
    ],
    results: [
      "Khách có thể tự đặt và đổi lịch nhanh, giảm tải tổng đài giờ cao điểm.",
      "Chi nhánh nhìn được lịch và hiệu suất theo thời gian thực.",
      "Chương trình loyalty được cá nhân hóa theo lịch sử sử dụng dịch vụ.",
    ],
    lessons:
      "Với mô hình chuỗi dịch vụ, trải nghiệm đặt lịch mượt và dữ liệu vận hành đồng bộ quyết định tốc độ tăng trưởng.",
  },
];

export const caseStudiesBySlug = new Map(caseStudies.map((item) => [item.slug, item]));
