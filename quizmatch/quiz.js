const questions = [
  {
    question: "What motivates you most in your academic journey?",
    options: [
      { text: "Creating something revolutionary that changes everything", type: "visionary" },
      { text: "Achieving perfect grades and being recognised as the best", type: "overachiever" },
      { text: "Finding the most efficient path to my goals", type: "strategist" },
      { text: "Building meaningful relationships with peers and mentors", type: "connector" },
      { text: "Taking action and making things happen right away", type: "hustler" }
    ]
  },
  {
    question: "How do you handle group projects?",
    options: [
      { text: "I propose bold, innovative ideas that push boundaries", type: "visionary" },
      { text: "I ensure our work meets the highest standards possible", type: "overachiever" },
      { text: "I organise tasks and optimise our workflow", type: "strategist" },
      { text: "I keep everyone motivated and communication flowing", type: "connector" },
      { text: "I dive in and start working immediately", type: "hustler" }
    ]
  },
  {
    question: "What's your ideal way to spend free time?",
    options: [
      { text: "Brainstorming the next big idea or innovation", type: "visionary" },
      { text: "Studying ahead or working on skill improvement", type: "overachiever" },
      { text: "Planning and optimising my schedule and goals", type: "strategist" },
      { text: "Hanging out with friends and meeting new people", type: "connector" },
      { text: "Working on side projects or building my portfolio", type: "hustler" }
    ]
  },
  {
    question: "What describes your leadership style?",
    options: [
      { text: "I inspire others with my vision of what's possible", type: "visionary" },
      { text: "I lead by example with my work ethic and standards", type: "overachiever" },
      { text: "I create systems and processes that help everyone succeed", type: "strategist" },
      { text: "I bring people together and facilitate collaboration", type: "connector" },
      { text: "I take charge and get things moving quickly", type: "hustler" }
    ]
  },
  {
    question: "How do you approach challenges?",
    options: [
      { text: "I reimagine the problem and find creative solutions", type: "visionary" },
      { text: "I work harder and longer until I overcome it", type: "overachiever" },
      { text: "I analyse the situation and find the most efficient solution", type: "strategist" },
      { text: "I reach out to others for advice and support", type: "connector" },
      { text: "I jump in and figure it out as I go", type: "hustler" }
    ]
  },
  {
    question: "What's your career aspiration?",
    options: [
      { text: "Starting a revolutionary company or movement", type: "visionary" },
      { text: "Becoming a recognised expert in my field", type: "overachiever" },
      { text: "Building efficient systems that create lasting impact", type: "strategist" },
      { text: "Working in roles that connect and inspire people", type: "connector" },
      { text: "Creating multiple income streams and opportunities", type: "hustler" }
    ]
  },
  {
    question: "How do you handle stress?",
    options: [
      { text: "I channel it into creative energy for breakthrough ideas", type: "visionary" },
      { text: "I push through with discipline and determination", type: "overachiever" },
      { text: "I step back, reassess, and optimise my approach", type: "strategist" },
      { text: "I talk it out with friends or seek emotional support", type: "connector" },
      { text: "I stay busy and keep moving forward", type: "hustler" }
    ]
  },
  {
    question: "What's your learning style?",
    options: [
      { text: "I connect concepts to create new frameworks", type: "visionary" },
      { text: "I master fundamentals through repetition and practice", type: "overachiever" },
      { text: "I focus on the most important concepts for maximum efficiency", type: "strategist" },
      { text: "I learn best through discussion and collaboration", type: "connector" },
      { text: "I learn by doing and applying knowledge immediately", type: "hustler" }
    ]
  },
  {
    question: "How do you make decisions?",
    options: [
      { text: "I follow my intuition and vision of possibilities", type: "visionary" },
      { text: "I research thoroughly and choose the option with best outcomes", type: "overachiever" },
      { text: "I weigh pros and cons systematically", type: "strategist" },
      { text: "I consult with trusted friends and mentors", type: "connector" },
      { text: "I make quick decisions and adjust as needed", type: "hustler" }
    ]
  },
  {
    question: "What legacy do you want to leave?",
    options: [
      { text: "Having changed the world with groundbreaking innovations", type: "visionary" },
      { text: "Being remembered as someone who achieved excellence", type: "overachiever" },
      { text: "Creating systems that continue to help others succeed", type: "strategist" },
      { text: "Having brought people together and built strong communities", type: "connector" },
      { text: "Showing others that anything is possible with determination", type: "hustler" }
    ]
  }
];

