//TODO(@DreamTexX): Remove interface and replace with hook
export interface OnModuleInit {
  onModuleInit(): Promise<void> | void;
}
