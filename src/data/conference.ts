export interface Speaker {
  id: string;
  name: string;
  title: string;
  bio?: string;
  image?: string;
  fullBio?: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  type: 'session' | 'break' | 'meal' | 'party';
  emoji?: string;
  timezone?: string;
  day?: 'friday' | 'saturday';
}

export const speakers: Speaker[] = [
  {
    id: '1',
    name: 'Jill Glenn',
    title: 'Founder, CEO',
    bio: 'An industry leader with over 25 years of experience building and managing sleep programs across the U.S.',
    fullBio: 'Jill has been an advocate and a leader within the sleep field for more than 25 years. She has been personally involved in the development, integration, and management of hundreds of sleep centers and DME providers, helping diverse organizations launch and sustain long-term sleep apnea programs. Recognized as an expert in medical billing and regulatory compliance, Jill has helped thousands of patients access essential sleep testing, durable medical equipment (DME), and compliance support. She is the founder and CEO of Dedicated Sleep.',
    image: ''
  },
  {
    id: '2',
    name: 'Dr. Marc Milstein',
    title: 'Keynote Speaker',
    bio: 'A renowned brain health researcher and speaker known for making science entertaining and actionable.',
    fullBio: 'Dr. Marc Milstein is a leading researcher, speaker, and author specializing in brain health, dementia prevention, and productivity. With a Ph.D. in Biological Chemistry and a B.S. in Molecular, Cellular, and Developmental Biology from UCLA, Dr. Milstein presents complex scientific research in ways that empower audiences to live better lives. His presentations provide tools to boost memory, lower the risk of cognitive decline, and enhance well-being. He has published on genetics, cancer biology, neuroscience, and infectious disease, and uses this background to cut through health misinformation with actionable strategies.',
    image: ''
  },
  {
    id: '3',
    name: 'Ryan A. Semensohn, DMD, DO',
    title: 'Oral & Maxillofacial Surgeon',
    bio: 'A dual-doctorate oral surgeon with a unique blend of clinical and business expertise.',
    fullBio: 'Dr. Semensohn holds a Doctor of Dental Medicine (DMD), Doctor of Osteopathic Medicine (DO), and Master of Business Administration (MBA) from Nova Southeastern University. He completed his Oral and Maxillofacial Surgery residency at Broward Health and later pursued a fellowship at Mercy Hospital in St. Louis, focusing on Orthognathic, TMJ, and Sleep Apnea Surgery. His interdisciplinary training allows him to deliver superior patient care while optimizing healthcare operations across the board.',
    image: ''
  },
  {
    id: '4',
    name: 'Micah Sadigh, Ph.D.',
    title: 'Professor at Cedar Crest College',
    bio: 'A distinguished professor and psychologist specializing in clinical, biological, health, and existential psychology.',
    fullBio: 'Dr. Micah Sadigh is a Professor at Cedar Crest College. He holds a Diplomate status in Franklian Psychology, which was awarded to him by the International Viktor Frankl Institute. He is a Fellow of the International College of Psychosomatic Medicine and is a member of the Academy of Psychosomatic Medicine, the Society for Existential Analysis, and the American Psychosomatic Society. Dr. Sadigh\'s interests lie in clinical, biological, health, and existential psychology. His publications include work on sleep disorders, personality disorders, applied psychophysiology, stress and disease, the psychological treatment of pain, post-traumatic stress disorder, and an existential approach to the treatment of psychosomatic disorders.',
    image: ''
  },
  {
    id: '5',
    name: 'Cynthia Levy',
    title: 'Account Management',
    bio: 'A dental sleep medicine consultant with over 20 years of experience in clinical and billing operations.',
    fullBio: 'Cynthia has managed large multi-provider dental practices and has spent the last seven years on the leadership team at Dedicated Sleep. She established and runs a thriving Sleep and TMD practice, and also oversees Dedicated DM Billing, managing Medicare claims with precision. Her well-rounded expertise spans practice management, business development, and healthcare billing.',
    image: ''
  },
  {
    id: '6',
    name: 'Cristy Plain, RPSGT, CCSH',
    title: 'Executive VP of Sleep Services',
    bio: 'A credentialed sleep health expert with two decades of experience across clinical, DME, and billing services.',
    fullBio: 'Cristy entered the sleep field in 2004 and earned her RPSGT in 2009, CCSH in 2013, and pediatric certification in 2022. She has managed multi-bed sleep labs, PAP compliance programs, and various DME operations. Her past roles include billing coordinator and Tricare/Medicare enrollment manager. Since joining Dedicated Sleep in 2018, Cristy has led clinical operations and served as the internal lead for DS Dedicare software development.',
    image: ''
  },
  {
    id: '7',
    name: 'Meaghan L. Hornof',
    title: 'Executive Vice President, OMS Services',
    bio: 'A billing and coverage expert who built a high-performing Implant Program for reconstructive surgery.',
    fullBio: 'With over 30 years of experience in medical/dental administration, Meaghan joined Dedicated Sleep in 2018 to lead the development of its Implant Program. She specializes in helping providers secure in-network medical coverage for full-mouth reconstruction, achieving both exceptional reimbursements and life-changing results for patients. Outside of work, she enjoys motorcycling with her husband and supporting her children\'s passions.',
    image: ''
  },
  {
    id: '8',
    name: 'Shaniqua Legington, CPC, CPCO, CPMA, CPB',
    title: 'Executive VP of HealthCare Finances',
    bio: 'A certified billing and compliance expert with 18+ years leading revenue cycle management.',
    fullBio: 'Shaniqua is a highly credentialed billing, coding, auditing, and compliance professional. Her career spans the full healthcare revenue cycle, from patient intake to insurance claims and auditing. Her compassionate leadership enhances both team efficiency and patient satisfaction. Outside work, she enjoys time with family and cherishes meaningful connections.',
    image: ''
  },
  {
    id: '9',
    name: 'Jeff Bynum, DDS',
    title: 'Clinical Instructor & Speaker',
    bio: 'A passionate clinician and educator committed to excellence in restorative dentistry.',
    fullBio: 'Dr. Bynum graduated from the University of Tennessee College of Dentistry in 1996. He teaches at the Kois Center in Seattle and previously at ORCAA and the Ickert Centre. His career has been shaped by learning from top clinicians and giving back to the community through mentorship and education.',
    image: ''
  },
  {
    id: '10',
    name: 'John Brokloff, DDS, OMS',
    title: 'CMO Implant Division',
    bio: 'A board-certified oral surgeon with over two decades of experience in clinical practice and academic leadership.',
    fullBio: 'Dr. Brokloff has been practicing Oral & Maxillofacial Surgery since 1999 and currently teaches as an Attending Surgeon at Case Western Reserve University School of Dental Medicine and the Cleveland Stokes VA Hospital. In addition to his academic roles, he runs a private practice in Akron, Ohio, treating complex oral, facial, and sleep-related disorders. He was a founding partner and instructor at ClearChoice Dental Implants, helping shape the implant industry. Outside of surgery, he\'s an avid boater, fisherman, and proud Ohio State Buckeye fan.',
    image: ''
  },
  {
    id: '11',
    name: 'James Siminski, MD',
    title: 'Pulmonary & Sleep Medicine Specialist',
    bio: 'A quadruple board-certified physician with expertise in sleep, pulmonary, and critical care medicine.',
    fullBio: 'Dr. Siminski earned his medical degree at Indiana University and completed his internship and residency at the University of Virginia. He trained in Pulmonary and Critical Care Medicine at the University of Washington and is board-certified in Internal Medicine, Pulmonary Disease, Critical Care, and Sleep Medicine. His career bridges advanced diagnostics and treatment in respiratory and sleep health.',
    image: ''
  },
  {
    id: '12',
    name: 'Robert Gordon, MD',
    title: 'Pulmonologist',
    bio: 'A seasoned pulmonologist focused on sleep apnea and respiratory health in the Oklahoma City community.',
    fullBio: 'Dr. Gordon practices at Mercy Hospital Oklahoma City and earned his medical degree from the University of Oklahoma College of Medicine. With over 20 years of clinical experience, he treats conditions such as sleep apnea, asthma, and bronchitis. He accepts a broad range of insurance plans, including Medicare, Aetna, Blue Cross, and United Healthcare.',
    image: ''
  },
  {
    id: '13',
    name: 'Alex McKinlay, MD',
    title: 'Otolaryngologist & Sleep Medicine Specialist',
    bio: 'A retired U.S. Army physician offering compassionate ENT and sleep care to the San Antonio community.',
    fullBio: 'Board-certified in both Otolaryngology and Sleep Medicine, Dr. McKinlay served in the U.S. Army for 24 years and now practices in San Antonio. He treats both pediatric and adult patients, addressing a wide range of ENT and sleep disorders. His practice emphasizes hope, healing, and a "Gold Standard" care experience. He is currently accepting new patients from most insurance plans.',
    image: ''
  },
  {
    id: '14',
    name: 'Mark Levy, DDS',
    title: 'Dental Sleep Medicine Specialist',
    bio: 'A respected dental sleep medicine expert focused on non-surgical CPAP alternatives.',
    fullBio: 'Dr. Levy runs Sleep Better Columbus, a practice exclusively dedicated to dental sleep medicine. He graduated from The Ohio State University College of Dentistry and has lectured nationally and internationally, including in Israel and Russia. His practice centers on providing patients with alternative therapies for sleep apnea that don\'t involve CPAP machines.',
    image: ''
  },
  {
    id: '15',
    name: 'Barry Glassman, DMD',
    title: 'Director of Education, Dedicated Sleep',
    bio: 'An internationally recognized leader in orofacial pain, TMD, and dental sleep medicine education.',
    fullBio: 'Dr. Glassman operated a private practice in Allentown, PA focused on chronic pain, TMD, and dental sleep disorders. He holds Diplomate and Fellow statuses from several esteemed organizations, including the American Academy of Craniofacial Pain and the American Academy of Dental Sleep Medicine. He has lectured globally and served as a residency instructor and guest faculty at Tufts University. Dr. Glassman now directs educational efforts at Dedicated Sleep.',
    image: ''
  },
  {
    id: '16',
    name: 'Don Malizia, DDS',
    title: 'Clinical Educator & Lead Provider, Allentown Pain & Sleep Center',
    bio: 'A clinical expert in evidence-based sleep and pain treatment, committed to advancing education in dental sleep medicine.',
    fullBio: 'Dr. Malizia transitioned from general dentistry to join Dr. Barry Glassman in Allentown, where they co-developed an evidence-based model for treating orofacial pain, joint dysfunction, and sleep disorders. He built and manages the educational library that supports their teaching efforts and remains a central figure in both the Allentown Pain & Sleep Center and Dedicated Sleep. He and Dr. Glassman have co-authored numerous articles in the field.',
    image: ''
  },
  {
    id: '17',
    name: 'Stephen Poss, DDS',
    title: 'Dental Sleep Medicine Specialist',
    bio: 'A triple Diplomate in dental sleep medicine who leads practices in Tennessee dedicated to sleep and TMJ care.',
    fullBio: 'Dr. Poss earned his dental degree from the University of Tennessee after graduating from David Lipscomb University. He holds Diplomate status from the American Board of Dental Sleep Medicine, the American Board of Craniofacial Dental Sleep Medicine, and the Academy of Clinical Sleep Disorders. He is also a Fellow of the Academy of Craniofacial Pain. He treats patients across practices in Brentwood and Murfreesboro, TN.',
    image: ''
  },
  {
    id: '18',
    name: 'Terry Gordon, DDS',
    title: 'Dental Sleep Medicine Expert',
    bio: 'A sedation-certified dental sleep specialist with credentials from all four major sleep academies.',
    fullBio: 'Dr. Gordon earned his dental degree from the University of Maryland and is a Fellow and Diplomate of the Dental Organization for Conscious Sedation. He also holds Diplomate status from the American Sleep and Breathing Academy, the Academy of Clinical Sleep Disorders Disciplines, the American Board of Dental Sleep Medicine, and the American Board of Craniofacial Dental Sleep Medicine. He practices exclusively with adults in south-central Pennsylvania.',
    image: ''
  },
];

