# SDU Student Life Hub Prompt Blueprint

เอกสารนี้สรุปภาพรวมของระบบ `SDU Student Life Hub` ทั้งหมดในรูปแบบที่นำไปใช้เป็น Prompt สำหรับสร้างเว็บใหม่ที่มีโครงสร้างใกล้เคียงกันได้ โดยครอบคลุมแนวคิดของระบบ เทคโนโลยีที่ใช้ หน้าต่างๆ ฟีเจอร์ โครงสร้างฐานข้อมูล และข้อกำหนดด้านดีไซน์

## 1. เป้าหมายของระบบ

สร้างเว็บแอปสำหรับนักศึกษามหาวิทยาลัยที่รวมบริการสำคัญไว้ในที่เดียว เช่น

- เข้าสู่ระบบ / สมัครสมาชิก
- ดูภาพรวมข้อมูลการเรียน
- ตารางเรียน
- ตารางสอบ
- รายการสิ่งที่ต้องทำ
- เช็คชื่อเข้าเรียน
- จองห้อง
- ยืมอุปกรณ์
- ลงทะเบียนกิจกรรม
- ประกาศข่าวสาร
- หน้าเกี่ยวกับทีมและช่องทางติดต่อ
- ปรับแต่งพื้นหลังของพื้นที่เนื้อหาได้ด้วยการอัปโหลดรูป

แนวคิดหลักคือเป็น `Student Life Platform` ที่ใช้งานง่าย ดูทันสมัย รองรับ Light/Dark mode และมี Dashboard แบบข้อมูลสรุปพร้อมกราฟ

## 2. เทคโนโลยีที่ใช้

- Framework: `Next.js 16` แบบ `App Router`
- Language: `TypeScript`
- Styling: `Tailwind CSS v4`
- Icons: `lucide-react`
- Charts: `recharts`
- Theme: `next-themes`
- Database ORM: `Prisma`
- Database: `SQLite`
- Auth / Session: custom auth ด้วย `jose`, `jsonwebtoken`, cookie session
- Password Hashing: `bcrypt`
- Validation: `zod`
- Email support: `nodemailer`
- Logging: `winston`

## 3. สไตล์และแนวทาง UI

### 3.1 โทนภาพรวม

