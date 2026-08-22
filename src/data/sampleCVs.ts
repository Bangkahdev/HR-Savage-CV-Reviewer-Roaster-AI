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
    title: 'Fresh Graduate - Banyak Teknologi, Minim Bukti',
    category: 'Fresh Graduate',
    role: 'Software Engineer',
    level: 'freshgrad',
    description:
      'Contoh CV fresh graduate yang mencantumkan banyak teknologi tetapi belum menjelaskan proyek, kontribusi, atau hasil yang konkret.',
    cvText: `MUHAMMAD DHYAUL ATHA
Aceh, Indonesia
GitHub: github.com/Bangkah
LinkedIn: linkedin.com/in/muhammad-dhyaul-atha

PROFESSIONAL SUMMARY
Fresh graduate yang memiliki ketertarikan pada software engineering, backend development, DevOps, Linux, dan cloud computing. Memiliki kemampuan belajar teknologi baru dengan cepat dan mampu bekerja secara mandiri maupun dalam tim.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Go, Bash, SQL
Frontend: React, Next.js, Vite, Tailwind CSS
Backend: Node.js, Express.js, Go, REST API, gRPC
Database: PostgreSQL, MySQL, Redis, Supabase
DevOps: Git, GitHub Actions, Docker, CI/CD
Infrastructure: Linux, Networking, Cloud Native
Tools: GitHub, VS Code, Postman

PROJECTS
NetInfo
- Membuat CLI utility untuk menampilkan informasi sistem dan jaringan Linux.
- Menggunakan Bash untuk mengumpulkan informasi sistem dan network interface.
- Mendokumentasikan penggunaan dan instalasi project.

Personal Portfolio
- Mengembangkan website portfolio menggunakan React dan Vite.
- Menggunakan GitHub untuk version control.
- Mengatur proses build dan deployment menggunakan CI/CD.

EDUCATION
Politeknik Negeri Lhokseumawe
Program Studi Teknologi Informasi

CERTIFICATIONS & LEARNING
- eBPF Getting Started - Isovalent
- Cilium LB-IPAM & L2 - Isovalent
- Microsoft Learn
- Dicoding Indonesia

INTERESTS
Backend Engineering, DevOps, Linux, Cloud Native, Open Source, Platform Engineering`
  },

  {
    id: 'sample-junior-overclaim',
    title: 'Junior - Klaim Senior Tidak Sejalan dengan Bukti',
    category: 'Software Engineering',
    role: 'Senior DevOps Engineer',
    level: 'junior',
    description:
      'Contoh CV dengan technology stack yang terlihat advanced, tetapi pengalaman dan bukti proyek belum cukup mendukung klaim level senior.',
    cvText: `MUHAMMAD DHYAUL ATHA
Aceh, Indonesia
GitHub: github.com/Bangkah
LinkedIn: linkedin.com/in/muhammad-dhyaul-atha

PROFESSIONAL SUMMARY
Senior DevOps Enthusiast  dan Cloud Architect dengan sedikit keahlian dalam Kubernetes, AWS, Terraform, distributed systems, microservices, dan cloud-native infrastructure. mengoptimalkan infrastructure production.

TECHNICAL SKILLS
Cloud: AWS, GCP, Azure
Infrastructure: Kubernetes, Terraform, Helm, Ansible
DevOps: Docker, GitHub Actions, ArgoCD, Prometheus, Grafana
Backend: Go, Node.js, Python
Architecture: Microservices, Distributed Systems, Event-Driven Architecture
Networking: TCP/IP, DNS, Load Balancing, Service Mesh

PROJECTS
Cloud-Native Platform
- Mendesain arsitektur Kubernetes production untuk aplikasi enterprise.
- Mengimplementasikan multi-region deployment.
- Menggunakan Terraform untuk seluruh infrastructure provisioning.
- Mengimplementasikan observability menggunakan Prometheus dan Grafana.

Microservices Platform
- Mendesain sistem microservices menggunakan Go.
- Menggunakan Kafka untuk event streaming.
- Mengimplementasikan service mesh menggunakan Istio.

OPEN SOURCE
GitHub: github.com/Bangkah

EDUCATION
Politeknik Negeri Lhokseumawe

NOTE
Sebagian besar pengalaman cloud infrastructure dan enterprise architecture berasal dari personal projects, learning projects, dan eksperimen. Belum memiliki pengalaman profesional sebagai Senior DevOps Engineer atau Cloud Architect.`
  },

  {
    id: 'sample-mid',
    title: 'Mid Engineer - Teknologi Kuat, Impact Belum Terukur',
    category: 'Software Engineering',
    role: 'Backend / DevOps Engineer',
    level: 'mid',
    description:
      'Contoh CV engineer dengan technical breadth yang kuat, tetapi sebagian besar bullet masih menjelaskan apa yang dikerjakan tanpa mengukur dampaknya.',
    cvText: `MUHAMMAD DHYAUL ATHA
Software Engineer | Backend | DevOps | Linux | Cloud Native

GitHub: github.com/Bangkah
LinkedIn: linkedin.com/in/muhammad-dhyaul-atha

SUMMARY
Software engineer dengan fokus pada backend engineering, DevOps, Linux, dan cloud-native technologies. Sedikit berpengalaman mengembangkan personal projects, open source software, automation, dan sistem backend menggunakan berbagai teknologi modern.

TECHNICAL SKILLS
Languages: Go, TypeScript, JavaScript, Python, Bash, SQL
Backend: Node.js, Express.js, REST API, gRPC
Frontend: React, Next.js, Vite
Databases: PostgreSQL, MySQL, Redis, Supabase
Infrastructure: Linux, Docker, GitHub Actions, CI/CD
Cloud Native: Kubernetes, Cilium, eBPF
Tools: Git, GitHub, VS Code

SELECTED PROJECTS

NetInfo
- Mengembangkan CLI utility untuk Linux yang menampilkan informasi sistem dan jaringan.
- Menggunakan Bash untuk mengumpulkan informasi network interface dan system information.
- Menyediakan dokumentasi penggunaan dan instalasi.
- Mempublikasikan project sebagai open source.

OmniServe
- Merancang control plane untuk mengelola server dan agent.
- Menggunakan Next.js untuk administrative interface.
- Menggunakan Go untuk backend API dan agent.
- Menggunakan PostgreSQL sebagai database dan Redis sebagai cache.
- Menggunakan gRPC/HTTPS dan mTLS untuk komunikasi agent.
- Menyusun Software Requirements Specification dan risk register sebelum implementasi.

CI/CD & Automation
- Membuat GitHub Actions workflow untuk build, lint, audit, dan deployment.
- Mengintegrasikan automated checks dalam software development workflow.
- Menggunakan Docker dan container-based development workflow.

OPEN SOURCE & COMMUNITY
- Aktif mengembangkan dan memelihara repository GitHub.
- Berkontribusi melalui Pull Request dan collaborative development.
- Memiliki proyek open source yang digunakan sebagai media pembelajaran dan experimentation.

CERTIFICATIONS & LEARNING
- eBPF Getting Started - Isovalent
- Cilium LB-IPAM & L2 - Isovalent
- Dicoding Indonesia
- Microsoft Learn

EDUCATION
Politeknik Negeri Lhokseumawe`
  },

  {
    id: 'sample-benchmark',
    title: 'Senior Benchmark - Impact & Architecture',
    category: 'Benchmark',
    role: 'Senior Platform / DevOps Engineer',
    level: 'senior',
    description:
      'Benchmark CV senior yang menunjukkan bagaimana pengalaman engineering dapat ditulis menggunakan scope, architecture, ownership, reliability, dan measurable impact.',
    cvText: `MUHAMMAD DHYAUL ATHA
Platform Engineering | DevOps | Backend | Linux | Cloud Native

Aceh, Indonesia
GitHub: github.com/Bangkah
LinkedIn: linkedin.com/in/muhammad-dhyaul-atha

EXECUTIVE SUMMARY
Software engineer dengan fokus pada backend engineering, DevOps, Linux, dan cloud-native infrastructure. Memiliki sedikit pengalaman membangun software systems, developer tooling, automation, dan open source projects.

Mengembangkan project dengan pendekatan engineering yang mencakup architecture design, API development, database design, CI/CD, containerization, security, observability, dan infrastructure automation.

CORE COMPETENCIES
Backend Engineering
Platform Engineering
DevOps & CI/CD
Linux Systems
Cloud Native
System Architecture
Networking
Infrastructure Automation
Open Source Development
Security & mTLS

SELECTED ENGINEERING PROJECTS

OMNISERVE — Server Management Control Plane
Role: System Architect / Backend Developer

- Merancang control plane untuk mengelola server melalui centralized management architecture.
- Mendesain backend API menggunakan Go dengan PostgreSQL sebagai primary database dan Redis sebagai caching layer.
- Mendesain agent architecture menggunakan Go dengan komunikasi gRPC/HTTPS.
- Menggunakan mTLS sebagai security boundary antara control plane dan server agent.
- Menyusun 37 functional requirements dan 22 non-functional requirements sebelum implementasi.
- Mengidentifikasi 21 risiko sistem melalui risk register dan menentukan mitigation strategy untuk risiko kritis.
- Mendesain deployment architecture dan trust boundaries antar komponen sistem.

NETINFO — Linux System & Network Information CLI
Role: Open Source Maintainer

- Mengembangkan CLI utility untuk Linux yang mengumpulkan informasi sistem dan network environment.
- Menggunakan Bash untuk system inspection dan network information gathering.
- Menulis dokumentasi penggunaan dan instalasi.
- Memelihara repository open source dan menerima kontribusi melalui GitHub.

CI/CD & DEVELOPER AUTOMATION

- Mendesain GitHub Actions workflow untuk automated build, linting, dependency audit, dan deployment.
- Mengintegrasikan CI checks ke dalam repository development workflow.
- Menggunakan Docker dan container-based development.
- Menggunakan GitHub Pull Request workflow untuk collaboration dan code review.

CLOUD NATIVE & LINUX

- Mempelajari dan bereksperimen dengan eBPF dan Cilium.
- Menyelesaikan learning path terkait eBPF dan Cilium melalui Isovalent.
- Memahami konsep container networking, load balancing, Linux networking, dan cloud-native infrastructure.
- Mengembangkan ketertarikan pada platform engineering dan infrastructure automation.

TECHNICAL STACK

Languages:
Go, TypeScript, JavaScript, Python, Bash, SQL

Backend:
Node.js, Express.js, Go, REST API, gRPC

Frontend:
React, Next.js, Vite, Tailwind CSS

Databases:
PostgreSQL, MySQL, Redis, Supabase

Infrastructure:
Linux, Docker, GitHub Actions, CI/CD

Cloud Native:
Kubernetes, Cilium, eBPF

Tools:
Git, GitHub, VS Code, Postman

OPEN SOURCE

GitHub: github.com/Bangkah

- Open source maintainer
- Pull Request based collaboration
- Continuous Integration
- Project documentation
- Developer tooling

EDUCATION

Politeknik Negeri Lhokseumawe

CERTIFICATIONS & LEARNING

- eBPF Getting Started — Isovalent
- Cilium LB-IPAM & L2 — Isovalent
- Dicoding Indonesia
- Microsoft Learn

CAREER DIRECTION

Backend Engineering
DevOps Enthusiast 
Platform Engineering
Cloud Native Infrastructure
Linux Systems
Open Source Software`
  },
];