export const fridayAgenda: AgendaItem[] = [
  {
    time: '08:00',
    title: 'Registration & Welcome Coffee',
    type: 'break',
    emoji: '☕'
  },
  {
    time: '09:00',
    title: 'Opening Keynote: Brain Health & Performance',
    speaker: 'Dr. Marc Milstein',
    type: 'session',
    emoji: '🧠'
  },
  {
    time: '10:30',
    title: 'Networking Break',
    type: 'break',
    emoji: '🤝'
  },
  {
    time: '11:00',
    title: 'Compliance in Modern Healthcare',
    speaker: 'Jill Glenn',
    type: 'session',
    emoji: '📋'
  },
  {
    time: '12:30',
    title: 'Lunch & Learn',
    type: 'meal',
    emoji: '🍽️'
  },
  {
    time: '14:00',
    title: 'Legal Trends & Best Practices',
    speaker: 'Jayme Matchinski',
    type: 'session',
    emoji: '⚖️'
  },
  {
    time: '15:30',
    title: 'Afternoon Refreshments',
    type: 'break',
    emoji: '🥤'
  },
  {
    time: '16:00',
    title: 'Advanced Surgical Techniques',
    speaker: 'Dr. Andrew Loetscher',
    type: 'session',
    emoji: '🏥'
  },
  {
    time: '19:00',
    title: 'Welcome Reception & Live Music',
    type: 'party',
    emoji: '🎸'
  },
];