- ดีไซน์โมเดิร์น เรียบ หรู ใช้ whitespace เยอะ
- มุมโค้งเยอะ เช่น `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- ใช้สีน้ำเงินเป็น primary color
- Light mode ใช้พื้นขาว/เทาอ่อน
- Dark mode ใช้ดำ/เทาเข้ม
- Dashboard toolbars เช่น sidebar และ topbar ต้องเป็นสีทึบตาม theme
- พื้นที่เนื้อหาหลักสามารถแสดงรูปพื้นหลังที่ผู้ใช้ปรับเองได้

### 3.2 ลักษณะคอมโพเนนต์

- Card-based UI
- ปุ่ม CTA ชัดเจน
- ใช้ไอคอนประกอบแทบทุกฟีเจอร์
- รองรับ responsive ทั้ง desktop และ mobile
- Forms ต้องมี validation และแสดง error ได้ชัด

## 4. โครงสร้างหน้าทั้งหมด

### 4.1 Public Pages

#### Home Page

องค์ประกอบหลัก:

- Header พร้อม logo, navigation, CTA
- Hero section พร้อมข้อความชัดเจน
- Services section แนะนำบริการหลัก
- Benefits / จุดเด่นของระบบ
- Trust signals เช่น จำนวนผู้ใช้ คะแนนความพึงพอใจ
- Footer พร้อมลิงก์และข้อมูลติดต่อ

แนวคิด copy:

- ยกระดับชีวิตนักศึกษาให้ง่ายขึ้น
- รวมตารางเรียน จองห้อง ยืมอุปกรณ์ และกิจกรรมในที่เดียว

#### Login Page

องค์ประกอบ:

- โลโก้ระบบ
- Email field
- Password field พร้อม show/hide password
- Remember me
- Forgot password
- Social login buttons แบบ Google / Facebook / Apple
- Error banner
- Rate limit countdown เมื่อพยายาม login ผิดหลายครั้ง

#### Register Page

องค์ประกอบ:

- Name
- Email
- Password
- Confirm password
- Terms and conditions checkbox
- Social signup buttons
- Redirect ไปหน้า login หลังสมัครสำเร็จ

#### Forgot Password / Reset Password

- ฟอร์มขอรีเซ็ตรหัสผ่าน
- ฟอร์มตั้งรหัสผ่านใหม่
- validation และ token flow

### 4.2 Protected Pages

ทุกหน้าในกลุ่ม dashboard ต้อง login ก่อน

#### Dashboard Overview

มี:

- summary cards
- line chart / donut chart
- recent activities table
- notifications
- quick actions
- profile card

#### Schedule Page

- ตารางเรียนรายวัน/รายสัปดาห์
- แสดงเวลา วิชา ห้องเรียน อาจารย์ และสถานะ

#### Exams Page

- ตารางสอบ
- รายวิชา วัน เวลา และสถานที่สอบ

#### Tasks Page

- To-do list ของนักศึกษา
- เพิ่ม / แก้ไข / ทำเสร็จ / จัดหมวดหมู่ / priority

#### Attendance Page

- รายวิชาที่ลงทะเบียน
- สถานะการเข้าเรียน เช่น PRESENT, LATE, ABSENT, EXCUSED
- รายละเอียดแยกรายวิชา

#### Rooms Page

- รายการห้อง
- รายละเอียดห้อง
- จองห้อง
- ดูประวัติการจองของตัวเอง

#### Equipment Page

- รายการอุปกรณ์
- รายละเอียดอุปกรณ์
- ยืมอุปกรณ์
- ดูรายการยืมของตัวเอง

#### Activities Page

- รายการกิจกรรม
- รายละเอียดกิจกรรม
- ลงทะเบียนเข้าร่วม
- ดูกิจกรรมที่ลงทะเบียนแล้ว

#### Announcements Page

- แสดงประกาศข่าวสาร
- ลิสต์แบบอ่านง่าย

#### About Page

มี 2 ส่วนหลัก:

- สมาชิกทีมพัฒนา 3 คน
- ฟอร์มติดต่อและข้อมูลติดต่อ

ข้อมูลทีมในระบบนี้:

- นายนิธิศ เลิศรัชต์ - 6811011662001 - Full-stack Developer
- นายปภาวิน วิริยวิชาการ - 6811011662003 - UI/UX Designer
- นายอนุกูล บุญทา - 6811011662004 - Backend Developer

## 5. ระบบนำทาง

Sidebar หลักใน Dashboard ประกอบด้วย:

- แผงควบคุม
- ตารางเรียน
- ตารางสอบ
- รายการสิ่งที่ต้องทำ
- เช็คชื่อเข้าเรียน
- จองห้อง
- ยืมอุปกรณ์
- ลงทะเบียนกิจกรรม
- ประกาศข่าวสาร
- เกี่ยวกับเรา
- Log

Topbar ใน Dashboard มี:

- ปุ่มปรับพื้นหลัง
- ปุ่มเปลี่ยน theme
- ปุ่ม About us
- ปุ่ม notification
- ปุ่ม logout ในส่วนโปรไฟล์ด้านล่าง sidebar

## 6. ฟีเจอร์สำคัญของระบบ

### 6.1 Authentication

- สมัครสมาชิกด้วย email/password
- login ด้วย email/password
- password hash ด้วย bcrypt
- session-based auth
- logout
- forgot/reset password
- rate limiting สำหรับ login
- lock account เมื่อพยายามผิดหลายครั้ง

### 6.2 Background Customizer

ผู้ใช้สามารถ:

- อัปโหลดรูปภาพพื้นหลัง
- ดู preview
- ปรับ brightness
- ปรับ opacity
- บันทึกลง `localStorage`
- reset กลับค่าเริ่มต้น

เงื่อนไข UX:

- แสดงพื้นหลังเฉพาะพื้นที่เนื้อหาหลัก
- sidebar และ header ต้องยังเป็นสีทึบ
- รองรับ Light/Dark mode

### 6.3 Data Visualization

- Attendance line chart
- Activity donut chart
- สรุป trend cards

### 6.4 CRUD / Booking / Registration

- Task CRUD
- Room booking
- Equipment booking
- Activity registration
- Attendance records

## 7. โครงสร้างฐานข้อมูล

ฐานข้อมูลใช้ Prisma + SQLite

### ตารางทั้งหมด

#### User

เก็บข้อมูลผู้ใช้

- id
- email
- password
- role
- name
- studentId
- resetToken
- resetTokenExpires
- failedLoginAttempts
- isLocked
- lockedUntil
- createdAt
- updatedAt

ความสัมพันธ์:

- 1 user มีหลาย tasks
- 1 user มีหลาย room bookings
- 1 user มีหลาย equipment bookings
- 1 user มีหลาย enrollments
- 1 user มีหลาย attendances
- 1 user มีหลาย activity registrations

#### LoginLog

เก็บประวัติการพยายาม login

- id
- username
- success
- createdAt

#### Task

เก็บรายการสิ่งที่ต้องทำ

- id
- label
- description
- priority
- category
- completed
- userId
- createdAt
- updatedAt

#### Room

เก็บข้อมูลห้อง

- id
- name
- capacity
- type
- description
- imageUrl
- createdAt
- updatedAt

#### RoomBooking

เก็บการจองห้อง

- id
- roomId
- userId
- date
- startTime
- endTime
- purpose
- status
- createdAt
- updatedAt

#### Equipment

เก็บข้อมูลอุปกรณ์

- id
- name
- type
- description
- imageUrl
- status
- createdAt
- updatedAt

#### EquipmentBooking

เก็บข้อมูลการยืมอุปกรณ์

- id
- equipmentId
- userId
- date
- startTime
- endTime
- purpose
- status
- createdAt
- updatedAt

#### Course

เก็บข้อมูลวิชาเรียน

- id
- code
- name
- instructor
- schedule
- room
- createdAt
- updatedAt

#### Enrollment

เก็บว่านักศึกษาคนไหนลงวิชาอะไร

- id
- userId
- courseId
- createdAt
- updatedAt

#### Attendance

เก็บข้อมูลการเข้าเรียน

- id
- userId
- courseId
- date
- status
- createdAt
- updatedAt

#### Activity

เก็บข้อมูลกิจกรรม

- id
- title
- description
- category
- date
- startTime
- endTime
- location
- maxParticipants
- imageUrl
- createdAt
- updatedAt

#### ActivityRegistration

เก็บข้อมูลการลงทะเบียนกิจกรรม

- id
- activityId
- userId
- status
- createdAt
- updatedAt

## 8. ข้อมูลตัวอย่างที่ระบบมี

Seed data หลัก:

- ผู้ใช้ตัวอย่าง `student@gmail.com`
- ห้องประชุม / ห้องอ่านหนังสือ
- อุปกรณ์ เช่น laptop, projector, cable
- วิชาเรียน 3 วิชา
- กิจกรรมหลายหมวด เช่น volunteer, sport, academic, cultural
- tasks ตัวอย่างสำหรับ dashboard

## 9. แนวทาง Implementation ที่ควรใช้ซ้ำ

### Frontend

- ใช้ App Router แยก route ตาม feature
- ใช้ server component สำหรับ page ที่ดึงข้อมูล
- ใช้ client component สำหรับ form interaction, toggles, preview, charts
- ใช้ Tailwind utility classes เป็นหลัก
- ใช้ card layout และ icon-driven sections

### Backend

- ใช้ Server Actions สำหรับ form submission
- ใช้ Zod ตรวจ validation
- ใช้ Prisma query สำหรับ CRUD และ relations
- ใช้ bcrypt hash password
- ใช้ session cookie สำหรับ auth

### Security

- hash password
- validate ทุก input
- login rate limiting
- account lock
- reset password token
- sanitize / ตรวจสอบข้อมูลก่อนบันทึก

## 10. Prompt หลักสำหรับสร้างเว็บใหม่

คัดลอก prompt ด้านล่างไปใช้กับ AI เพื่อสร้างเว็บใหม่แนวเดียวกัน:

```text
สร้างเว็บแอปชื่อ "Student Life Hub" สำหรับนักศึกษาในมหาวิทยาลัย โดยใช้ Next.js App Router + TypeScript + Tailwind CSS + Prisma + SQLite

