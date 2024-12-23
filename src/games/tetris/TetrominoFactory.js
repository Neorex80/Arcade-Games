export class TetrominoFactory {
  constructor() {
    this.shapes = {
      I: {
        shape: [[1, 1, 1, 1]],
        color: '#00f0f0'
      },
      O: {
        shape: [[1, 1], [1, 1]],
        color: '#f0f000'
      },
      T: {
        shape: [[0, 1, 0], [1, 1, 1]],
        color: '#a000f0'
      },
      S: {
        shape: [[0, 1, 1], [1, 1, 0]],
        color: '#00f000'
      },
      Z: {
        shape: [[1, 1, 0], [0, 1, 1]],
        color: '#f00000'
      },
      J: {
        shape: [[1, 0, 0], [1, 1, 1]],
        color: '#0000f0'
      },
      L: {
        shape: [[0, 0, 1], [1, 1, 1]],
        color: '#f0a000'
      }
    };
  }

  createRandom() {
    const pieces = Object.keys(this.shapes);
    const type = pieces[Math.floor(Math.random() * pieces.length)];
    const { shape, color } = this.shapes[type];
    
    return {
      shape: shape,
      color: color,
      x: Math.floor((10 - shape[0].length) / 2),
      y: 0,
      getRotated: function() {
        // Get dimensions
        const M = this.shape.length;
        const N = this.shape[0].length;
        
        // Create new array for rotated shape
        const rotated = Array(N).fill().map(() => Array(M).fill(0));
        
        // Rotate 90 degrees clockwise
        for (let i = 0; i < M; i++) {
          for (let j = 0; j < N; j++) {
            rotated[j][M - 1 - i] = this.shape[i][j];
          }
        }
        
        return rotated;
      }
    };
  }
}