import { Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bug, BriefcaseBusiness, Check, CheckCircle2,
  ChevronRight, CircleDot, CloudDownload, Code2, Copy,
  ExternalLink, Eye, FileText, Filter, Github, GitBranch, Globe2, GraduationCap, Layers3, Linkedin, Mail,
  Menu, MessageSquare, MousePointerClick, Phone, Send, ShieldCheck, Smartphone, Terminal, TestTube2, X, Zap
} from 'lucide-react';

const profile = {
  name: 'Katamraj Madagoni',
  title: 'QA Engineer',
  subtitle: 'Manual & Automation Testing',
  tagline: 'Turning software quality into confidence.',
  email: 'katamraj96@gmail.com',
  phone: '+91 7893063160',
  location: 'Hyderabad, India',
  linkedin: '#',
  github: '#',
};

const navItems = [
  ['Home', 'home'], ['About', 'about'], ['Skills', 'skills'], ['Experience', 'experience'],
  ['Projects', 'projects'], ['Automation Lab', 'automation'], ['QA Showcase', 'showcase'], ['Contact', 'contact'],
];

const skills = {
  'Manual Testing': ['Functional Testing', 'Regression Testing', 'Smoke Testing', 'Sanity Testing', 'UI Testing', 'Mobile Testing', 'Test Case Design', 'Bug Reporting'],
  'Automation Testing': ['Playwright', 'TypeScript', 'JavaScript', 'Page Object Model', 'Automation Basics'],
  Tools: ['JIRA', 'Postman', 'SQL', 'Git', 'GitHub', 'VS Code'],
};

const projects = [
  { name: 'LMS ERP', type: 'Learning platform', tag: 'Multi-role ecosystem', icon: Layers3, color: 'cyan', description: 'A Learning Management System with multiple modules and user roles, spanning admin, student, teacher and parent experiences.', scope: ['Admin Web Application', 'Admin Mobile Application', 'Student Portal', 'Teacher Portal', 'Parent Portal', 'Finance Management', 'HR and People', 'Examination Management', 'Attendance', 'Reports', 'Role-Based Access Control'], responsibilities: ['Functional testing', 'Regression testing', 'Web and mobile comparison', 'UI validation', 'Bug identification', 'Retesting'] },
  { name: 'Salon Management System', type: 'Business operations', tag: 'Workflow precision', icon: Smartphone, color: 'blue', description: 'A salon management platform for appointments, staff, customers and business operations.', scope: ['Appointment Management', 'Point of Sale', 'Payments', 'CRM', 'Inventory', 'Staff Management', 'Attendance', 'Leave Management', 'Loyalty Programs', 'Memberships'], responsibilities: ['End-to-end testing', 'UI testing', 'Workflow validation', 'Payment flow testing', 'Defect reporting', 'Regression testing'] },
  { name: 'Trainzo Management System', type: 'Training platform', tag: 'Structured learning', icon: GraduationCap, color: 'violet', description: 'A training management platform connecting classrooms, trainers, courses and enrollments.', scope: ['Classrooms', 'Trainers', 'Courses', 'Batches', 'Timetables', 'Enrollments', 'Students', 'Finance', 'Roles and Permissions'], responsibilities: ['Functional testing', 'Module testing', 'UI validation', 'Workflow testing', 'Regression testing'] },
];