ต้องการเว็บที่มีดีไซน์ modern, premium, clean, rounded, ใช้สีน้ำเงินเป็น primary color, รองรับ Light/Dark mode และมี Dashboard ที่ดูเป็นระบบ SaaS สำหรับนักศึกษา

ฟังก์ชันหลักต้องมีดังนี้:

1. Public pages
- Home page แบบ landing page ที่มี header, hero, services, benefits, trust signals และ footer
- Login page พร้อม email/password, show-hide password, remember me, forgot password, error handling, rate limit UI และ social buttons
- Register page พร้อม name, email, password, confirm password, terms checkbox และ social buttons
- Forgot password page
- Reset password page

2. Protected dashboard
- Dashboard overview พร้อม stat cards, charts, recent activity table, quick actions, notifications และ profile card
- Schedule page
- Exams page
- Tasks page แบบ to-do list
- Attendance page
- Rooms page + room detail + booking + my bookings
- Equipment page + equipment detail + booking + my bookings
- Activities page + activity detail + registration + my registrations
- Announcements page
- About page ที่มีทีมพัฒนาและฟอร์มติดต่อ

3. Dashboard layout
- มี sidebar และ topbar
- Sidebar และ topbar ต้องเป็นสีทึบ 100% ตาม theme
- พื้นที่เนื้อหาหลักสามารถเปลี่ยนรูปพื้นหลังได้ด้วยการอัปโหลดรูป
- มีระบบ background customizer ที่ปรับ brightness และ opacity ได้ พร้อม preview และปุ่ม save