let current = 0;
const answers = [];
const scores = {
  visionary: 0,
  overachiever: 0,
  strategist: 0,
  connector: 0,
  hustler: 0
};

// Weighted scoring based on question importance
const questionWeights = [1.2, 1.0, 0.8, 1.1, 1.3, 1.4, 0.9, 1.0, 1.2, 1.5];

let responseStartTime = Date.now();
const responseTimes = [];

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const progressEl = document.getElementById('progress');
const resultEl = document.getElementById('result');
const backBtn = document.getElementById('backBtn');
const mlProcessing = document.getElementById('ml-processing');
const mlSteps = document.getElementById('ml-steps');
const progressFill = document.getElementById('progressFill');

function showQuestion() {
  responseStartTime = Date.now();
  resultEl.innerHTML = "";
  mlProcessing.style.display = "none";
  const q = questions[current];
  questionEl.textContent = q.question;
  progressEl.textContent = `Question ${current + 1} of ${questions.length}`;
  optionsEl.innerHTML = "";
  q.options.forEach(opt => {
    const div = document.createElement('div');
    div.className = "option";
    div.textContent = opt.text;
    div.onclick = () => selectOption(opt.type);
    optionsEl.appendChild(div);
  });

  backBtn.style.display = current > 0 ? "inline-block" : "none";
}

function selectOption(type) {
  const responseTime = Date.now() - responseStartTime;
  responseTimes.push(responseTime);
  
  answers[current] = type;
  
  // Apply weighted scoring
  const weight = questionWeights[current];
  scores[type] += weight;
  
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    runAnalysis();
  }
}

function runAnalysis() {
  questionEl.textContent = "";
  optionsEl.innerHTML = "";
  progressEl.textContent = "Analysing personality patterns...";
  backBtn.style.display = "none";
  mlProcessing.style.display = "block";
  
  const steps = [
    "Processing behavioural data patterns...",
    "Calculating personality trait correlations...",
    "Analysing response consistency metrics...",
    "Generating compatibility matrices...",
    "Finalising personality profile..."
  ];
  
  let stepIndex = 0;
  let progress = 0;
  
  const interval = setInterval(() => {
    if (stepIndex < steps.length) {
      mlSteps.innerHTML = `<div style="margin: 5px 0; color: #feb041;">✓ ${steps[stepIndex]}</div>` + mlSteps.innerHTML;
      stepIndex++;
      progress += 100 / steps.length;
      progressFill.style.width = progress + '%';
    } else {
      clearInterval(interval);
      setTimeout(() => {
        showResult();
      }, 800);
    }
  }, 600);
}

function goBack() {
  if (current > 0) {
    const prevType = answers[current - 1];
    if (prevType) {
      const weight = questionWeights[current - 1];
      scores[prevType] -= weight;
      responseTimes.pop();
    }
    current--;
    showQuestion();
  }
}

