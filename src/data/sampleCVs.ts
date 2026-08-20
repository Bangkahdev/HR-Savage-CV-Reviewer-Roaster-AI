export interface SampleCV {
  id: string;
  title: string;
  category: string;
  role: string;
  level: 'freshgrad' | 'junior' | 'mid' | 'senior';
  description: string;
  cvText: string;
}

export const SAMPLE_CVS: SampleCV[] = [
  {
    id: 'sample-freshgrad',
    title: 'Fresh Grad - Penuh Buzzwords & Nol Metrik',
    category: 'Fresh Graduate',
    role: 'Frontend Developer',
    level: 'freshgrad',
    description: 'Contoh CV klasik yang penuh kalimat klise seperti "hardworking", "team player", dan daftar tugas tanpa dampak nyata.',
    cvText: `ALEX WIJAYA
Email: alex.wijaya99@gmail.com | Phone: 08123456789 | Jakarta, Indonesia
LinkedIn: linkedin.com/in/alex-wijaya

TENTANG SAYA
Saya adalah lulusan baru Teknik Informatika yang jujur, pekerja keras, berdedikasi tinggi, dapat bekerja secara individu maupun dalam tim, serta memiliki kemampuan komunikasi yang baik dan cepat belajar hal-hal baru. Sangat tertarik berkarir di bidang web development.

PENGALAMAN KERJA / MAGANG
Junior Web Developer Intern - PT Solusi Digital Maju (Januari 2024 - April 2024)
- Bertanggung jawab membuat tampilan website menggunakan HTML, CSS, dan JavaScript.
- Membantu senior developer dalam memperbaiki bug di website.
- Ikut serta dalam rapat harian tim pengembangan.
- Mengelola database dan memastikan website berjalan dengan lancar.

PENGALAMAN ORGANISASI
Anggota Divisi IT - Himpunan Mahasiswa Informatika (2022 - 2023)
- Membantu menyukseskan acara seminar nasional kampus.
- Menjadi panitia publikasi dan dokumentasi.

KEAHLIAN & SKILL
- Hard Skills: HTML, CSS, JavaScript, React, PHP, MySQL, Microsoft Word, Microsoft Excel
- Soft Skills: Disiplin, Tanggung Jawab, Jujur, Kerja Keras, Time Management, Public Speaking

PENDIDIKAN
S1 Teknik Informatika - Universitas Bina Masa Depan (2020 - 2024)
IPK: 3.45 / 4.00`,
  },
  {
    id: 'sample-mid-dev',
    title: 'Mid Software Engineer - Copy Paste Jobdesc',
    category: 'Software Engineering',
    role: 'Backend Engineer',
    level: 'mid',
    description: 'CV developer berpengalaman 3 tahun tapi isinya hanya daftar tugas rutin pasif tanpa angka performa, skala, atau metrik bisnis.',
    cvText: `BUDI PRASETYO
budi.prasetyo@email.com | +62 811 9876 5432 | Tangerang Selatan
GitHub: github.com/budipras | Portfolio: budiprasetyo.dev

PROFESSIONAL SUMMARY
Backend Engineer dengan pengalaman 3 tahun dalam mengembangkan aplikasi web dan REST API menggunakan Node.js, Express, dan PostgreSQL. Terbiasa bekerja dengan metodologi Agile/Scrum.

WORK EXPERIENCE
Backend Developer - TokoDigital Nusantara (Juni 2022 - Sekarang)
- Mengembangkan RESTful API untuk modul pembayaran dan inventaris produk.
- Melakukan integrasi third-party payment gateway seperti Midtrans dan Xendit.
- Melakukan maintenance server dan memperbaiki bug yang dilaporkan tim QA.
- Menulis unit testing untuk memastikan keandalan kode.
- Berkolaborasi dengan Frontend Developer dan Product Manager dalam sprint mingguan.

Junior Backend Developer - PT Inovasi Solusi Prima (Maret 2021 - Mei 2022)
- Membuat endpoint backend menggunakan Express.js dan MongoDB.
- Melakukan query database untuk kebutuhan laporan bulanan.
- Membantu deployment aplikasi ke server AWS EC2.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Golang (Dasar), SQL
Frameworks & Tools: Node.js, Express.js, PostgreSQL, MongoDB, Redis, Docker, Git, Postman, AWS EC2

EDUCATION
Sarjana Komputer (S.Kom) - Universitas Mercu Buana (2017 - 2021)`,
  },
  {
    id: 'sample-marketing',
    title: 'Digital Marketer - Tanpa ROI & Data Analytics',
    category: 'Marketing',
    role: 'Digital Marketing Specialist',
    level: 'junior',
    description: 'CV marketer yang hanya fokus pada aktivitas posting konten tanpa menyertakan ROAS, pertumbuhan follower berbayar vs organik, atau konversi sales.',
    cvText: `SITI RAHMAWATI
Jakarta | 0819 8765 4321 | siti.rahma@email.com

RINGKASAN
Digital Marketing Specialist kreatif dengan passion tinggi dalam social media management, content creation, dan kampanye digital. Mahir mengoperasikan Meta Ads dan Google Ads.

PENGALAMAN
Digital Marketing Officer - PT Busana Trendy Indonesia (Agustus 2022 - Sekarang)
- Membuat kalender konten bulanan untuk akun Instagram dan TikTok perusahaan.
- Menjalankan iklan berbayar di Instagram Ads dan Facebook Ads.
- Meningkatkan engagement akun media sosial secara berkala.
- Bekerja sama dengan influencer dan Key Opinion Leader (KOL) untuk endorsement.
- Mengatur photoshoot produk dan editing video promosi mingguan.

Content Creator Freelance (2021 - 2022)
- Menulis artikel SEO untuk blog klien di industri kecantikan dan fashion.
- Membuat desain feeds menggunakan Canva dan Photoshop.

SKILLS
Social Media Marketing, Meta Ads, Copywriting, Canva, CapCut, SEO Basic, Influencer Relations, Microsoft Office`,
  },
  {
    id: 'sample-high-standard',
    title: 'Senior Product Lead - Format Kuat & Berbobot',
    category: 'Benchmark',
    role: 'Senior Product Manager',
    level: 'senior',
    description: 'Contoh CV berstandar tinggi dengan formula Google X-Y-Z, metrik pertumbuhan konkrit, dan arsitektur kepemimpinan produk.',
    cvText: `RADITYA ARYA, PM
raditya.pm@alumni.id | +62 813 5555 7777 | Jakarta, Indonesia | linkedin.com/in/raditya-arya

EXECUTIVE SUMMARY
Senior Product Manager dengan 6+ tahun pengalaman memimpin produk fintech & B2B SaaS bernilai jutaan dolar. Terbukti meningkatkan GMV sebesar 185% YoY, memangkas churn rate pengguna dari 8.4% ke 2.1%, dan memimpin 14 orang tim cross-functional (Engineering, Design, Data).

PROFESSIONAL EXPERIENCE
Senior Product Manager - PayNusantara (Seri B Fintech) | 2022 - Sekarang
- Meluncurkan fitur Instant Merchant Payout yang meningkatkan transaksi bulanan sebesar 42% ($3.2M ARR baru) dalam 6 bulan pertama.
- Memimpin inisiatif restrukturisasi onboarding KYC dengan Machine Learning OCR, memangkas drop-off rate dari 34% ke 8.5% dan mempercepat waktu verifikasi dari 48 jam ke <90 detik.
- Mengelola product roadmap kuartalan untuk 3 squads engineering (18 engineers) dengan tingkat ketepatan sprint delivery 96%.

Product Manager - Kredita Solusi | 2019 - 2022
- Merancang ulang alur pengajuan pinjaman UMKM berbasis credit scoring alternatif, melipatgandakan loan disbursement dari Rp12 Miliar ke Rp48 Miliar/bulan tanpa kenaikan rasio NPL (<1.2%).
- Menginisiasi sistem automasi pengingat via WhatsApp & push notification, mendongkrak tingkat repayment tepat waktu sebesar 28%.

CORE COMPETENCIES
Product Strategy, Unit Economics, A/B Testing & Experimentation, SQL & Amplitude, Wireframing (Figma), Agile/Scrum, Stakeholder Management, Go-To-Market (GTM)

EDUCATION & CERTIFICATIONS
- B.Sc in Computer Science - Institut Teknologi Bandung (Cum Laude, GPA: 3.82)
- Certified Scrum Product Owner (CSPO) & Reforge Product Strategy Alum`,
  },
];