const labExamples = [
  { label: 'Browser launch', file: 'browser.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('launches the browser and opens the app', async ({ browser }) => {\n  const page = await browser.newPage();\n  await page.goto('https://example.test');\n  await expect(page).toHaveTitle(/Home/);\n  await page.close();\n});` },
  { label: 'Page navigation', file: 'navigation.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('navigates between pages', async ({ page }) => {\n  await page.goto('https://example.test');\n  await page.click('text=Products');\n  await expect(page).toHaveURL(/\\/products/);\n  await page.goBack();\n  await expect(page).toHaveURL('https://example.test');\n});` },
  { label: 'Locators', file: 'locators.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('uses built-in locators', async ({ page }) => {\n  await page.goto('https://example.test');\n  const search = page.getByPlaceholder('Search');\n  const card = page.getByRole('article').first();\n  await expect(search).toBeVisible();\n  await expect(card).toBeVisible();\n});` },
  { label: 'Click actions', file: 'click.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('performs click actions', async ({ page }) => {\n  await page.goto('https://example.test');\n  await page.getByRole('button', { name: 'Add to cart' }).click();\n  await expect(page.getByText('Item added')).toBeVisible();\n});` },
  { label: 'Text input', file: 'input.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('fills text inputs', async ({ page }) => {\n  await page.goto('https://example.test/register');\n  await page.getByLabel('Full name').fill('Katamraj Madagoni');\n  await page.getByLabel('Email').fill('katamraj96@gmail.com');\n  await expect(page.getByLabel('Full name')).toHaveValue('Katamraj Madagoni');\n});` },
  { label: 'Assertions', file: 'assertions.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('verifies element state with assertions', async ({ page }) => {\n  await page.goto('https://example.test');\n  const button = page.getByRole('button', { name: 'Submit' });\n  await expect(button).toBeEnabled();\n  await expect(button).toHaveText('Submit');\n  await expect(page.locator('h1')).toHaveCount(1);\n});` },
  { label: 'Login automation', file: 'login.spec.ts', code: `import { test, expect } from '@playwright/test';\n\ntest('signs in with valid credentials', async ({ page }) => {\n  await page.goto('https://example.test/login');\n  await page.getByLabel('Email').fill('qa@example.com');\n  await page.getByLabel('Password').fill('Secret123!');\n  await page.getByRole('button', { name: 'Sign in' }).click();\n  await expect(page.getByText('Welcome back')).toBeVisible();\n  await expect(page).toHaveURL(/\\/dashboard/);\n});` },
  { label: 'Page Object Model', file: 'login.page.ts', code: `import { Page, Locator } from '@playwright/test';\n\nexport class LoginPage {\n  readonly email: Locator;\n  readonly password: Locator;\n  readonly submit: Locator;\n\n  constructor(private readonly page: Page) {\n    this.email = page.getByLabel('Email');\n    this.password = page.getByLabel('Password');\n    this.submit = page.getByRole('button', { name: 'Sign in' });\n  }\n\n  async goto() {\n    await this.page.goto('https://example.test/login');\n  }\n\n  async login(email: string, password: string) {\n    await this.email.fill(email);\n    await this.password.fill(password);\n    await this.submit.click();\n  }\n}` },
  { label: 'API testing', file: 'api.spec.ts', code: `import { test, expect, request } from '@playwright/test';\n\ntest('validates the users API', async () => {\n  const context = await request.newContext();\n\n  const ok = await context.get('/api/users', {\n    headers: { Authorization: 'Bearer valid-token' },\n  });\n  expect(ok.status()).toBe(200);\n  const body = await ok.json();\n  expect(body.data).toBeDefined();\n  expect(Array.isArray(body.data)).toBeTruthy();\n\n  const denied = await context.get('/api/users');\n  expect(denied.status()).toBe(401);\n\n  await context.dispose();\n});` },
];

type KnowledgeEntry = { title: string; description: string; steps: string[]; expected: string; actual?: string };

const knowledge: Record<string, KnowledgeEntry> = {
  'Sample Test Case': { title: 'Login with valid credentials', description: 'Verify that an approved user can sign in and reach the correct dashboard.', steps: ['Open the sign-in page', 'Enter a registered email address', 'Enter the correct password', 'Click the Sign in button'], expected: 'The user reaches the dashboard and sees a personalized welcome message.', actual: 'The user reaches the dashboard successfully.' },
  'Bug Report': { title: 'Error message overlaps password field on mobile', description: 'On smaller screens, the validation message covers the password input, preventing the user from seeing what they type.', steps: ['Open the sign-in page at a 375px viewport width', 'Leave the email field empty', 'Tap Sign in to trigger validation', 'Observe the validation message position'], expected: 'The validation message appears beneath the password field without covering any input.', actual: 'The validation message overlays the password field.' },
  'Test Scenario': { title: 'Shopping cart checkout flow', description: 'Validate the end-to-end checkout journey from cart to order confirmation.', steps: ['Add a product to the cart', 'Open the cart and proceed to checkout', 'Enter shipping and payment details', 'Place the order'], expected: 'The order is placed and a confirmation page with an order number is shown.' },
  'API Testing': { title: 'User list returns an authorized response', description: 'Validate response status, body shape and authorization behavior for the user endpoint.', steps: ['Send a GET request to /api/users with a valid token', 'Inspect the status code and response body', 'Repeat the request without the token'], expected: 'Authorized requests return 200 with a data array; unauthenticated requests return 401.', actual: 'Matches the expected contract.' },
  'SQL Query': { title: 'Validate an active user record', description: 'A simple data check used during functional validation to confirm the database matches the UI.', steps: ['Connect to the test database', 'Run: SELECT id, name, is_active FROM users WHERE email = ?', 'Compare the returned record with the application UI'], expected: 'The active flag is true and the displayed name matches the application.', actual: 'The record is available for comparison.' },
  'Functional Testing': { title: 'Create a new appointment', description: 'Verify that a user can create an appointment and it appears in the schedule.', steps: ['Navigate to the appointment module', 'Click New appointment', 'Select a date, time and staff member', 'Save the appointment'], expected: 'The appointment is saved and visible in the schedule for the selected date.' },
  'Regression Testing': { title: 'Login still works after profile update release', description: 'Confirm that a new release does not break the existing login flow.', steps: ['Run the login test suite on the new build', 'Verify both valid and invalid credential scenarios', 'Check that the dashboard loads after login'], expected: 'All login scenarios pass and the dashboard behaves as before.', actual: 'All scenarios pass.' },
};

type Project = typeof projects[number];

const canHover = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
const isSmallScreen = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;

function particlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 4 + Math.random() * 3.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => particlePositions(isSmallScreen ? 90 : 220), []);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.03; });
  return <Points ref={ref} positions={positions} stride={3} frustumCulled={false}><PointMaterial transparent color="#67e8f9" size={0.035} sizeAttenuation depthWrite={false} opacity={0.7} /></Points>;
}

function HeroScene() {
  const reduce = useReducedMotion();
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const spin = useRef(0);
  useFrame((_, delta) => {
    if (!reduce) spin.current += delta * 0.1;
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, spin.current + pointer.x * 0.4, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.1 + pointer.y * 0.2, 0.05);
    }
  });
  return <group ref={group}>
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.55}>
      <mesh position={[0, 0.1, 0]}>
        <icosahedronGeometry args={[1.5, 2]} />
        <MeshDistortMaterial color="#45d9f5" emissive="#075985" emissiveIntensity={0.5} roughness={0.2} metalness={0.75} distort={0.26} speed={1.8} />
      </mesh>
    </Float>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <torusGeometry args={[2.1, 0.012, 16, 100]} />
      <meshBasicMaterial color="#7dd3fc" transparent opacity={0.55} />
    </mesh>
    <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0, 0]}>
      <torusGeometry args={[1.8, 0.01, 16, 80]} />
      <meshBasicMaterial color="#a78bfa" transparent opacity={0.4} />
    </mesh>
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}><Sphere args={[0.09, 16, 16]} position={[2.2, 0.8, 0.2]}><meshBasicMaterial color="#d9f99d" /></Sphere></Float>
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1.2}><Sphere args={[0.06, 16, 16]} position={[-2, -0.7, 0.4]}><meshBasicMaterial color="#67e8f9" /></Sphere></Float>
    <Float speed={1.8} rotationIntensity={1} floatIntensity={1.3}><mesh position={[1.6, -1.1, 0.6]} rotation={[0.5, 0.5, 0]}><boxGeometry args={[0.14, 0.14, 0.14]} /><meshStandardMaterial color="#a78bfa" emissive="#4c1d95" emissiveIntensity={0.4} roughness={0.3} metalness={0.7} /></mesh></Float>
    <ParticleField />
  </group>;
}

