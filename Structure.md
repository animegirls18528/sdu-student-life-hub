# Project Structure

โครงสร้างไฟล์ของโปรเจกต์ `SDU Student Life Hub`

```text
sdu-student-life-hub/
├── AGENTS.md
├── CLAUDE.md
├── Dockerfile
├── docker-compose.yml
├── README.md
├── SDUstudentLife.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── prisma/
│   ├── dev.db
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
│       ├── migration_lock.toml
│       ├── 20260616135905_init_sqlite/
│       │   └── migration.sql
│       ├── 20260616142153_add_task_model/
│       │   └── migration.sql
│       └── 20260616143533_add_task_description/
│           └── migration.sql
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── src/
    ├── middleware.ts
    ├── components/
    │   ├── background-customizer.tsx
    │   ├── background-provider.tsx
    │   ├── theme-provider.tsx
    │   └── theme-toggle.tsx
    ├── lib/
    │   ├── auth.ts
    │   ├── logger.ts
    │   └── prisma.ts
    └── app/
        ├── favicon.ico
        ├── globals.css
        ├── layout.tsx
        ├── page.tsx
        ├── forgot-password/
        │   └── page.tsx
        ├── log-login/
        │   └── page.tsx
        ├── login/
        │   ├── layout.tsx
        │   └── page.tsx
        ├── register/
        │   └── page.tsx
        ├── reset-password/
        │   └── page.tsx
        ├── actions/
        │   ├── activities.ts
        │   ├── attendance.ts
        │   ├── auth.ts
        │   ├── equipment.ts
        │   ├── register.ts
        │   ├── reset-password.ts
        │   ├── rooms.ts
        │   └── tasks.ts
        └── dashboard/
            ├── layout.tsx
            ├── page.tsx
            ├── about/
            │   └── page.tsx
            ├── activities/
            │   ├── page.tsx
            │   ├── my-registrations/
            │   │   └── page.tsx
            │   └── [id]/
            │       └── page.tsx
            ├── announcements/
            │   └── page.tsx
            ├── attendance/
            │   ├── page.tsx
            │   └── [courseId]/
            │       └── page.tsx
            ├── components/
            │   ├── ConfirmModal.tsx
            │   ├── DashboardCharts.tsx
            │   └── SidebarNav.tsx
            ├── equipment/
            │   ├── page.tsx
            │   ├── my-bookings/
            │   │   └── page.tsx
            │   └── [id]/
            │       └── page.tsx
            ├── exams/
            │   └── page.tsx
            ├── logs/
            │   └── page.tsx
            ├── rooms/
            │   ├── page.tsx
            │   ├── my-bookings/
            │   │   └── page.tsx
            │   └── [id]/
            │       └── page.tsx
            ├── schedule/
            │   └── page.tsx
            └── tasks/
                ├── page.tsx
                └── TaskList.tsx
```

## อธิบายส่วนสำคัญ

### Root

- `package.json` : dependencies และ scripts ของโปรเจกต์
- `next.config.ts` : config ของ Next.js
- `tsconfig.json` : config TypeScript
- `Dockerfile`, `docker-compose.yml` : สำหรับ deploy/run ผ่าน Docker
- `SDUstudentLife.md` : เอกสาร prompt blueprint ของระบบ

### prisma

- `schema.prisma` : โครงสร้างฐานข้อมูลทั้งหมด
- `seed.js` : ข้อมูลตัวอย่างเริ่มต้นของระบบ
- `dev.db` : SQLite database ที่ใช้ในเครื่อง
- `migrations/` : ไฟล์ migration ของ Prisma

### public

- เก็บ asset ทั่วไปของเว็บ เช่น SVG

### src/lib

- `auth.ts` : session, login, logout, auth helper
- `prisma.ts` : Prisma client
- `logger.ts` : logging ของระบบ

### src/components

- `theme-provider.tsx` / `theme-toggle.tsx` : ระบบเปลี่ยนธีม
- `background-provider.tsx` / `background-customizer.tsx` : ระบบอัปโหลดและปรับพื้นหลัง

### src/app

- `page.tsx` : Home page
- `layout.tsx` : layout หลักของแอป
- `globals.css` : global styles
- `login/`, `register/`, `forgot-password/`, `reset-password/` : หน้ากลุ่ม authentication
- `actions/` : server actions สำหรับ auth, tasks, rooms, equipment, attendance, activities

### src/app/dashboard

- `layout.tsx` : layout ของส่วน dashboard
- `page.tsx` : หน้า overview dashboard
- `components/` : component เฉพาะ dashboard เช่น sidebar, charts, modal
- `schedule/` : ตารางเรียน
- `exams/` : ตารางสอบ
- `tasks/` : งานที่ต้องทำ
- `attendance/` : เช็คชื่อเข้าเรียน
- `rooms/` : จองห้อง
- `equipment/` : ยืมอุปกรณ์
- `activities/` : ลงทะเบียนกิจกรรม
- `announcements/` : ประกาศข่าวสาร
- `about/` : เกี่ยวกับทีมและติดต่อ
- `logs/` : หน้า log

## สรุปโครงสร้างเชิงระบบ

โปรเจกต์นี้แบ่งออกเป็น 5 ส่วนหลัก:

1. `Public Pages` : หน้าแรกและหน้าสมัคร/เข้าสู่ระบบ
2. `Protected Dashboard` : ระบบหลักหลังบ้านของนักศึกษา
3. `Server Actions` : logic ฝั่ง server สำหรับจัดการข้อมูล
4. `Database Layer` : Prisma + SQLite
5. `Shared Components` : theme, background, UI helpers