export const saturdayAgenda: AgendaItem[] = [
  {
    time: '08:00',
    title: 'Continental Breakfast',
    type: 'meal',
    emoji: '🥐'
  },
  {
    time: '09:00',
    title: 'Mind-Body Wellness Workshop',
    speaker: 'Dr. Micah Sadigh',
    type: 'session',
    emoji: '🧘'
  },
  {
    time: '10:30',
    title: 'Coffee & Networking',
    type: 'break',
    emoji: '☕'
  },
  {
    time: '11:00',
    title: 'Interactive Panel Discussion',
    speaker: 'All Speakers',
    type: 'session',
    emoji: '💬'
  },
  {
    time: '12:30',
    title: 'Awards Lunch',
    type: 'meal',
    emoji: '🏆'
  },
  {
    time: '14:00',
    title: 'Future Trends & Innovation',
    speaker: 'Guest Speaker',
    type: 'session',
    emoji: '🚀'
  },
  {
    time: '15:30',
    title: 'Closing Reception',
    type: 'party',
    emoji: '🎉'
  },
];

export const whyAttendItems = [
  {
    icon: '🎓',
    title: 'Learn',
    description: 'Gain cutting-edge insights from industry leaders and expand your professional knowledge.',
  },
  {
    icon: '🤝',
    title: 'Network',
    description: 'Connect with peers, build lasting relationships, and expand your professional circle.',
  },
  {
    icon: '📈',
    title: 'Grow',
    description: 'Accelerate your career growth with actionable strategies and best practices.',
  },
];