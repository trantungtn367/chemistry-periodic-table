# CHEMISTRY — Interactive Periodic Table

Website **bảng tuần hoàn hóa học tương tác dành cho học sinh**, tập trung vào giao diện trực quan, dễ sử dụng, sinh động và dễ mở rộng.

---

## 1. Mục tiêu dự án

Dự án được xây dựng với các mục tiêu chính:

- Hiển thị đầy đủ **118 nguyên tố hóa học** trong bảng tuần hoàn.
- Bố trí nguyên tố đúng theo **nhóm** và **chu kỳ**.
- Giúp học sinh tra cứu thông tin nguyên tố nhanh chóng.
- Phân loại nguyên tố bằng màu sắc để dễ quan sát.
- Có hiệu ứng hover, animation và cửa sổ thông tin chi tiết.
- Có tìm kiếm và bộ lọc.
- Hỗ trợ giao diện sáng/tối.
- Responsive trên laptop, tablet và điện thoại.
- Có thể mở rộng thêm Quiz, Flashcard, Fun Facts và các chế độ học tập.

---

## 2. Công nghệ sử dụng

Phiên bản đầu ưu tiên các công nghệ đơn giản:

- **HTML5**
- **CSS3**
- **JavaScript thuần**
- **JSON**

Không sử dụng React, Vue, Next.js hoặc framework frontend khác trong phiên bản đầu nếu chưa thực sự cần thiết.

Mục tiêu là giữ project:

- đơn giản;
- dễ đọc;
- dễ chỉnh sửa;
- dễ chạy;
- phù hợp cho việc học HTML/CSS/JavaScript.

---

## 3. Dữ liệu bảng tuần hoàn

Dữ liệu nguyên tố được lưu tại:

```text
data/elements.json
```

Nguồn dữ liệu ban đầu:

```text
Bowserinator/Periodic-Table-JSON
```

File JSON có cấu trúc chính:

```json
{
  "elements": [
    {
      "name": "Hydrogen",
      "symbol": "H",
      "number": 1
    }
  ]
}
```

JavaScript sẽ đọc dữ liệu từ file này bằng `fetch()` và tự tạo các ô nguyên tố trên giao diện.

### Lưu ý quan trọng

Dataset hiện tại có thêm dữ liệu cho **element 119 (Ununennium / Uue)**.

Website chính thức của project này chỉ sử dụng:

```text
atomic number 1 → 118
```

Element 119 phải được bỏ qua khi render bảng tuần hoàn.

Ví dụ:

```javascript
const elements118 = data.elements.filter(element => element.number <= 118);
```

---

## 4. Các trường dữ liệu có thể sử dụng

Mỗi nguyên tố trong `elements.json` có thể chứa các trường như:

```text
name
symbol
number
atomic_mass
appearance
category
density
melt
boil
molar_heat
discovered_by
named_by
period
group
phase
source
summary
shells
electron_configuration
electron_configuration_semantic
electron_affinity
electronegativity_pauling
ionization_energies
cpk-hex
xpos
ypos
wxpos
wypos
block
bohr_model_image
bohr_model_3d
spectral_img
image
```

Một số trường có thể có giá trị:

```text
null
```

Khi hiển thị thông tin chi tiết, không được render các trường không có dữ liệu.

---

## 5. Vị trí nguyên tố trong bảng

Dataset đã có các trường:

```text
xpos
ypos
```

Có thể sử dụng chúng để xác định vị trí của từng nguyên tố trong CSS Grid.

Ví dụ ý tưởng:

```javascript
element.style.gridColumn = item.xpos;
element.style.gridRow = item.ypos;
```

Lanthanides và Actinides cần được hiển thị rõ ràng ở khu vực riêng phía dưới bảng chính.

---

## 6. Cấu trúc project

```text
CHEMISTRY/
│
├── index.html
├── README.md
├── skill.md
├── PeriodicTableJSON.json   (nguồn dữ liệu gốc, tham khảo)
│
├── css/
│   └── style.css            (toàn bộ giao diện, theme, responsive)
│
├── js/
│   ├── app.js               (fetch, render bảng + legend, mở modal)
│   ├── categories.js        (mapping category → class màu / nhãn tiếng Việt)
│   ├── details.js           (modal chi tiết nguyên tố, xử lý null/ảnh)
│   ├── filters.js           (search + filter category/phase/block, state chung)
│   └── theme.js             (Light/Dark mode)
│
├── data/
│   └── elements.json        (dữ liệu chính thức, chỉ dùng 1–118)
│
└── assets/
    ├── images/              (placeholder cho ảnh lỗi)
    └── icons/
```

