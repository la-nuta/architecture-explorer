import { QuizQuestion } from '../core/models/quiz-question.model';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which architecture pattern bundles all application features into a single deployable unit?',
    options: [
      'Microservices',
      'Monolithic Architecture',
      'Serverless',
      'Event-Driven Architecture',
    ],
    correctAnswer: 'Monolithic Architecture',
    explanation:
      'A monolith packages the entire application — UI, business logic, and data access — into one deployable artifact. It is the simplest architecture to build and ideal for small teams, though it cannot scale its parts independently.',
  },
  {
    id: 'q2',
    question: 'What distinguishes a Modular Monolith from a standard Monolith?',
    options: [
      'It uses microservices internally',
      'It enforces clear module boundaries within a single deployment',
      'It deploys to multiple servers simultaneously',
      'It uses an event bus for all internal communication',
    ],
    correctAnswer: 'It enforces clear module boundaries within a single deployment',
    explanation:
      'A Modular Monolith retains the simplicity of a single deployment but organises code into well-defined modules with explicit interfaces. This prevents the "big ball of mud" while avoiding the operational overhead of microservices.',
  },
  {
    id: 'q3',
    question: 'Which architecture pattern is BEST suited for workloads with unpredictable, bursty traffic?',
    options: [
      'Layered Architecture',
      'CQRS',
      'Serverless',
      'Hexagonal Architecture',
    ],
    correctAnswer: 'Serverless',
    explanation:
      'Serverless functions scale to zero when idle and scale out automatically on demand, making them ideal for workloads with variable or bursty traffic patterns. You pay only for actual invocations.',
  },
  {
    id: 'q4',
    question: 'In Clean Architecture, the Dependency Rule states that source code dependencies can only point:',
    options: [
      'Outward — toward the UI and infrastructure',
      'Inward — toward the domain and use cases',
      'In any direction as long as interfaces are used',
      'Only toward the database layer',
    ],
    correctAnswer: 'Inward — toward the domain and use cases',
    explanation:
      'The Dependency Rule is the core principle of Clean Architecture: outer layers (UI, infrastructure) depend on inner layers (domain), never the reverse. This makes the domain logic independent of frameworks and databases.',
  },
  {
    id: 'q5',
    question: 'CQRS stands for:',
    options: [
      'Create, Query, Run, Schedule',
      'Command Query Responsibility Segregation',
      'Component Query Response System',
      'Centralised Query and Retrieval Service',
    ],
    correctAnswer: 'Command Query Responsibility Segregation',
    explanation:
      'CQRS separates write operations (Commands) from read operations (Queries) into distinct models and often distinct data stores. This allows each side to be optimised independently and scales well for read-heavy applications.',
  },
  {
    id: 'q6',
    question: "What is a 'Port' in Hexagonal Architecture?",
    options: [
      'A network port number used by the application',
      'An interface defining how the application core interacts with the outside world',
      'A direct database connection',
      'A REST API endpoint exposed to clients',
    ],
    correctAnswer: 'An interface defining how the application core interacts with the outside world',
    explanation:
      'In Hexagonal Architecture, a Port is an interface on the boundary of the application core. Adapters implement these ports to connect the core to databases, UIs, or external services — keeping the core completely decoupled from infrastructure.',
  },
  {
    id: 'q7',
    question: 'Which architecture pattern allows individual application components to be deployed and scaled independently?',
    options: [
      'Monolithic Architecture',
      'Layered Architecture',
      'Microservices',
      'Clean Architecture',
    ],
    correctAnswer: 'Microservices',
    explanation:
      'Microservices decompose an application into small, independently deployable services. Each service can be scaled based on its own load, deployed on its own schedule, and implemented in the most suitable technology.',
  },
  {
    id: 'q8',
    question: 'In Layered Architecture, which layer is responsible for business rules and domain logic?',
    options: [
      'Presentation Layer',
      'Business Logic Layer',
      'Data Access Layer',
      'Infrastructure Layer',
    ],
    correctAnswer: 'Business Logic Layer',
    explanation:
      'The Business Logic Layer (also called the Service or Domain Layer) contains the core business rules and workflows. It sits between the Presentation Layer (which handles user interaction) and the Data Access Layer (which handles persistence).',
  },
  {
    id: 'q9',
    question: 'Event-Driven Architecture primarily uses what mechanism for component communication?',
    options: [
      'Direct synchronous method calls',
      'Shared database tables',
      'Asynchronous events and messages',
      'REST API polling',
    ],
    correctAnswer: 'Asynchronous events and messages',
    explanation:
      'In Event-Driven Architecture, components communicate by publishing and subscribing to events asynchronously. This decouples producers from consumers — neither needs to know about the other, making the system highly flexible and scalable.',
  },
  {
    id: 'q10',
    question: 'What is the primary trade-off of adopting Microservices over a well-structured Monolith?',
    options: [
      'Reduced deployment frequency across all services',
      'Introduced distributed systems complexity',
      'Slower in-process communication between modules',
      'Forced use of a single programming language',
    ],
    correctAnswer: 'Introduced distributed systems complexity',
    explanation:
      'Microservices introduce network latency, distributed transactions, service discovery, observability challenges, and significant operational overhead that simply do not exist in a monolith. This trade-off is only worth it when the scaling or team-independence benefits are concrete and pressing.',
  },
];