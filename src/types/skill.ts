
export interface SkillNode {
  id: string;
  name: string;
  group: string;
  level: number;
  description: string;
  radius?: number;
  color?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SkillLink {
  source: string | { id: string } | null;
  target: string | { id: string } | null;
  strength: number;
}

export interface SkillGraph {
  nodes: SkillNode[];
  links: SkillLink[];
}