Cấu trúc có thể được thay đổi nếu cần, nhưng không nên chia quá nhiều file khi project còn nhỏ.

---

## 7. Chức năng chính

### 7.1. Bảng tuần hoàn

Trang chính phải hiển thị đầy đủ 118 nguyên tố.

Mỗi ô nguyên tố nên hiển thị tối thiểu:

- số hiệu nguyên tử;
- ký hiệu hóa học;
- tên nguyên tố;
- nguyên tử khối.

Ví dụ:

```text
8
O
Oxygen
15.999
```

Không hiển thị quá nhiều thông tin trực tiếp trong ô nguyên tố để tránh rối mắt.

---

### 7.2. Phân loại nguyên tố bằng màu sắc

Các nguyên tố được phân loại theo `category`.

Các nhóm có thể gồm:

- Alkali metal
- Alkaline earth metal
- Transition metal
- Post-transition metal
- Metalloid
- Diatomic nonmetal
- Polyatomic nonmetal
- Noble gas
- Lanthanide
- Actinide
- Unknown / predicted

Mỗi nhóm sử dụng một màu riêng.

Phía trên hoặc phía dưới bảng cần có phần **legend/chú thích màu**.

---

### 7.3. Hiệu ứng hover

Khi đưa chuột vào ô nguyên tố:

- ô nổi lên nhẹ;
- tăng scale nhẹ;
- có shadow;
- transition mượt;
- không làm thay đổi layout;
- không sử dụng hiệu ứng quá mạnh.

Ví dụ hướng thiết kế:

```text
scale nhẹ
+
shadow
+
border highlight
+
transition
```

---

### 7.4. Xem chi tiết nguyên tố

Khi click vào một nguyên tố, mở:

- Modal;
- hoặc Side Panel.

Thông tin có thể hiển thị:

- Tên nguyên tố
- Ký hiệu
- Số hiệu nguyên tử
- Nguyên tử khối
- Nhóm
- Chu kỳ
- Phân loại
- Trạng thái vật chất
- Mật độ
- Nhiệt độ nóng chảy
- Nhiệt độ sôi
- Cấu hình electron
- Cấu hình electron rút gọn
- Độ âm điện Pauling
- Ái lực electron
- Các mức năng lượng ion hóa
- Phân bố electron theo lớp
- Người phát hiện
- Người đặt tên
- Mô tả
- Ảnh nguyên tố
- Bohr model
- Link nguồn tham khảo

Nếu dữ liệu có giá trị `null`, mục đó không được hiển thị.

---

## 8. Hình ảnh nguyên tố

Dataset có thể chứa:

```text
image.url
bohr_model_image
bohr_model_3d
spectral_img
```

### `image.url`

Dùng để hiển thị ảnh minh họa nguyên tố.

### `bohr_model_image`

Dùng để hiển thị mô hình Bohr dạng ảnh.

### `bohr_model_3d`

Có thể sử dụng trong phiên bản nâng cao để hiển thị mô hình `.glb` 3D.

### `spectral_img`

Có thể dùng để hiển thị phổ nguyên tố nếu URL hợp lệ.

Nếu ảnh không tồn tại hoặc lỗi tải, phải có fallback phù hợp.

---

## 9. Tìm kiếm nguyên tố

Website cần có thanh tìm kiếm.

Cho phép tìm bằng:

- tên nguyên tố;
- ký hiệu;
- số hiệu nguyên tử.

Ví dụ:

```text
Oxygen
O
8
```

Khi tìm thấy:

- highlight nguyên tố;
- tự động đưa nguyên tố vào vùng nhìn thấy nếu cần;
- các nguyên tố còn lại có thể giảm opacity.

---

## 10. Bộ lọc

Có thể lọc hoặc highlight nguyên tố theo:

### Phân loại

```text
Alkali metal
Transition metal
Noble gas
Lanthanide
Actinide
...
```

### Trạng thái

```text
Solid
Liquid
Gas
```

### Block

```text
s
p
d
f
```

Khi lọc, ưu tiên giảm opacity của các nguyên tố không phù hợp thay vì xóa chúng khỏi bảng.

Lý do: học sinh vẫn nhìn được cấu trúc đầy đủ của bảng tuần hoàn.