function AboutScene() {
  const reduce = useReducedMotion();
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => { if (ref.current && !reduce) ref.current.rotation.y += delta * 0.18; });
  return <group ref={ref}>
    <mesh position={[0, 0, 0]} rotation={[0.3, 0, 0.2]}>
      <torusKnotGeometry args={[0.9, 0.28, 120, 16]} />
      <meshStandardMaterial color="#60a5fa" emissive="#1e3a8a" emissiveIntensity={0.5} roughness={0.25} metalness={0.8} wireframe />
    </mesh>
    <Float speed={1.4} floatIntensity={0.8}><Sphere args={[0.18, 24, 24]} position={[1.5, 0.9, 0]}><meshStandardMaterial color="#67e8f9" emissive="#0e7490" emissiveIntensity={0.6} roughness={0.2} metalness={0.8} /></Sphere></Float>
    <Float speed={1} floatIntensity={1}><mesh position={[-1.4, -0.8, 0.3]} rotation={[0.4, 0.3, 0]}><octahedronGeometry args={[0.22, 0]} /><meshStandardMaterial color="#a78bfa" emissive="#4c1d95" emissiveIntensity={0.4} roughness={0.3} metalness={0.7} /></mesh></Float>
  </group>;
}

const SkillCardInner = ({ icon: Icon, topline, title, tags }: { icon: typeof TestTube2; topline: string; title: string; tags: string[] }) => (
  <div className="skill-inner">
    <div className="skill-icon"><Icon size={22} /></div>
    <div className="card-topline"><span>{topline}</span><span>{title.toUpperCase()}</span></div>
    <h3>{title}</h3>
    <div className="skill-tags">{tags.map((item) => <span key={item}>{item}</span>)}</div>
  </div>
);