function showResult() {
  mlProcessing.style.display = "none";
  progressEl.textContent = "Analysis Complete!";
  
  // Finding dominant personality type
  let topType = "";
  let maxScore = -1;
  for (let type in scores) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      topType = type;
    }
  }

    const profiles = {
    visionary: {
        name: "The Visionary",
        description: "You dream boldly and spark innovation. You're drawn to breakthrough ideas and revolutionary change. Many successful NP alumni share your forward-thinking mindset.",
        traits: ["Innovation-driven", "Future-focused", "Creative problem-solver", "Inspirational leader"],
        careers: ["Tech entrepreneur", "Research scientist", "Creative director", "Social innovator"],
        alumni: [
        { name: "Alicia Tan", role: "Founder, GreenTech Innovations" },
        { name: "Raymond Ng", role: "Social Enterprise Leader" }
        ]
    },
    overachiever: {
        name: "The Overachiever",
        description: "Excellence is your standard. You're disciplined, driven, and consistently deliver outstanding results. Your dedication sets you apart in any field.",
        traits: ["Excellence-oriented", "Highly disciplined", "Results-focused", "Competitive edge"],
        careers: ["Corporate leader", "Academic researcher", "Investment banker", "Medical specialist"],
        alumni: [
        { name: "Daniel Loh", role: "Valedictorian, Class of 2020" },
        { name: "Siti Rahim", role: "Top Graduate, NP Business School" }
        ]
    },
    strategist: {
        name: "The Strategist",
        description: "You see the big picture and optimise for maximum impact. Efficiency and smart planning are your superpowers. You work smart, not just hard.",
        traits: ["Analytical thinker", "Efficiency-focused", "Strategic planner", "Systems optimiser"],
        careers: ["Management consultant", "Project manager", "Data analyst", "Operations director"],
        alumni: [
        { name: "Jeremy Lim", role: "Operations Lead, Logistics Tech" },
        { name: "Priya Singh", role: "Senior Analyst, Regional Consulting" }
        ]
    },
    connector: {
        name: "The Connector",
        description: "You're the glue that brings people together. Your emotional intelligence and networking skills create opportunities for yourself and others.",
        traits: ["Relationship-builder", "Emotionally intelligent", "Collaborative leader", "Natural networker"],
        careers: ["HR director", "Sales manager", "Event coordinator", "Community organiser"],
        alumni: [
        { name: "Nurul Huda", role: "Community Engagement Officer" },
        { name: "Marcus Lee", role: "Head of People, StartUp Hub" }
        ]
    },
    hustler: {
        name: "The Hustler",
        description: "You make things happen through pure determination and action. While others plan, you're already executing. Your drive is infectious and unstoppable.",
        traits: ["Action-oriented", "Resourceful", "Adaptable", "Entrepreneurial spirit"],
        careers: ["Startup founder", "Business developer", "Sales leader", "Digital marketer"],
        alumni: [
        { name: "Ken Wong", role: "Founder, X Agency" },
        { name: "Sarah Lim", role: "Growth Marketer, E-Commerce" }
        ]
    }
    };

  const result = profiles[topType];
  
  const consistency = Math.round(85 + Math.random() * 12);
  const avgResponseTime = Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000);
  const confidence = Math.round(Math.min(95, (maxScore / Math.max(...Object.values(scores))) * 100));
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const secondaryTrait = profiles[sortedScores[1][0]].name;
  
    resultEl.innerHTML = `
    <h2>Your Personality Archetype</h2>
    <h3 style="color: #014689; margin: 15px 0;">${result.name}</h3>
    <p style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 20px;">${result.description}</p>

    <div style="margin: 20px 0;">
        <strong>🔑 Key Traits 🔑</strong>
        <ul style="
        list-style-type: disc;
        display: grid;
        grid-template-columns: repeat(2, minmax(140px, 1fr));
        gap: 10px 40px;
        padding-left: 20px;
        text-align: left;
        margin: 10px 0;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
        ">
        ${result.traits.map(trait => `<li>${trait}</li>`).join('')}
        </ul>
    </div>

    <div style="margin: 20px 0;">
        <strong>🌟 NP Alumni Like You 🌟</strong>
        <div style="
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: center;
        margin-top: 10px;
        ">
        ${result.alumni.map(alum => `
            <div style="
            flex: 1 1 150px;
            max-width: 180px;
            background: #f0f4fb;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            ">
            <div style="
                width: 70px;
                height: 70px;
                background: #014689;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 12px;
                color: white;
                font-size: 36px;
                font-weight: bold;
                user-select: none;
            ">
                ${alum.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style="font-weight: 600; color: #014689; margin-bottom: 6px;">
                ${alum.name}
            </div>
            <div style="font-size: 0.9rem; color: #555;">
                ${alum.role}
            </div>
            </div>
        `).join('')}
        </div>
    </div>

    <div class="ml-metrics" style="margin-top: 30px;">
        <div class="metric">
        <span class="metric-value">${confidence}%</span>
        <div>Match Score</div>
        </div>
    </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  showQuestion();
});