---

## 11. Light Mode / Dark Mode

Website cần có nút chuyển:

```text
Light
Dark
```

Có thể lưu lựa chọn bằng:

```javascript
localStorage
```

Khi người dùng tải lại trang, giao diện nên giữ theme đã chọn.

---

## 12. Ngôn ngữ

Dataset hiện tại chủ yếu sử dụng tiếng Anh.

Phiên bản đầu có thể:

- giữ dữ liệu gốc trong JSON;
- Việt hóa các nhãn giao diện;
- dịch tên nhóm nguyên tố bằng JavaScript;
- không chỉnh sửa trực tiếp toàn bộ dataset nếu chưa cần thiết.

Ví dụ:

```javascript
const categoryNames = {
  "alkali metal": "Kim loại kiềm",
  "alkaline earth metal": "Kim loại kiềm thổ",
  "transition metal": "Kim loại chuyển tiếp",
  "noble gas": "Khí hiếm",
  "lanthanide": "Họ Lantan",
  "actinide": "Họ Actini"
};
```

Có thể bổ sung bản dịch tên và mô tả nguyên tố trong các phiên bản sau.

---

## 13. Responsive

Website cần hoạt động tốt trên:

- Desktop
- Laptop
- Tablet
- Mobile

Trên màn hình nhỏ:

- cho phép scroll ngang bảng tuần hoàn nếu cần;
- không ép các ô quá nhỏ;
- modal/panel phải vừa màn hình;
- nút và input phải dễ thao tác.

---

## 14. Thiết kế giao diện

Phong cách mong muốn:

- hiện đại;
- sinh động;
- thân thiện với học sinh;
- màu sắc rõ ràng;
- dễ đọc;
- không quá nhiều hiệu ứng.

### Nên sử dụng

- bo góc;
- shadow nhẹ;
- gradient nhẹ nếu phù hợp;
- hover animation;
- transition mượt;
- spacing rõ ràng;
- typography dễ đọc.

### Không nên

- quá nhiều neon;
- animation liên tục;
- hiệu ứng gây mất tập trung;
- chữ quá nhỏ;
- hiển thị quá nhiều dữ liệu trong từng ô;
- giao diện quá phức tạp.

---

## 15. Nguyên tắc code

### Không hard-code 118 nguyên tố trong HTML

Không làm:

```html
<div>Hydrogen</div>
<div>Helium</div>
<div>Lithium</div>
...
```

Phải đọc từ:

```text
data/elements.json
```

và render bằng JavaScript.

### Tách dữ liệu khỏi giao diện

```text
JSON
 ↓
JavaScript
 ↓
DOM
 ↓
UI
```

### Code phải

- dễ đọc;
- có tên biến rõ nghĩa;
- hạn chế duplicate code;
- tránh over-engineering;
- chỉ tạo module mới khi thực sự cần;
- có xử lý lỗi khi fetch JSON thất bại.

---

## 16. Xử lý dữ liệu null

Không được hiển thị kiểu:

```text
Melting point: null
Discovered by: null
```

Thay vào đó:

```javascript
if (element.melt != null) {
  // render melting point
}
```

Hoặc sử dụng helper để chỉ render những trường có dữ liệu.

---

## 17. Xử lý lỗi

Website cần xử lý các tình huống:

- không tải được `elements.json`;
- JSON sai định dạng;
- URL ảnh bị lỗi;
- dữ liệu trường bị thiếu;
- tìm kiếm không có kết quả.

Ví dụ khi JSON không tải được:

```text
Không thể tải dữ liệu bảng tuần hoàn.
Vui lòng thử lại.
```

---

## 18. Cách chạy project

Không nên mở bằng:

```text
file:///...
```

vì trình duyệt có thể chặn `fetch()` file JSON local.

### Cách 1 — Live Server

Trong VS Code:

```text
index.html
→ Right Click
→ Open with Live Server
```

### Cách 2 — Python HTTP Server

Mở Terminal tại thư mục project:

