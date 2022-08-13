class Config {
  public cellSize: number;
  constructor() {
    this.cellSize = 20;
  }
}

export default new Config();

export const BATTLEFIELD_ENV = {
  width: 10,
  height: 20,
};