4. Authentication and security
- ใช้ bcrypt hash password
- ใช้ Prisma กับ User model
- มี session-based authentication
- มี login rate limiting
- มี account lock เมื่อ login ผิดหลายครั้ง
- มี forgot/reset password flow

5. Database models
สร้าง Prisma schema ที่มี models ต่อไปนี้:
- User
- LoginLog
- Task
- Room
- RoomBooking
- Equipment
- EquipmentBooking
- Course
- Enrollment
- Attendance
- Activity
- ActivityRegistration

6. Design requirements
- ใช้ card layout
- rounded corners ขนาดใหญ่
- icon-based sections ด้วย lucide-react
- charts ด้วย recharts
- responsive ทั้ง desktop และ mobile
- ฟอร์มใช้งานง่าย มี validation ชัดเจน

7. Data seed
สร้าง mock/seed data สำหรับ:
- student user
- rooms
- equipment
- courses
- activities
- tasks

8. Output expectation
- เขียนโค้ดแบบ production-style
- แยก components ให้ชัดเจน
- ใช้ server actions สำหรับ forms
- ใช้ zod validation
- สร้าง UI ให้สวยและพร้อมใช้งานจริง ไม่ใช่แค่ prototype
```

## 11. Prompt แบบละเอียดสำหรับใช้ต่อยอด

```text
ช่วยสร้างเว็บมหาวิทยาลัยแนว Student Services Portal ที่มีประสบการณ์ใช้งานทันสมัยแบบ SaaS dashboard โดยให้โครงสร้างและฟีเจอร์ใกล้เคียงกับระบบ SDU Student Life Hub

Requirements:

- Tech stack: Next.js App Router, TypeScript, Tailwind CSS, Prisma, SQLite, Zod, bcrypt, next-themes, recharts, lucide-react
- Theme: รองรับ light/dark
- Branding: clean, academic, modern, trustworthy
- Layout:
  - public landing page
  - authentication pages
  - protected dashboard with sidebar and topbar
- Dashboard content area ต้องรองรับ custom background image upload พร้อม brightness/opacity controls และ localStorage persistence
- Toolbars ต้องเป็น solid white ใน light mode และ solid black ใน dark mode

Modules:
- Auth
- Dashboard overview
- Schedule
- Exams
- Tasks
- Attendance
- Room booking
- Equipment borrowing
- Activity registration
- Announcements
- About and contact

Database:
- User, LoginLog, Task, Room, RoomBooking, Equipment, EquipmentBooking, Course, Enrollment, Attendance, Activity, ActivityRegistration

Auth details:
- email/password login
- secure password hash
- register with confirm password
- forgot/reset password
- brute-force protection
- account lock after repeated failed attempts

Design details:
- rounded cards
- primary blue accents
- statistics cards
- tables and filters
- charts with meaningful demo data
- polished Thai-first interface

Also include:
- Prisma seed script
- reusable components
- clean folder structure
- realistic mock data for a university
```

## 12. สรุปสั้นที่สุด

ถ้าจะสร้างเว็บใหม่จากเอกสารนี้ ให้คิดว่าเป็น:

`University Student SaaS Dashboard + Auth + Booking + Activity + Attendance + Custom Content Background + Modern Landing Page`

ไฟล์นี้เหมาะใช้เป็นทั้ง:

- เอกสารสรุประะบบ
- เอกสารส่งต่อทีม
- Prompt ตั้งต้นให้ AI สร้างเว็บใหม่
- checklist สำหรับเช็กว่าระบบมีครบทุกส่วนหรือยัง
