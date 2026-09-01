const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'student@gmail.com' },
    update: {},
    create: {
      email: 'student@gmail.com',
      password: hashedPassword,
      name: 'Test Student',
      role: 'STUDENT',
      studentId: '6412345679',
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@gmail.com' },
    update: {},
    create: {
      email: 'teacher@gmail.com',
      password: hashedPassword,
      name: 'Test Teacher',
      role: 'TEACHER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      password: hashedPassword,
      name: 'Test Admin',
      role: 'ADMIN',
    },
  });

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@gmail.com' },
    update: {},
    create: {
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });

  const tasksData = [
    { label: 'ส่งโครงงานวิจัยบทที่ 1', description: 'ส่งผ่านระบบ Google Classroom ก่อนเที่ยงคืน', priority: 'ด่วน', category: 'วิชาการ' },
    { label: 'อ่านหนังสือสอบกลางภาค', description: 'วิชาการพัฒนาเว็บ และระบบฐานข้อมูล', priority: 'ปกติ', category: 'วิชาการ' },
    { label: 'ลงทะเบียนกิจกรรม Open House', description: 'รับชั่วโมงกิจกรรม 10 ชั่วโมง', priority: 'ปกติ', category: 'กิจกรรม' },
    { label: 'คืนอุปกรณ์ยืมเรียน', description: 'MacBook Air ที่ยืมมาจากห้องแล็บ', priority: 'ด่วน', category: 'ทั่วไป' },
  ];

  for (const task of tasksData) {
    const existingTask = await prisma.task.findFirst({ where: { label: task.label, userId: user.id } });
    if (!existingTask) {
      await prisma.task.create({
        data: {
          ...task,
          userId: user.id,
        }
      });
    }
  }

  const rooms = [
    {
      name: 'Meeting Room A',
      capacity: 10,
      type: 'MEETING',
      description: 'ห้องประชุมขนาดเล็ก พร้อมทีวี 65 นิ้ว และไวท์บอร์ด',
      imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Meeting Room B',
      capacity: 20,
      type: 'MEETING',
      description: 'ห้องประชุมขนาดกลาง พร้อมโปรเจคเตอร์ เครื่องเสียง และไวท์บอร์ด',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Study Room 1',
      capacity: 4,
      type: 'STUDY',
      description: 'ห้องอ่านหนังสือและทำงานกลุ่มย่อย สำหรับนักศึกษา',
      imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Co-Working Space',
      capacity: 50,
      type: 'CO-WORKING',
      description: 'พื้นที่ส่วนกลางสำหรับทำงานและพูดคุย',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    }
  ];

  for (const room of rooms) {
    // using findFirst to avoid duplicates on multiple runs since name is not unique in schema
    const existing = await prisma.room.findFirst({ where: { name: room.name } });
    if (!existing) {
      await prisma.room.create({ data: room });
    }
  }

  const equipments = [
    {
      name: 'MacBook Air M1 (2020)',
      type: 'LAPTOP',
      description: 'แล็ปท็อปสำหรับใช้ทำงานกราฟิกและวิดีโอทั่วไป',
      imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Dell Latitude 3420',
      type: 'LAPTOP',
      description: 'แล็ปท็อประบบ Windows สำหรับใช้ทำงานเอกสารและโปรแกรมทั่วไป',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Epson EB-X41',
      type: 'PROJECTOR',
      description: 'โปรเจคเตอร์ความละเอียด XGA (1024x768) ความสว่าง 3600lm',
      imageUrl: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'HDMI Cable (5m)',
      type: 'CABLE',
      description: 'สายเชื่อมต่อสัญญาณภาพและเสียง HDMI ความยาว 5 เมตร',
      imageUrl: 'https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=800',
    }
  ];

  for (const equipment of equipments) {
    const existing = await prisma.equipment.findFirst({ where: { name: equipment.name } });
    if (!existing) {
      await prisma.equipment.create({ data: equipment });
    }
  }

  const courses = [
    {
      code: 'IT101',
      name: 'การเขียนโปรแกรมคอมพิวเตอร์เบื้องต้น',
      instructor: 'Test Teacher',
      schedule: 'จันทร์ 09:00 - 12:00',
      room: 'Lab 401',
    },
    {
      code: 'UX201',
      name: 'การออกแบบประสบการณ์ผู้ใช้ (UX/UI)',
      instructor: 'อ. สมหญิง งามพร้อม',
      schedule: 'อังคาร 13:00 - 16:00',
      room: 'Studio 205',
    },
    {
      code: 'DB301',
      name: 'ระบบฐานข้อมูลเบื้องต้น',
      instructor: 'ดร. วิทยา ข้อมูล',
      schedule: 'พุธ 09:00 - 12:00',
      room: 'Room 302',
    }
  ];

  for (const courseData of courses) {
    const course = await prisma.course.upsert({
      where: { code: courseData.code },
      update: courseData,
      create: courseData,
    });

    // Enroll the test user in this course
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        }
      }
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
        }
      });
    }
  }
  const activities = [
    {
      title: 'ค่ายอาสาพัฒนาชุมชน ครั้งที่ 15',
      description: 'กิจกรรมจิตอาสา ออกค่ายพัฒนาโรงเรียนในชนบท ทาสีอาคาร ปลูกต้นไม้ และจัดกิจกรรมสันทนาการให้น้องๆ',
      category: 'VOLUNTEER',
      date: '2026-07-15',
      startTime: '07:00',
      endTime: '17:00',
      location: 'โรงเรียนบ้านห้วยทราย จ.กาญจนบุรี',
      maxParticipants: 40,
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'การแข่งขันกีฬาสีภายใน SDU Games 2026',
      description: 'การแข่งขันกีฬาสีระหว่างคณะ ประกอบด้วยกีฬาฟุตซอล บาสเก็ตบอล วอลเลย์บอล และกรีฑา',
      category: 'SPORT',
      date: '2026-08-10',
      startTime: '08:00',
      endTime: '18:00',
      location: 'สนามกีฬาในร่ม มหาวิทยาลัยสวนดุสิต',
      maxParticipants: 200,
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba9c4e09?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'สัมมนาวิชาการ "AI กับอนาคตการศึกษาไทย"',
      description: 'สัมมนาเชิงวิชาการเกี่ยวกับบทบาทของปัญญาประดิษฐ์ (AI) ในระบบการศึกษาไทย โดยวิทยากรผู้เชี่ยวชาญ',
      category: 'ACADEMIC',
      date: '2026-07-25',
      startTime: '09:00',
      endTime: '16:00',
      location: 'ห้องประชุมชั้น 5 อาคาร 1',
      maxParticipants: 100,
      imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'เทศกาลศิลปวัฒนธรรม "สวนดุสิตรวมใจ"',
      description: 'งานเทศกาลวัฒนธรรมประจำปี รำไทย ดนตรี อาหารพื้นถิ่น และนิทรรศการผลงานนักศึกษา',
      category: 'CULTURAL',
      date: '2026-09-05',
      startTime: '10:00',
      endTime: '20:00',
      location: 'ลานกิจกรรมหน้าอาคารหอสมุด',
      maxParticipants: 300,
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    }
  ];

  for (const activity of activities) {
    const existing = await prisma.activity.findFirst({ where: { title: activity.title } });
    if (!existing) {
      await prisma.activity.create({ data: activity });
    }
  }

  console.log({ user, roomsCreated: rooms.length, equipmentsCreated: equipments.length, coursesCreated: courses.length, activitiesCreated: activities.length });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
