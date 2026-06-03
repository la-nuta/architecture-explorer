import { ArchitecturePattern } from '../core/models/architecture-pattern.model';

export const ARCHITECTURE_PATTERNS: ArchitecturePattern[] = [
  {
    id: '1',
    slug: 'monolith',
    title: 'Monolithic Architecture',
    shortDescription: 'A single deployable unit containing all application functionality.',
    overview:
      'A monolithic application bundles all features — UI, business logic, and data access — into a single deployable artifact. It is the simplest architecture to build and understand, making it ideal for early-stage products and small teams. All components share the same process and memory space, enabling straightforward inter-module communication without network overhead.',
    difficulty: 'Beginner',
    tags: ['backend', 'simple', 'single-deployment', 'beginner-friendly'],
    useCases: [
      'MVPs and early-stage startups',
      'Internal tools with a small team',
      'Applications with low traffic and simple domain',
      'Proof-of-concept systems',
      'Content management systems with limited scale requirements'
    ],
    avoidWhen: [
      'Team grows beyond ~10 engineers working on the same codebase',
      'Different parts of the system need independent scaling',
      'Services require different tech stacks'
    ],
    pros: [
      'Simple to develop, test, and deploy',
      'No distributed system complexity',
      'Easy to debug — single process, single log stream',
      'Low operational overhead',
      'Fast in-process communication between modules'
    ],
    cons: [
      'Scales as a single unit — cannot scale parts independently',
      'Growing codebase leads to tight coupling',
      'Long build/deploy times as the app grows',
      'Technology lock-in across the entire application'
    ],
    commonMistakes: [
      'Skipping module boundaries inside the monolith — leads to a "big ball of mud"',
      'Not extracting services early enough, making later migration painful',
      'Assuming all monoliths are bad — for small teams they are often optimal'
    ],
    interviewAnswer:
      'A monolith packages all layers in one deployable unit — great for small teams because there is no distributed-systems overhead. The real risk is poor internal modularity: if every module imports every other module directly, you end up with a big ball of mud that is impossible to refactor. The fix is enforcing clear module boundaries inside the monolith even when you have no plans to split it. I always recommend starting with a well-structured monolith and extracting services only when there is a concrete scaling or team-independence need.',
    diagramNodes: [
      { id: 'client', label: 'Client\n(Browser / Mobile)', type: 'actor', connections: ['presentation'] },
      { id: 'presentation', label: 'Presentation Layer\n(Controllers / Views)', type: 'layer', connections: ['business'] },
      { id: 'business', label: 'Business Logic\n(Services / Domain)', type: 'layer', connections: ['data'] },
      { id: 'data', label: 'Data Access Layer\n(Repositories)', type: 'layer', connections: ['db'] },
      { id: 'db', label: 'Database\n(Single Instance)', type: 'layer', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Monolith: Express app with all layers in one process',
      code: `// All layers colocated in one deployable unit
import express from 'express';
import { Database } from './database';

const app = express();
const db = new Database();

// Presentation layer
app.get('/users/:id', async (req, res) => {
  const user = await getUserById(req.params.id);
  res.json(user);
});

// Business logic layer
async function getUserById(id: string) {
  const raw = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  if (!raw) throw new Error('User not found');
  return { id: raw.id, name: raw.name, email: raw.email };
}

// Data layer — inline SQL in same process
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const id = crypto.randomUUID();
  await db.query(
    'INSERT INTO users VALUES ($1, $2, $3)',
    [id, name, email]
  );
  res.status(201).json({ id });
});

app.listen(3000);`
    },
    comparison: {
      complexity: 'Low',
      scalability: 'Low',
      teamSize: 'Small',
      deploymentComplexity: 'Low',
      testingComplexity: 'Low'
    }
  },
  {
    id: '2',
    slug: 'modular-monolith',
    title: 'Modular Monolith',
    shortDescription: 'A single deployable unit with well-defined internal module boundaries.',
    overview:
      'A modular monolith retains the deployment simplicity of a traditional monolith while imposing strict internal boundaries between feature modules. Each module owns its own domain logic, data layer, and public API surface — other modules may only interact through defined interfaces. This approach provides a natural migration path toward microservices if the need arises, without paying distributed-systems costs upfront.',
    difficulty: 'Intermediate',
    tags: ['backend', 'modularity', 'bounded-contexts', 'single-deployment', 'domain-driven'],
    useCases: [
      'Mid-sized applications with multiple business domains',
      'Teams of 5–20 engineers on a shared codebase',
      'Applications expected to grow but not yet requiring independent deployment',
      'Systems where domain boundaries are known but microservices overhead is undesirable',
      'Migrating a "big ball of mud" monolith toward cleaner architecture'
    ],
    avoidWhen: [
      'Individual modules require different scaling profiles urgently',
      'Teams need fully independent deployment pipelines from day one',
      'The domain is simple enough that even module boundaries add unnecessary ceremony'
    ],
    pros: [
      'Enforced module isolation prevents accidental coupling',
      'Easier refactoring and onboarding — each module is self-contained',
      'Single deployment unit keeps operational complexity low',
      'Cleaner path to microservices extraction when needed',
      'Enables multiple teams to work with fewer merge conflicts'
    ],
    cons: [
      'Requires discipline to maintain module boundaries — no technical enforcement by default',
      'All modules still share the same runtime, so a memory leak affects the whole system',
      'Database schema can become a shared coupling point if not isolated per module',
      'Cross-module transactions are complex without a distributed transaction strategy'
    ],
    commonMistakes: [
      'Allowing modules to share database tables directly, defeating logical isolation',
      'Exposing internal domain objects as the module public API instead of dedicated DTOs',
      'Treating the modular monolith as a stepping stone and never enforcing boundaries properly'
    ],
    interviewAnswer:
      'A modular monolith gives you domain isolation without distributed-systems overhead. Each module is a bounded context with a clear public interface — no other module reaches into its internals. The hardest discipline is database isolation: if two modules share a table, they are not truly decoupled. I enforce this by giving each module its own schema prefix and only allowing cross-module data access via service calls, never direct SQL joins. This approach also makes future microservices extraction straightforward — each module already behaves like an independent service.',
    diagramNodes: [
      { id: 'client', label: 'Client', type: 'actor', connections: ['app'] },
      { id: 'app', label: 'Application Shell', type: 'boundary', connections: ['moduleA', 'moduleB', 'moduleC'] },
      { id: 'moduleA', label: 'Orders Module', type: 'service', connections: ['db'] },
      { id: 'moduleB', label: 'Users Module', type: 'service', connections: ['db'] },
      { id: 'moduleC', label: 'Products Module', type: 'service', connections: ['db'] },
      { id: 'db', label: 'Database\n(isolated schemas)', type: 'layer', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Modular Monolith: modules with explicit public API contracts',
      code: `// modules/orders/orders.module.ts — public API surface
export interface OrdersApi {
  createOrder(userId: string, items: CartItem[]): Promise<Order>;
  getOrder(orderId: string): Promise<Order | null>;
}

// modules/orders/orders.service.ts — internal implementation
class OrdersService implements OrdersApi {
  constructor(
    private readonly repo: OrdersRepository, // owns its DB schema
    private readonly usersApi: UsersApi      // only via public contract
  ) {}

  async createOrder(userId: string, items: CartItem[]) {
    const user = await this.usersApi.getUser(userId);
    if (!user) throw new Error('User not found');
    const order = Order.create(userId, items);
    await this.repo.save(order);
    return order;
  }

  async getOrder(orderId: string) {
    return this.repo.findById(orderId);
  }
}

// bootstrap.ts — wire modules together
const usersModule = new UsersModule(db.schema('users'));
const ordersModule = new OrdersModule(
  db.schema('orders'),
  usersModule.api // only the public interface is passed
);`
    },
    comparison: {
      complexity: 'Medium',
      scalability: 'Low',
      teamSize: 'Medium',
      deploymentComplexity: 'Low',
      testingComplexity: 'Medium'
    }
  },
  {
    id: '3',
    slug: 'microservices',
    title: 'Microservices Architecture',
    shortDescription: 'An application composed of small, independently deployable services that communicate over a network.',
    overview:
      'Microservices decompose an application into small, focused services that each own their domain, data store, and deployment pipeline. Services communicate via lightweight protocols — typically REST, gRPC, or asynchronous messaging. This architecture enables teams to deploy, scale, and evolve services independently, but introduces significant distributed-systems complexity around service discovery, fault tolerance, and data consistency.',
    difficulty: 'Advanced',
    tags: ['distributed-systems', 'scalability', 'independent-deployment', 'cloud-native', 'devops'],
    useCases: [
      'Large-scale platforms with multiple independent teams',
      'Systems requiring per-service scaling (e.g., video processing vs. user auth)',
      'Applications with polyglot technology requirements across domains',
      'High-availability systems needing fault isolation',
      'Organizations adopting continuous delivery with independent release cycles'
    ],
    avoidWhen: [
      'Team is small or domain boundaries are not yet well understood',
      'The operational maturity (CI/CD, observability, container orchestration) is not in place',
      'Latency-sensitive workflows require tight in-process data sharing'
    ],
    pros: [
      'Independent deployment and scaling per service',
      'Fault isolation — one service crashing does not bring down others',
      'Technology heterogeneity — each service can use the best tool for the job',
      'Enables parallel team development with clear ownership',
      'Easier to understand individual services in isolation'
    ],
    cons: [
      'High operational overhead — service discovery, load balancing, distributed tracing',
      'Distributed transactions and eventual consistency are hard to reason about',
      'Network failures and latency become first-class concerns',
      'Integration testing across services is complex and slow'
    ],
    commonMistakes: [
      'Creating services that are too fine-grained, causing chatty inter-service communication',
      'Sharing a database between services — this is the most common microservices anti-pattern',
      'Not investing in observability (tracing, metrics, logs) before going to production'
    ],
    interviewAnswer:
      'Microservices give you independent deployability and fault isolation, but you pay with distributed-systems complexity. The key principle I follow is: each service owns its data — no shared databases. Data consistency is handled through eventual consistency via events, not distributed transactions. I also advocate for starting with a modular monolith and extracting services based on actual scaling or team-ownership needs rather than following microservices dogma from day one. Without solid CI/CD and observability in place, microservices create more problems than they solve.',
    diagramNodes: [
      { id: 'client', label: 'Client', type: 'actor', connections: ['gateway'] },
      { id: 'gateway', label: 'API Gateway', type: 'boundary', connections: ['usersSvc', 'ordersSvc', 'productsSvc'] },
      { id: 'usersSvc', label: 'Users Service', type: 'service', connections: ['usersDb'] },
      { id: 'ordersSvc', label: 'Orders Service', type: 'service', connections: ['ordersDb'] },
      { id: 'productsSvc', label: 'Products Service', type: 'service', connections: ['productsDb'] },
      { id: 'usersDb', label: 'Users DB', type: 'layer', connections: [] },
      { id: 'ordersDb', label: 'Orders DB', type: 'layer', connections: [] },
      { id: 'productsDb', label: 'Products DB', type: 'layer', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Microservices: service-to-service communication with resilience',
      code: `// orders-service/src/order.service.ts
import { HttpClient } from './http-client';
import { CircuitBreaker } from './circuit-breaker';

export class OrderService {
  private userBreaker = new CircuitBreaker({ threshold: 5 });

  constructor(
    private readonly http: HttpClient,
    private readonly repo: OrderRepository,
    private readonly eventBus: EventBus
  ) {}

  async createOrder(userId: string, items: CartItem[]) {
    const user = await this.userBreaker.execute(() =>
      this.http.get<User>(\`http://users-svc/users/\${userId}\`)
    );
    if (!user) throw new ServiceUnavailableError('Users service');

    const order = new Order({ userId, items, status: 'pending' });
    await this.repo.save(order);

    // Publish domain event — avoid direct service coupling
    await this.eventBus.publish('order.created', {
      orderId: order.id,
      userId,
      total: order.total
    });
    return order;
  }

  async getOrder(orderId: string) {
    const order = await this.repo.findById(orderId);
    if (!order) throw new NotFoundError(\`Order \${orderId} not found\`);
    return order;
  }
}

// Each service runs independently — one container per service:
// $ docker run -p 3001:3000 orders-service`
    },
    comparison: {
      complexity: 'High',
      scalability: 'High',
      teamSize: 'Large',
      deploymentComplexity: 'High',
      testingComplexity: 'High'
    }
  },
  {
    id: '4',
    slug: 'layered',
    title: 'Layered Architecture',
    shortDescription: 'An architecture organized into horizontal layers, each with a specific responsibility.',
    overview:
      'Layered (N-tier) architecture organizes code into horizontal layers — typically Presentation, Business Logic, and Data Access — where each layer only communicates with the layer directly below it. This creates a clear separation of concerns and is the most widely taught pattern in software engineering. While straightforward to understand, it can lead to anemic domain models and unnecessary pass-through code in larger systems.',
    difficulty: 'Beginner',
    tags: ['layered', 'n-tier', 'separation-of-concerns', 'backend', 'classic'],
    useCases: [
      'Enterprise web applications following MVC patterns',
      'CRUD-heavy back-office systems',
      'Applications where the team is familiar with traditional OOP patterns',
      'Systems where strict layer separation aids compliance and auditing',
      'Greenfield projects for teams new to architecture patterns'
    ],
    avoidWhen: [
      'Business logic is complex — layers encourage anemic domain models',
      'You need to swap data sources frequently — the tight coupling to a specific DB layer is restrictive',
      'High-performance systems where pass-through layer overhead is unacceptable'
    ],
    pros: [
      'Easy to understand and teach — widely adopted convention',
      'Clear separation of concerns — UI, logic, and data are distinct',
      'Testable — each layer can be unit-tested with mocks',
      'Consistent structure makes onboarding faster',
      'Framework support — most web frameworks enforce this naturally'
    ],
    cons: [
      'Can lead to anemic domain models where logic lives in service classes, not entities',
      'Changes often require touching all layers even for small features',
      'Lower layers can become God objects with too many responsibilities',
      'Strict top-down dependency can prevent flexible composition'
    ],
    commonMistakes: [
      'Skipping the business logic layer and putting domain logic directly in controllers',
      'Leaking domain entities directly to the presentation layer (no DTOs)',
      'Creating a "service layer" that is just a thin pass-through to the repository'
    ],
    interviewAnswer:
      'Layered architecture is one of the most recognizable patterns — Presentation calls Business Logic, which calls Data Access. Its strength is predictability and onboarding speed. The classic pitfall is anemic domain models: when all behavior lives in service classes and entities are just data bags, you lose the power of object-oriented design. I prefer combining layered architecture with rich domain objects to get the best of both. For read-heavy systems I also consider collapsing the service layer for simple queries to avoid unnecessary indirection.',
    diagramNodes: [
      { id: 'presentation', label: 'Presentation Layer\n(Controllers / UI)', type: 'layer', connections: ['business'] },
      { id: 'business', label: 'Business Logic Layer\n(Services / Use Cases)', type: 'layer', connections: ['data'] },
      { id: 'data', label: 'Data Access Layer\n(Repositories / ORM)', type: 'layer', connections: ['db'] },
      { id: 'db', label: 'Database', type: 'layer', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Layered Architecture: Presentation → Business → Data layers',
      code: `// Presentation Layer — controller handles HTTP
class UserController {
  constructor(private readonly userService: UserService) {}
  async getUser(req: Request, res: Response) {
    res.json(await this.userService.getUserById(req.params.id));
  }
  async createUser(req: Request, res: Response) {
    res.status(201).json(await this.userService.createUser(req.body));
  }
}

// Business Logic Layer — domain rules live here
class UserService {
  constructor(private readonly userRepo: UserRepository) {}
  async getUserById(id: string): Promise<UserDto> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError(\`User \${id} not found\`);
    if (user.isBanned) throw new ForbiddenError('User is banned');
    return UserMapper.toDto(user); // never expose raw DB entities
  }
  async createUser(data: CreateUserDto): Promise<UserDto> {
    if (await this.userRepo.findByEmail(data.email)) throw new ConflictError('Email in use');
    return UserMapper.toDto(await this.userRepo.save(UserEntity.create(data)));
  }
}

// Data Access Layer — abstracts persistence details
class UserRepository {
  constructor(private readonly db: DbConnection) {}
  async findById(id: string): Promise<UserEntity | null> {
    return this.db.table('users').where({ id }).first();
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.db.table('users').where({ email }).first();
  }
  async save(e: UserEntity): Promise<UserEntity> {
    return this.db.table('users').insert(e).returning('*');
  }
}`

    },
    comparison: {
      complexity: 'Low',
      scalability: 'Medium',
      teamSize: 'Small',
      deploymentComplexity: 'Low',
      testingComplexity: 'Low'
    }
  },
  {
    id: '5',
    slug: 'clean',
    title: 'Clean Architecture',
    shortDescription: 'Concentric layers with domain entities at the center, independent of frameworks and infrastructure.',
    overview:
      'Clean Architecture, popularized by Robert C. Martin, organizes code into concentric rings: Entities at the core, Use Cases around them, Interface Adapters outside that, and Frameworks & Drivers at the outermost ring. The Dependency Rule mandates that source code dependencies only point inward — the domain never knows about Express, React, or PostgreSQL. This produces highly testable, framework-agnostic business logic.',
    difficulty: 'Advanced',
    tags: ['clean-code', 'domain-driven', 'testability', 'solid', 'dependency-inversion'],
    useCases: [
      'Long-lived enterprise applications with complex domain logic',
      'Systems that may need to swap frameworks or databases over time',
      'Applications requiring high unit test coverage of business rules',
      'Teams practicing TDD where tests should not depend on infrastructure',
      'Regulated industries where business rules must be auditable and isolated'
    ],
    avoidWhen: [
      'Simple CRUD applications where the ceremony of use cases adds no value',
      'Rapid prototyping where speed matters more than long-term maintainability',
      'Small teams where the boilerplate-to-value ratio is too high'
    ],
    pros: [
      'Business rules are completely independent of frameworks and databases',
      'Domain logic is trivially unit-testable without spinning up infrastructure',
      'Frameworks and databases can be swapped with minimal business logic changes',
      'Enforces the Dependency Inversion Principle throughout the codebase',
      'Long-term maintainability is high despite higher initial setup cost'
    ],
    cons: [
      'Significant boilerplate — entities, use cases, interfaces, adapters, mappers',
      'Steeper learning curve for developers unfamiliar with the pattern',
      'Can be over-engineering for simple CRUD workflows',
      'Indirection can make the call stack hard to follow for newcomers'
    ],
    commonMistakes: [
      'Putting business logic in controllers instead of use cases',
      'Having use cases import directly from infrastructure (violates the Dependency Rule)',
      'Creating use cases that are just thin wrappers around repository calls with no real logic'
    ],
    interviewAnswer:
      'Clean Architecture is about the Dependency Rule: inner layers never depend on outer layers. Entities hold enterprise-wide business rules; use cases hold application-specific rules; adapters translate between the domain and the outside world. The payoff is that you can test every use case with plain unit tests — no HTTP, no database, no framework. The cost is boilerplate: ports, adapters, and mappers everywhere. I apply it selectively — complex business domains benefit enormously, simple CRUD modules do not. The key signal to reach for Clean Architecture is when you want to test business rules in isolation at high speed.',
    diagramNodes: [
      { id: 'frameworks', label: 'Frameworks & Drivers\n(Express, PostgreSQL)', type: 'layer', connections: ['adapters'] },
      { id: 'adapters', label: 'Interface Adapters\n(Controllers, Repositories)', type: 'layer', connections: ['usecases'] },
      { id: 'usecases', label: 'Use Cases\n(Application Business Rules)', type: 'layer', connections: ['entities'] },
      { id: 'entities', label: 'Entities\n(Enterprise Business Rules)', type: 'boundary', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Clean Architecture: use case with no infrastructure dependencies',
      code: `// ENTITY — pure domain object, no framework imports
class User {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    private passwordHash: string
  ) {}
  static create(email: string, hash: string): User {
    if (!email.includes('@')) throw new Error('Invalid email');
    return new User(crypto.randomUUID(), email, hash);
  }
}
// PORT — inward-pointing interface (no infrastructure imports)
interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// USE CASE — depends only on entities + ports
class RegisterUserUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new ConflictError('Email already taken');
    const hash = await this.hasher.hash(password);
    const user = User.create(email, hash);
    await this.users.save(user);
    return user.id;
  }
}

// ADAPTER — implements the port, knows about PostgreSQL
class PgUserRepository implements UserRepository {
  async findByEmail(email: string) { /* pg query */ }
  async save(user: User) { /* pg insert */ }
}`
    },
    comparison: {
      complexity: 'High',
      scalability: 'Medium',
      teamSize: 'Medium',
      deploymentComplexity: 'Medium',
      testingComplexity: 'Low'
    }
  },
  {
    id: '6',
    slug: 'hexagonal',
    title: 'Hexagonal Architecture',
    shortDescription: 'An inside-out design using ports and adapters to isolate the domain from all external systems.',
    overview:
      'Hexagonal Architecture (also called Ports and Adapters), coined by Alistair Cockburn, places the application core at the center surrounded by ports (interfaces) and adapters (implementations). Driving adapters (e.g., HTTP controllers, CLI) call into the core through primary ports; driven adapters (e.g., databases, email services) implement secondary ports that the core depends on. The result is a domain that can run identically regardless of whether it is driven by an HTTP request, a message queue, or a test.',
    difficulty: 'Advanced',
    tags: ['ports-and-adapters', 'domain-driven', 'testability', 'dependency-inversion', 'hexagonal'],
    useCases: [
      'Applications needing to support multiple delivery mechanisms (REST, GraphQL, CLI, queue)',
      'Systems that must swap infrastructure (e.g., switch from MongoDB to PostgreSQL)',
      'Domain-rich applications benefiting from isolated unit tests',
      'Long-lived enterprise systems with evolving integration requirements',
      'TDD-first teams who want to drive design from tests before infrastructure exists'
    ],
    avoidWhen: [
      'Applications that are primarily infrastructure glue with minimal business logic',
      'Teams unfamiliar with the pattern where the ports/adapters naming creates confusion',
      'Simple CRUD APIs where the pattern adds overhead without benefit'
    ],
    pros: [
      'Application core is completely isolated from delivery mechanisms',
      'Easy to add new delivery mechanisms (add a new adapter without touching the domain)',
      'Highly testable — drive the application core from tests without any real infrastructure',
      'Clearly communicates what is "inside" (domain) vs "outside" (infrastructure)',
      'Reduces risk of framework upgrade breaking business logic'
    ],
    cons: [
      'Interface proliferation — every external dependency needs a port definition',
      'Higher learning curve compared to simple layered architecture',
      'Can feel over-engineered for applications with minimal domain logic',
      'Adapter mapping code adds lines of code with no visible business value'
    ],
    commonMistakes: [
      'Defining a port for every external call individually instead of grouping by domain concern',
      'Putting business logic inside adapters rather than the application core',
      'Confusing hexagonal with layered — hexagonal allows primary adapters to call secondary adapters indirectly through the core'
    ],
    interviewAnswer:
      'Hexagonal architecture separates driving side from driven side. Primary adapters (HTTP, CLI, message consumers) push data into the application core through primary ports; secondary ports (repository interfaces, notification services) are implemented by driven adapters like database clients. The insight that changed how I think about it: you can drive the entire application from a test without a server or database. This means you can have a very fast unit test suite that covers all business rules. The cost is that every external dependency requires an interface — a worthwhile trade for complex domains.',
    diagramNodes: [
      { id: 'httpAdapter', label: 'HTTP Adapter\n(Driving)', type: 'actor', connections: ['core'] },
      { id: 'cliAdapter', label: 'CLI Adapter\n(Driving)', type: 'actor', connections: ['core'] },
      { id: 'core', label: 'Application Core\n(Domain + Use Cases)', type: 'boundary', connections: ['dbAdapter', 'emailAdapter'] },
      { id: 'dbAdapter', label: 'DB Adapter\n(Driven)', type: 'service', connections: [] },
      { id: 'emailAdapter', label: 'Email Adapter\n(Driven)', type: 'service', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Hexagonal Architecture: ports and adapters isolating the domain',
      code: `// PRIMARY PORT — how the outside world drives the core
interface PaymentApplicationPort {
  processPayment(orderId: string, amount: number): Promise<PaymentResult>;
}

// SECONDARY PORT — what the core needs from outside
interface PaymentGatewayPort {
  charge(amount: number, token: string): Promise<GatewayResult>;
}
interface OrderRepositoryPort {
  findById(id: string): Promise<Order | null>;
  updateStatus(id: string, status: string): Promise<void>;
}

// APPLICATION CORE — depends only on ports
class PaymentService implements PaymentApplicationPort {
  constructor(
    private readonly gateway: PaymentGatewayPort,
    private readonly orders: OrderRepositoryPort
  ) {}

  async processPayment(orderId: string, amount: number) {
    const order = await this.orders.findById(orderId);
    if (!order) throw new NotFoundError(orderId);
    const result = await this.gateway.charge(amount, order.paymentToken);
    await this.orders.updateStatus(orderId, result.success ? 'paid' : 'failed');
    return result;
  }
}

// DRIVING ADAPTER — HTTP controller
class PaymentController {
  constructor(private readonly port: PaymentApplicationPort) {}
  async handle(req: Request, res: Response) {
    const result = await this.port.processPayment(req.body.orderId, req.body.amount);
    res.json(result);
  }
}`
    },
    comparison: {
      complexity: 'High',
      scalability: 'Medium',
      teamSize: 'Medium',
      deploymentComplexity: 'Medium',
      testingComplexity: 'Low'
    }
  },
  {
    id: '7',
    slug: 'event-driven',
    title: 'Event-Driven Architecture',
    shortDescription: 'Components communicate through events, enabling loose coupling and asynchronous processing.',
    overview:
      'Event-Driven Architecture (EDA) decouples producers and consumers by having components emit domain events that other components react to, typically through a message broker like Kafka or RabbitMQ. Producers have no knowledge of who consumes their events, enabling independent evolution of services. EDA excels at handling high-throughput, asynchronous workflows and building audit logs naturally as a side effect of business operations.',
    difficulty: 'Intermediate',
    tags: ['asynchronous', 'messaging', 'kafka', 'loose-coupling', 'real-time', 'pub-sub'],
    useCases: [
      'Order processing pipelines with multiple downstream effects',
      'Real-time notifications and user activity feeds',
      'Audit logging and event sourcing systems',
      'Integrating multiple services without direct API dependencies',
      'High-throughput data ingestion where backpressure handling is needed'
    ],
    avoidWhen: [
      'The workflow requires immediate, synchronous confirmation (e.g., payment authorization)',
      'The team lacks experience with eventual consistency and message delivery guarantees',
      'The system is simple enough that a direct service call is more readable and debuggable'
    ],
    pros: [
      'Extremely loose coupling — producers do not know their consumers',
      'Natural scalability — consumers can be scaled independently based on queue depth',
      'Built-in audit trail — every event is an immutable record of what happened',
      'Resilient — if a consumer is down, events accumulate and are processed on recovery',
      'Enables fan-out easily — one event can trigger many independent workflows'
    ],
    cons: [
      'Eventual consistency is harder to reason about than synchronous request/response',
      'Debugging distributed event flows requires robust tracing and correlation IDs',
      'Schema evolution and backward compatibility of event payloads is non-trivial',
      'Message broker becomes a critical infrastructure dependency'
    ],
    commonMistakes: [
      'Publishing fine-grained technical events instead of meaningful domain events',
      'Not including a correlation ID in events, making distributed tracing impossible',
      'Forgetting idempotency — consumers must handle duplicate event delivery safely'
    ],
    interviewAnswer:
      'Event-driven architecture decouples services at the communication level — a producer emits an event and does not care who consumes it or when. The power is natural loose coupling and horizontal scalability. The challenge is that you give up synchronous consistency: if the inventory service is down when an order event arrives, the inventory update happens later. I always ensure two things: every event carries a correlation ID for tracing, and every consumer is idempotent — processing the same event twice must produce the same result. Getting those two right eliminates most EDA debugging nightmares.',
    diagramNodes: [
      { id: 'producer', label: 'Event Producer\n(Orders Service)', type: 'service', connections: ['broker'] },
      { id: 'broker', label: 'Message Broker\n(Kafka / RabbitMQ)', type: 'boundary', connections: ['consumerA', 'consumerB'] },
      { id: 'consumerA', label: 'Consumer A\n(Inventory Service)', type: 'service', connections: [] },
      { id: 'consumerB', label: 'Consumer B\n(Notification Service)', type: 'service', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Event-Driven: producer emits domain events, consumers react independently',
      code: `// Domain event — includes correlationId for tracing
interface OrderCreatedEvent {
  type: 'order.created';
  correlationId: string;
  occurredAt: string;
  payload: {
    orderId: string;
    userId: string;
    items: { productId: string; qty: number }[];
    total: number;
  };
}
// Producer — saves order then emits event
class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly events: EventBus
  ) {}
  async createOrder(userId: string, items: CartItem[]) {
    const order = Order.create(userId, items);
    await this.orderRepo.save(order);
    await this.events.publish<OrderCreatedEvent>({
      type: 'order.created',
      correlationId: crypto.randomUUID(),
      occurredAt: new Date().toISOString(),
      payload: { orderId: order.id, userId, items, total: order.total }
    });
    return order.id;
  }
}
// Consumer — idempotent: safe to process the same event twice
class InventoryConsumer {
  async handle(event: OrderCreatedEvent) {
    if (await this.dedup.check(event.correlationId)) return;
    for (const item of event.payload.items) {
      await this.inventory.reserve(item.productId, item.qty);
    }
    await this.dedup.mark(event.correlationId);
  }
}`
    },
    comparison: {
      complexity: 'Medium',
      scalability: 'High',
      teamSize: 'Medium',
      deploymentComplexity: 'Medium',
      testingComplexity: 'Medium'
    }
  },
  {
    id: '8',
    slug: 'cqrs',
    title: 'CQRS (Command Query Responsibility Segregation)',
    shortDescription: 'Separates read and write models, allowing each to be optimized independently.',
    overview:
      'CQRS separates the operations that change state (Commands) from the operations that read state (Queries), each handled by a distinct model. The write side enforces business invariants through a rich domain model; the read side uses denormalized, query-optimized projections. This allows reads and writes to scale independently, use different storage technologies, and evolve without coupling. CQRS is commonly paired with Event Sourcing, though each can be used independently.',
    difficulty: 'Advanced',
    tags: ['cqrs', 'commands', 'queries', 'event-sourcing', 'scalability', 'domain-driven'],
    useCases: [
      'High-read, low-write systems where query optimization is paramount',
      'Complex domains where the write model needs business rule enforcement',
      'Applications requiring audit trails via event sourcing on the write side',
      'Systems where read and write workloads have very different scaling profiles',
      'Reporting systems needing denormalized views derived from normalized write models'
    ],
    avoidWhen: [
      'Simple CRUD applications with symmetric read/write load — CQRS adds complexity without benefit',
      'Teams without strong DDD knowledge — misapplied CQRS creates more confusion than clarity',
      'Systems requiring immediate read-your-own-writes consistency after every command'
    ],
    pros: [
      'Read and write models can be independently optimized and scaled',
      'Write side enforces business invariants without read-path pollution',
      'Natural fit for event sourcing — commands produce events, projections consume them',
      'Read projections can be rebuilt from the event log if requirements change',
      'Multiple specialized read models can coexist for different query patterns'
    ],
    cons: [
      'Eventual consistency between write and read models requires careful UX handling',
      'Significantly more code — separate commands, handlers, queries, projections',
      'Projection synchronization complexity and potential stale read windows',
      'Over-engineering for applications without genuinely different read/write profiles'
    ],
    commonMistakes: [
      'Applying CQRS at the field level ("getters vs setters") instead of at the use-case level',
      'Making the read model depend on the write model — they must be decoupled',
      'Not handling projection rebuild scenarios — what happens when a projection schema changes'
    ],
    interviewAnswer:
      'CQRS acknowledges that reads and writes have fundamentally different requirements. The write side has a normalized domain model enforcing invariants via aggregates; the read side has denormalized projections tuned for query speed. The most important principle is that they are completely decoupled — the query handler never calls the write-side repository. The classic mistake is conflating CQRS with method naming — it is about independent models, not just naming methods "getX" vs "setX". Combined with Event Sourcing, CQRS also gives you a complete audit log and the ability to replay events to rebuild any projection.',
    diagramNodes: [
      { id: 'client', label: 'Client', type: 'actor', connections: ['cmdBus', 'queryBus'] },
      { id: 'cmdBus', label: 'Command Bus', type: 'boundary', connections: ['cmdHandler'] },
      { id: 'queryBus', label: 'Query Bus', type: 'boundary', connections: ['queryHandler'] },
      { id: 'cmdHandler', label: 'Command Handler\n(Write Model)', type: 'service', connections: ['writeDb'] },
      { id: 'queryHandler', label: 'Query Handler\n(Read Model)', type: 'service', connections: ['readDb'] },
      { id: 'writeDb', label: 'Write Store\n(Normalized)', type: 'layer', connections: [] },
      { id: 'readDb', label: 'Read Store\n(Denormalized)', type: 'layer', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'CQRS: separated command handlers and query handlers',
      code: `// COMMAND — represents intent to change state
interface CreateOrderCommand {
  type: 'CreateOrder';
  userId: string;
  items: { productId: string; qty: number }[];
}

// COMMAND HANDLER — enforces business rules, writes to write store
class CreateOrderHandler {
  constructor(private readonly writeRepo: OrderWriteRepository) {}

  async handle(cmd: CreateOrderCommand): Promise<string> {
    const order = Order.create(cmd.userId, cmd.items);
    // Order.create() validates invariants (stock, limits, etc.)
    await this.writeRepo.save(order);
    return order.id; // only returns ID, not the full read model
  }
}

// QUERY — represents intent to read state
interface GetOrderSummaryQuery {
  orderId: string;
}

// QUERY HANDLER — reads from optimized read store (never touches write store)
class GetOrderSummaryHandler {
  constructor(private readonly readRepo: OrderReadRepository) {}

  async handle(query: GetOrderSummaryQuery): Promise<OrderSummaryDto | null> {
    // Denormalized view: pre-joined with user name, product names, etc.
    return this.readRepo.findSummary(query.orderId);
  }
}

// DISPATCHER — routes commands and queries to their handlers
const commandBus = new CommandBus();
commandBus.register('CreateOrder', new CreateOrderHandler(writeRepo));

const queryBus = new QueryBus();
queryBus.register('GetOrderSummary', new GetOrderSummaryHandler(readRepo));`
    },
    comparison: {
      complexity: 'High',
      scalability: 'High',
      teamSize: 'Large',
      deploymentComplexity: 'Medium',
      testingComplexity: 'Medium'
    }
  },
  {
    id: '9',
    slug: 'serverless',
    title: 'Serverless Architecture',
    shortDescription: 'Functions-as-a-Service where the cloud provider manages infrastructure and scaling automatically.',
    overview:
      'Serverless architecture (FaaS) lets developers deploy individual functions that the cloud provider executes on demand, auto-scaling from zero to millions of invocations without infrastructure management. Billing is per-invocation rather than per-server, making it cost-effective for unpredictable or spiky workloads. While it eliminates operational overhead, it introduces constraints around cold start latency, execution duration, and local state.',
    difficulty: 'Intermediate',
    tags: ['cloud', 'faas', 'aws-lambda', 'auto-scaling', 'pay-per-use', 'stateless'],
    useCases: [
      'Event-driven processing: image resizing, file transformation pipelines',
      'APIs with unpredictable or spiky traffic patterns',
      'Scheduled jobs and cron-like background tasks',
      'Webhook handlers and third-party integration callbacks',
      'MVPs that need zero infrastructure management'
    ],
    avoidWhen: [
      'Long-running compute tasks that exceed function duration limits (15 min on AWS Lambda)',
      'Applications requiring persistent in-memory state between invocations',
      'Latency-sensitive user-facing APIs where cold starts are unacceptable'
    ],
    pros: [
      'Zero infrastructure management — no servers to provision, patch, or monitor',
      'Automatic scaling from zero to peak without configuration',
      'Pay-per-invocation cost model — no cost when idle',
      'Forces stateless, composable function design',
      'Fast time to deployment — focus is entirely on code, not infrastructure'
    ],
    cons: [
      'Cold start latency can degrade user experience, especially for JVM or .NET runtimes',
      'Vendor lock-in — functions use provider-specific APIs (AWS Lambda, Azure Functions)',
      'Difficult to test locally — requires emulation tools or cloud deployment for accurate testing',
      'Stateless constraint requires external stores (Redis, DynamoDB) for any shared state'
    ],
    commonMistakes: [
      'Creating functions that are too large or do too many things — violates single-responsibility',
      'Storing connection objects (DB pools, HTTP clients) outside the handler without considering cold starts',
      'Ignoring distributed tracing — serverless functions produce many disconnected log streams'
    ],
    interviewAnswer:
      'Serverless shifts operational responsibility to the cloud provider — you write functions, they handle scaling, patching, and provisioning. The economics are compelling for spiky workloads: you pay nothing when idle and scale instantly to demand. The constraints are well-known: cold starts, execution time limits, and statelessness. I address cold starts by keeping functions small with minimal dependencies and using provisioned concurrency for latency-sensitive paths. For state, I reach for DynamoDB or Redis depending on the consistency requirements. The biggest hidden cost is testing — local emulation never fully replicates cloud behavior, so I invest in integration tests against real cloud environments.',
    diagramNodes: [
      { id: 'client', label: 'Client', type: 'actor', connections: ['gateway'] },
      { id: 'gateway', label: 'API Gateway', type: 'boundary', connections: ['fnAuth', 'fnOrders', 'fnNotify'] },
      { id: 'fnAuth', label: 'Auth Function\n(Lambda)', type: 'service', connections: [] },
      { id: 'fnOrders', label: 'Orders Function\n(Lambda)', type: 'service', connections: ['store'] },
      { id: 'fnNotify', label: 'Notify Function\n(Lambda)', type: 'service', connections: [] },
      { id: 'store', label: 'Managed Store\n(DynamoDB / S3)', type: 'layer', connections: [] }
    ],
    codeExample: {
      language: 'typescript',
      label: 'Serverless: AWS Lambda function with DynamoDB integration',
      code: `import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
// Re-use client outside handler to survive warm invocations
const dynamo = new DynamoDBClient({ region: process.env['AWS_REGION'] });

// Lambda handler — stateless, single responsibility
export const createOrder: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body ?? '{}');

  if (!body.userId || !body.items?.length) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid input' }) };
  }

  const orderId = crypto.randomUUID();
  await dynamo.send(new PutItemCommand({
    TableName: process.env['ORDERS_TABLE'],
    Item: {
      PK: { S: \`ORDER#\${orderId}\` },
      userId: { S: body.userId },
      status: { S: 'pending' },
      createdAt: { S: new Date().toISOString() }
    },
    ConditionExpression: 'attribute_not_exists(PK)' // idempotency guard
  }));

  return { statusCode: 201, body: JSON.stringify({ orderId }) };
};

export const getOrder: APIGatewayProxyHandler = async (event) => {
  const orderId = event.pathParameters?.['orderId'];
  if (!orderId) return { statusCode: 400, body: JSON.stringify({ error: 'Missing orderId' }) };

  const result = await dynamo.send(new GetItemCommand({
    TableName: process.env['ORDERS_TABLE'],
    Key: { PK: { S: \`ORDER#\${orderId}\` } }
  }));

  if (!result.Item) return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) };
  return { statusCode: 200, body: JSON.stringify(result.Item) };
};`
    },
    comparison: {
      complexity: 'Medium',
      scalability: 'High',
      teamSize: 'Small',
      deploymentComplexity: 'Medium',
      testingComplexity: 'Medium'
    }
  }
];
