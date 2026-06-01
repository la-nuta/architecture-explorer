export interface DiagramNode {
  id: string;
  label: string;
  type: 'layer' | 'service' | 'boundary' | 'actor';
  connections: string[];
}

export interface CodeExample {
  language: 'typescript';
  label: string;
  code: string;
}

export interface ArchitecturePattern {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  useCases: string[];
  avoidWhen: string[];
  pros: string[];
  cons: string[];
  commonMistakes: string[];
  interviewAnswer: string;
  diagramNodes: DiagramNode[];
  codeExample: CodeExample;
  comparison: {
    complexity: 'Low' | 'Medium' | 'High';
    scalability: 'Low' | 'Medium' | 'High';
    teamSize: 'Small' | 'Medium' | 'Large';
    deploymentComplexity: 'Low' | 'Medium' | 'High';
    testingComplexity: 'Low' | 'Medium' | 'High';
  };
}
