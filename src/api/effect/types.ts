export interface Effect {
  description: string;
  isActive: boolean;
  isPremium: boolean;
}
export interface LoopEffect extends Effect {
  name: "loop";
  config: {
    bpm: number;
  };
  keyId: number;
}
export interface VolumeEffect extends Effect {
  name: "volume";
  config: {
    level: number;
  };
  keyId: number;
  keyboardId: number;
}

export type Effects = LoopEffect | VolumeEffect;
