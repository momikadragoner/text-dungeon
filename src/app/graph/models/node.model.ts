export interface Node {
  id: string;
  edges: string[];
}

// graph: Node[] = [
//   { id: 'start', edges: ['1', '2', '5'] },
//   { id: '1', edges: ['3', '4'] },
//   { id: '2', edges: ['5', 'start'] },
//   { id: '3', edges: ['1'] },
//   { id: '4', edges: ['5'] },
//   { id: '5', edges: ['4'] },
//   { id: '6', edges: ['7', '8'] },
//   { id: '7', edges: [] },
//   { id: '8', edges: [] },
//   { id: '9', edges: [] },
// ];
