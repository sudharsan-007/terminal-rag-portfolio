
export interface SkillNode {
  id: string;
  name: string;
  group: string;
  level: number;
  description: string;
  radius: number;
  color: string;
}

export interface SkillLink {
  source: string;
  target: string;
  strength: number;
}

export interface SkillGraph {
  nodes: SkillNode[];
  links: SkillLink[];
}