```bash
python -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

---

## 19. Workflow khi sử dụng OpenCode

Project có file:

```text
skill.md
```

OpenCode phải đọc file này trước khi thực hiện các thay đổi lớn.

Quy trình đề xuất:

```text
1. Đọc README.md
2. Đọc skill.md
3. Kiểm tra data/elements.json
4. Lập PLAN
5. Chờ duyệt PLAN
6. Implement từng phase
7. Test
8. Fix lỗi
9. Refactor nếu cần
```

Không nên yêu cầu OpenCode code toàn bộ project ngay trong một bước.

---

## 20. Các phase phát triển

### Phase 1 — Project Foundation

- Tạo cấu trúc project.
- Kết nối `elements.json`.
- Kiểm tra dữ liệu.
- Chỉ lấy nguyên tố 1–118.

### Phase 2 — Periodic Table

- Render 118 nguyên tố.
- Sử dụng `xpos` và `ypos`.
- Xử lý Lanthanides và Actinides.
- Phân màu theo category.

### Phase 3 — UI / UX

- Header.
- Legend.
- Hover.
- Animation.
- Responsive.
- Light/Dark mode.

### Phase 4 — Element Details

- Modal hoặc Side Panel.
- Ảnh nguyên tố.
- Bohr model.
- Thông tin vật lý và hóa học.
- Xử lý trường null.

### Phase 5 — Search & Filter

- Search.
- Category filter.
- Phase filter.
- Block filter.
- Highlight kết quả.

### Phase 6 — Polish

- Kiểm tra responsive.
- Fix lỗi.
- Tối ưu trải nghiệm.
- Refactor code.
- Test đủ 118 nguyên tố.

---

## 21. Tính năng phát triển sau

Sau khi phiên bản chính hoạt động ổn định có thể bổ sung:

### Quiz

Ví dụ:

```text
Nguyên tố nào có ký hiệu Na?
```

### Flashcard

Hiển thị:

```text
O
```

và yêu cầu học sinh đoán:

```text
Oxygen
```

### Fun Facts

Hiển thị kiến thức ngắn, dễ nhớ về từng nguyên tố.

### Highlight Group / Period

Hover hoặc click một nguyên tố để làm nổi bật:

- toàn bộ nhóm;
- toàn bộ chu kỳ.

### 3D Atom Viewer

Sử dụng dữ liệu:

```text
bohr_model_3d
```

để hiển thị mô hình 3D nếu trình duyệt và thư viện hỗ trợ.

---

## 22. Tiêu chí hoàn thành phiên bản đầu

Phiên bản đầu được xem là hoàn thành khi:

- [x] Tải thành công `data/elements.json`.
- [x] Chỉ sử dụng nguyên tố số 1–118.
- [x] Hiển thị đủ 118 nguyên tố.
- [x] Bố trí đúng bảng tuần hoàn.
- [x] Phân màu theo nhóm.
- [x] Click xem được chi tiết.
- [x] Search hoạt động.
- [x] Filter hoạt động.
- [x] Light/Dark mode hoạt động.
- [x] Không hiển thị dữ liệu `null`.
- [x] Có xử lý ảnh lỗi.
- [x] Responsive cơ bản.
- [x] Không có lỗi JavaScript nghiêm trọng trong Console.

---

## 23. Trạng thái hiện tại

Phiên bản đầu đã hoàn thành toàn bộ 6 phase (Foundation, Periodic Table, UI/UX, Element Details, Search & Filter, Testing & Polish).

Các chức năng đang hoạt động:

- Tải `data/elements.json`, chỉ sử dụng nguyên tố 1–118 (bỏ qua 119).
- Bảng tuần hoàn 18 cột × 10 hàng theo `xpos`/`ypos`; Lanthanide/Actinide ở khu vực riêng.
- Phân màu theo category + legend (click chip để lọc).
- Hover, animation load, Light/Dark mode (lưu `localStorage`), responsive, `prefers-reduced-motion`.
- Modal chi tiết (native `<dialog>`), null-safe, ảnh + Bohr model có fallback.
- Search (ưu tiên exact number/symbol/name rồi contains), filter category/phase/block kết hợp AND, nút "Xóa lọc".

Bước tiếp theo:

```text
Mở bằng HTTP server (python -m http.server 8000 hoặc Live Server)
        ↓
Kiểm tra trực quan trên desktop / tablet / mobile
        ↓
Phát triển thêm: Quiz, Flashcard, Fun Facts, 3D Atom Viewer, dịch tiếng Việt
```

---

## 24. Nguyên tắc quan trọng nhất

> **Dữ liệu nằm trong JSON, JavaScript xử lý dữ liệu, HTML/CSS chịu trách nhiệm hiển thị giao diện.**

Giữ project đơn giản, trực quan và tập trung vào trải nghiệm học tập của học sinh.