function Loader() {
  return <motion.div className="loader" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
    <div className="loader-inner">
      <div className="loader-ring" />
      <div className="loader-ring delayed" />
      <span className="loader-text">KATAMRAJ<span className="brand-muted">.QA</span></span>
      <span className="loader-bar"><i /></span>
    </div>
  </motion.div>;
}

function App() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [labTab, setLabTab] = useState(0);
  const [knowledgeTab, setKnowledgeTab] = useState('Sample Test Case');
  const [skillFilter, setSkillFilter] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formError, setFormError] = useState('');
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), 1600); return () => window.clearTimeout(timer); }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { rootMargin: '-30% 0px -60% 0px' });
    navItems.forEach(([, id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  const currentExample = useMemo(() => labExamples[labTab], [labTab]);
  const currentKnowledge = knowledge[knowledgeTab];
  const skillCategories = ['All', ...Object.keys(skills)];
  const filteredSkills = skillFilter === 'All' ? Object.entries(skills) : Object.entries(skills).filter(([cat]) => cat === skillFilter);

  function copyCode() { void navigator.clipboard?.writeText(currentExample.code); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
  function handleResume(event: React.ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; if (!file) return; if (resumeUrl) URL.revokeObjectURL(resumeUrl); setResumeUrl(URL.createObjectURL(file)); }
  function handleContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formState.name || !formState.email || !formState.subject || !formState.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) { setFormError('Please complete every field with a valid email address.'); return; }
    setFormError('');
    const body = `${formState.message}\n\nFrom: ${formState.name} (${formState.email})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(formState.subject)}&body=${encodeURIComponent(body)}`;
  }
  function closeModal() { setActiveProject(null); }
  useEffect(() => { if (activeProject) { const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal(); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); } }, [activeProject]);

  const reveal = { initial: { opacity: 0, y: 22 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: reduce ? 0 : 0.6 } };
  const skillIcons: Record<string, typeof TestTube2> = { 'Manual Testing': TestTube2, 'Automation Testing': Code2, Tools: GitBranch };
  const dashMetrics = [
    { label: 'Test Case Execution', value: '84', suffix: '/100', progress: '84%', note: '+12% from previous cycle', icon: CheckCircle2 },
    { label: 'Passed Tests', value: '76', suffix: '', note: '90.4% pass rate', icon: CheckCircle2, good: true },
    { label: 'Failed Tests', value: '08', suffix: '', note: '8 requiring attention', icon: CircleDot, warn: true },
    { label: 'Bug Reports', value: '14', suffix: '', note: '10 resolved', icon: Bug },
  ];
  const coverage = [['Functional', 86], ['Regression', 74], ['API', 62], ['Mobile', 48]];

  return <div className="site-shell">
    <div className="noise" />
    <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

    <header className="topbar">
      <a href="#home" className="brand" aria-label="Katamraj home"><span className="brand-mark">K<span>/</span></span><span>KATAMRAJ<span className="brand-muted">.QA</span></span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>{navItems.map(([label, id]) => <a key={id} className={activeSection === id ? 'active' : ''} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
      <a href="#contact" className="nav-cta">Let's talk <ArrowRight size={15} /></a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main>
      <section id="home" className="hero section-pad">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> Available for QA opportunities <span className="eyebrow-line" /></div>
          <p className="hero-kicker">Hi, I'm <span>Katamraj Madagoni</span></p>
          <h1>{profile.title}<br /><em>{profile.subtitle}</em></h1>
          <p className="hero-tagline">{profile.tagline}</p>
          <p className="hero-intro">I'm a QA Engineer with 2 years of experience in software testing, passionate about identifying defects, improving application quality and delivering reliable user experiences. I have experience in manual testing and I'm expanding my expertise in automation testing using Playwright and TypeScript.</p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">Explore my work <ArrowDown size={17} /></a>
            <a className="button quiet" href="#resume">{resumeUrl ? 'Download resume' : 'Resume'} <CloudDownload size={17} /></a>
            <a className="button quiet" href="#contact">Contact me <ArrowRight size={17} /></a>
          </div>
          <div className="hero-note"><ShieldCheck size={18} /> Currently expanding my automation testing skills with Playwright + TypeScript.</div>
        </div>
        <div className="hero-visual">
          <div className="scene-frame">
            <div className="scene-label top-left"><span>QA.ENGINE / 01</span><span>LIVE SYSTEM</span></div>
            <Canvas camera={{ position: [0, 0, 5.4], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: !isSmallScreen, alpha: true }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[3, 3, 4]} intensity={12} color="#67e8f9" />
              <pointLight position={[-3, -2, 2]} intensity={8} color="#818cf8" />
              <Suspense fallback={null}><HeroScene /></Suspense>
              {canHover && <OrbitControls enableZoom={false} enablePan={false} />}
            </Canvas>
            <div className="scene-label bottom-right"><span>INTERACTIVE CORE</span><span className="mini-bars"><i /><i /><i /><i /></span></div>
          </div>
          <div className="orbit-note note-one"><CircleDot size={12} /> defect detection</div>
          <div className="orbit-note note-two"><Zap size={12} /> quality signal</div>
          {canHover && <div className="orbit-note note-three"><MousePointerClick size={12} /> drag to rotate</div>}
        </div>
        <a className="scroll-cue" href="#about"><span>Scroll to explore</span><div className="scroll-line" /></a>
      </section>

      <section id="about" className="section-pad about-section">
        <motion.div {...reveal} className="section-heading"><span className="section-index">01 / PROFILE</span><h2>Building trust<br /><span>one test at a time.</span></h2></motion.div>
        <div className="about-grid">
          <motion.div {...reveal} className="about-copy">
            <p className="lead">Quality is not just a process. It's a commitment to excellence.</p>
            <p>I work at the intersection of careful manual testing and a growing automation practice. My focus is simple: understand how a product should feel, challenge how it might fail, and help teams ship experiences people can rely on.</p>
            <p>From web and mobile applications to APIs and data validation, I bring a structured eye, clear communication, and genuine curiosity to every test cycle.</p>
            <p>My career goal is to grow into a well-rounded automation engineer who can build reliable test suites that give teams confidence to ship faster.</p>
            <div className="signature"><span>KM</span><div><strong>Katamraj Madagoni</strong><small>QA Engineer · Hyderabad, India</small></div></div>
          </motion.div>
          <motion.div {...reveal} className="about-visual-wrap">
            <div className="about-scene">
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.6} /><pointLight position={[3, 2, 3]} intensity={10} color="#67e8f9" /><pointLight position={[-2, -2, 2]} intensity={6} color="#a78bfa" />
                <Suspense fallback={null}><AboutScene /></Suspense>
              </Canvas>
            </div>
            <div className="about-card">
              <div className="card-topline"><span>AT A GLANCE</span><span>01—04</span></div>
              <div className="glance-row"><span>Experience</span><strong>2 years</strong></div>
              <div className="glance-row"><span>Primary mode</span><strong>Manual testing</strong></div>
              <div className="glance-row"><span>Growing into</span><strong>Playwright automation</strong></div>
              <div className="glance-row"><span>Based in</span><strong>Hyderabad, India</strong></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="skills" className="section-pad dark-section">
        <motion.div {...reveal} className="section-heading row-heading"><div><span className="section-index">02 / CAPABILITIES</span><h2>A practical toolkit<br /><span>for better outcomes.</span></h2></div><p>Curious by default. Precise by practice.<br />Always learning what comes next.</p></motion.div>
        <motion.div {...reveal} className="skill-filter-bar">
          <Filter size={14} /><span>FILTER</span>
          {skillCategories.map((cat) => <button key={cat} className={skillFilter === cat ? 'selected' : ''} onClick={() => setSkillFilter(cat)}>{cat}</button>)}
        </motion.div>
        <motion.div {...reveal} className="skills-grid">
          <AnimatePresence mode="popLayout">
            {filteredSkills.map(([category, items], index) => (
              <motion.div key={category} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: reduce ? 0 : 0.35, delay: index * 0.05 }} className="skill-card">
                <SkillCardInner icon={skillIcons[category] ?? GitBranch} topline={`0${index + 1}`} title={category} tags={items} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section id="experience" className="section-pad">
        <motion.div {...reveal} className="section-heading"><span className="section-index">03 / EXPERIENCE</span><h2>Growing through<br /><span>real product work.</span></h2></motion.div>
        <div className="timeline">
          <div className="timeline-line" />
          <motion.div {...reveal} className="timeline-item">
            <div className="timeline-marker"><span /></div>
            <div className="timeline-date">CURRENT <span>02 YEARS</span></div>
            <div className="timeline-content">
              <div className="timeline-title"><div><h3>QA Engineer</h3><p>Software testing · Hyderabad, India</p></div><BriefcaseBusiness /></div>
              <p className="timeline-summary">A hands-on testing practice spanning requirements, test design, execution, defect discovery and the learning curve toward reliable automation.</p>
              <ul>{['Understanding business requirements', 'Preparing test scenarios and test cases', 'Executing manual test cases', 'Functional and regression testing', 'Identifying and reporting defects', 'Retesting resolved defects', 'Testing web and mobile applications', 'API testing using Postman', 'Basic SQL validation', 'Learning Playwright automation'].map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="projects" className="section-pad project-section dark-section">
        <motion.div {...reveal} className="section-heading row-heading"><div><span className="section-index">04 / SELECTED WORK</span><h2>Testing the details<br /><span>that matter most.</span></h2></div><p>Client details stay private.<br />The testing craft stays visible.</p></motion.div>
        <div className="project-grid">
          {projects.map((project, index) => { const ProjectIcon = project.icon; return (
            <motion.button {...reveal} transition={{ ...reveal.transition, delay: index * 0.1 }} key={project.name} className={`project-card ${project.color}`} onClick={() => setActiveProject(project)}>
              <div className="project-top"><span>PROJECT 0{index + 1}</span><ExternalLink size={17} /></div>
              <div className="project-art"><div className="art-orbit" /><ProjectIcon size={34} /><span className="art-code">{index === 0 ? 'LMS / ERP' : index === 1 ? 'FLOW / POS' : 'LEARN / OPS'}</span></div>
              <div className="project-body"><span className="project-type">{project.type}</span><h3>{project.name}</h3><p>{project.description}</p><span className="view-link">View testing scope <ArrowRight size={15} /></span></div>
            </motion.button>
          ); })}
        </div>
      </section>

      <section id="automation" className="section-pad automation-section">
        <motion.div {...reveal} className="section-heading row-heading"><div><span className="section-index">05 / AUTOMATION LAB</span><h2>Learning in<br /><span>public.</span></h2></div><p>Small, valid examples of a<br />practice in progress.</p></motion.div>
        <motion.div {...reveal} className="lab-shell">
          <div className="lab-sidebar">
            <div className="lab-sidebar-title"><Terminal size={16} /> PLAYWRIGHT / TS</div>
            {labExamples.map((example, index) => <button key={example.label} className={labTab === index ? 'selected' : ''} onClick={() => setLabTab(index)}><span>0{index + 1}</span>{example.label}<ChevronRight size={14} /></button>)}
            <div className="lab-status"><span className="status-dot" /> Currently expanding my automation testing skills.</div>
          </div>
          <div className="code-panel">
            <div className="code-toolbar">
              <span><span className="traffic red" /><span className="traffic yellow" /><span className="traffic green" /></span>
              <span className="code-filename">{currentExample.file}</span>
              <button onClick={copyCode}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : 'Copy code'}</button>
            </div>
            <pre><code>{currentExample.code.split('\n').map((line, index) => <span key={`${line}-${index}`} className="code-line"><i>{String(index + 1).padStart(2, '0')}</i>{line || ' '}</span>)}</code></pre>
          </div>
        </motion.div>
      </section>

      <section id="showcase" className="section-pad showcase-section dark-section">
        <motion.div {...reveal} className="section-heading row-heading"><div><span className="section-index">06 / QA COMMAND CENTER</span><h2>Signal over<br /><span>assumption.</span></h2></div><p>Illustrative dashboard data.<br />Not company project statistics.</p></motion.div>
        <motion.div {...reveal} className="dashboard">
          <div className="dashboard-head"><span><span className="status-dot" /> DEMO ENVIRONMENT</span><span>REGRESSION CYCLE / 04</span><span>LAST RUN · TODAY</span></div>
          <div className="metric-grid">
            {dashMetrics.map((metric) => (
              <div key={metric.label} className={`metric-card ${metric === dashMetrics[0] ? 'emphasis' : ''}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}<span>{metric.suffix}</span></strong>
                {metric.progress && <div className="progress"><i style={{ width: metric.progress }} /></div>}
                <small className={metric.warn ? 'warning' : ''}><metric.icon size={13} /> {metric.note}</small>
              </div>
            ))}
          </div>
          <div className="dashboard-bottom">
            <div className="chart-card">
              <div className="chart-title"><span>REGRESSION TREND</span><span>LAST 7 RUNS</span></div>
              <div className="bars">{[42, 58, 48, 70, 64, 81, 94].map((height, index) => <div key={height} className="bar-wrap"><div className="bar" style={{ height: `${height}%` }}><span>{height}%</span></div><small>0{index + 1}</small></div>)}</div>
            </div>
            <div className="coverage-card">
              <div className="chart-title"><span>COVERAGE FOCUS</span><span>DEMO</span></div>
              {coverage.map(([label, value], idx) => <div className="coverage-row" key={label as string}><div><span>{label}</span><b>{value}%</b></div><div className="progress"><i style={{ width: `${value}%` }} className={`bar-color-${idx}`} /></div></div>)}
            </div>
          </div>
          <div className="dashboard-disclaimer">The displayed metrics are illustrative sample data and not actual company project statistics.</div>
        </motion.div>
      </section>

      <section id="showcase-knowledge" className="section-pad knowledge-section">
        <motion.div {...reveal} className="section-heading"><span className="section-index">07 / TESTING KNOWLEDGE</span><h2>Thinking in<br /><span>scenarios.</span></h2></motion.div>
        <motion.div {...reveal} className="knowledge-shell">
          <div className="knowledge-tabs">{Object.keys(knowledge).map((tab) => <button key={tab} className={knowledgeTab === tab ? 'selected' : ''} onClick={() => setKnowledgeTab(tab)}>{tab}</button>)}</div>
          <div className="knowledge-content">
            <div className="knowledge-number">0{Object.keys(knowledge).indexOf(knowledgeTab) + 1}</div>
            <div>
              <span className="project-type">{knowledgeTab.toUpperCase()}</span>
              <h3>{currentKnowledge.title}</h3>
              <p>{currentKnowledge.description}</p>
              <div className="steps">
                <div><span>STEPS</span><ol>{currentKnowledge.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
                <div className="result">
                  <span>EXPECTED RESULT</span><p>{currentKnowledge.expected}</p>
                  {currentKnowledge.actual && <><span>ACTUAL RESULT</span><p>{currentKnowledge.actual}</p></>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="resume" className="section-pad resume-section dark-section">
        <motion.div {...reveal} className="resume-card">
          <div>
            <span className="section-index">08 / RESUME</span>
            <h2>A clearer view<br /><span>of the journey.</span></h2>
            <p className="resume-summary">QA Engineer with 2 years of experience in manual testing across web, mobile and API platforms. Skilled in test case design, regression testing and defect reporting. Currently expanding into Playwright automation with TypeScript to broaden testing coverage and reliability.</p>
            <div className="resume-actions">
              {resumeUrl ? <a className="button primary" href={resumeUrl} download={`${profile.name.replace(/ /g, '_')}_Resume.pdf`}><CloudDownload size={17} /> Download resume</a> : null}
              <label className="button quiet"><CloudDownload size={17} /> {resumeUrl ? 'Replace resume' : 'Upload resume'}<input type="file" accept="application/pdf" onChange={handleResume} /></label>
              {resumeUrl ? <a className="button quiet" href={resumeUrl} target="_blank" rel="noreferrer"><Eye size={17} /> Preview PDF</a> : <span className="file-note">PDF only · Nothing is uploaded</span>}
            </div>
          </div>
          <div className="resume-graphic"><FileText size={68} strokeWidth={1} /><span>CV / 2026</span><div className="graphic-lines"><i /><i /><i /></div></div>
        </motion.div>
      </section>

      <section id="contact" className="section-pad contact-section">
        <motion.div {...reveal} className="section-heading row-heading"><div><span className="section-index">09 / CONTACT</span><h2>Let's make quality<br /><span>the standard.</span></h2></div><p>Have a product, team or testing<br />challenge in mind? Start here.</p></motion.div>
        <div className="contact-grid">
          <motion.div {...reveal} className="contact-details">
            <div className="contact-intro">Open to conversations about QA engineering, product quality and growing automation practices.</div>
            <a className="contact-row" href={`mailto:${profile.email}`}><span className="contact-icon"><Mail size={18} /></span><span><small>Email</small><strong>{profile.email}</strong></span><ArrowUpRight size={16} /></a>
            <a className="contact-row" href={`tel:${profile.phone.replace(/ /g, '')}`}><span className="contact-icon"><Phone size={18} /></span><span><small>Phone</small><strong>{profile.phone}</strong></span><ArrowUpRight size={16} /></a>
            <a className="contact-row" href="#contact"><span className="contact-icon"><Globe2 size={18} /></span><span><small>Location</small><strong>{profile.location}</strong></span><ArrowUpRight size={16} /></a>
            <div className="socials">
              <a href={profile.linkedin} aria-label="LinkedIn" title="LinkedIn"><Linkedin size={18} /></a>
              <a href={profile.github} aria-label="GitHub" title="GitHub"><Github size={18} /></a>
              <a href={`https://wa.me/${profile.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp"><MessageSquare size={18} /></a>
            </div>
          </motion.div>
          <motion.form {...reveal} className="contact-form" onSubmit={handleContact}>
            <div className="form-heading"><span>DROP A LINE</span><Send size={18} /></div>
            <label>Name<input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} placeholder="Your name" /></label>
            <label>Email<input type="email" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} placeholder="you@company.com" /></label>
            <label>Subject<input value={formState.subject} onChange={(e) => setFormState({ ...formState, subject: e.target.value })} placeholder="How can I help?" /></label>
            <label>Message<textarea rows={4} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} placeholder="Tell me a little about the opportunity..." /></label>
            {formError && <p className="form-error">{formError}</p>}
            <button className="button primary" type="submit">Open email draft <ArrowRight size={17} /></button>
            <small className="form-note">Submitting opens your email app with the message prepared. No data is stored here.</small>
          </motion.form>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="brand"><span className="brand-mark">K<span>/</span></span><span>KATAMRAJ<span className="brand-muted">.QA</span></span></div>
      <span>Quality is a commitment to excellence.</span>
      <span>© 2026 {profile.name}</span>
    </footer>

    <AnimatePresence>
      {activeProject && (() => { const ActiveProjectIcon = activeProject.icon; return (
        <motion.div className="modal-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
          <motion.div className="project-modal" role="dialog" aria-modal="true" initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }} transition={{ duration: reduce ? 0 : 0.25 }} onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Close project"><X /></button>
            <div className="modal-art"><ActiveProjectIcon size={46} /><span>{activeProject.tag}</span></div>
            <span className="project-type">{activeProject.type}</span>
            <h2>{activeProject.name}</h2>
            <p>{activeProject.description}</p>
            <div className="modal-columns">
              <div><span>TESTING SCOPE</span><ul>{activeProject.scope.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul></div>
              <div><span>MY RESPONSIBILITIES</span><ul>{activeProject.responsibilities.map((item) => <li key={item}><Check size={14} />{item}</li>)}</ul></div>
            </div>
          </motion.div>
        </motion.div>
      ); })()}
    </AnimatePresence>
  </div>;
}

export default App;
