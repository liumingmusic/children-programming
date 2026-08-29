import type { CourseProject } from "@/courses";

/** L·算法 4：BFS 迷宫求解——用队列一层层向外探索，找到最短出路。 */
export const algoMaze: CourseProject = {
  slug: "algo_maze",
  title: "迷宫求解：广度优先搜索 BFS",
  ageGroup: "13-16 岁",
  description: "把迷宫当成网格，从入口出发，用「队列」一层层向外扩散探索，直到触到出口——这就是广度优先搜索。",
  category: "algo",
  missionBrief:
    "迷宫是一张网格：0 是可以走的路，1 是墙。广度优先搜索（BFS）像一个水面波纹，从起点一圈圈向外扩散：\n· 用一个队列 queue 存放「待探索的格子」\n· 每取出一个格子，看它上下左右四个邻居\n· 没走过、也不是墙的邻居，标记为已访问并加入队列\n· 一旦取出的是出口，就找到了路\n\n我们用 visited 二维数组记录「已经扩散到哪些格子」，把它染成黄色，看波纹如何铺开。",
  erLingHint:
    "提示：const maze = [[0,1,0,...],...]; 建 visited 二维数组全 false；queue = [起点]；while (queue.length > 0) 里 cur = queue.shift()，遍历四个方向，合法且未访问就 visited=true 并 queue.push(邻居)。每轮 clearCanvas 重画网格并 wait(0.25)。",
  steps: [
    { id: 1, title: "用二维数组表示迷宫地图" },
    { id: 2, title: "用队列（push/shift）做广度优先扩散" },
    { id: 3, title: "运行，看探索波纹如何找到出口" },
  ],
  codeMode: true,
  defaultCode:
    "// 广度优先搜索（BFS）：像水波一样一层层向外扩散\n" +
    "const maze = [\n" +
    "  [0, 1, 0, 0, 0],\n" +
    "  [0, 1, 0, 1, 0],\n" +
    "  [0, 0, 0, 1, 0],\n" +
    "  [1, 1, 0, 0, 0],\n" +
    "  [0, 0, 0, 1, 0],\n" +
    "];\n" +
    "const rows = maze.length, cols = maze[0].length;\n" +
    "const start = [0, 0], end = [rows - 1, cols - 1];\n" +
    "const visited = [];\n" +
    "for (let r = 0; r < rows; r++) { visited.push([]); for (let c = 0; c < cols; c++) visited[r].push(false); }\n" +
    "const queue = [start];\n" +
    "visited[start[0]][start[1]] = true;\n" +
    "const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];\n" +
    "const cell = 40, ox = -100, oy = -100;\n" +
    "\n" +
    "function draw(found) {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {\n" +
    "    const x = ox + c * cell, y = oy + r * cell;\n" +
    "    const color = maze[r][c] === 1 ? \"#475569\" : (visited[r][c] ? \"#FBBF24\" : \"#FFFFFF\");\n" +
    "    __runtime.drawRect(x, y, cell - 4, cell - 4, color);\n" +
    "  }\n" +
    "  if (found) __runtime.drawRect(ox + end[1] * cell, oy + end[0] * cell, cell - 4, cell - 4, \"#22C55E\");\n" +
    "}\n" +
    "\n" +
    "let found = false;\n" +
    "while (queue.length > 0) {\n" +
    "  const cur = queue.shift();\n" +
    "  if (cur[0] === end[0] && cur[1] === end[1]) { found = true; break; }\n" +
    "  for (const d of dirs) {\n" +
    "    const nr = cur[0] + d[0], nc = cur[1] + d[1];\n" +
    "    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && maze[nr][nc] === 0) {\n" +
    "      visited[nr][nc] = true; queue.push([nr, nc]);\n" +
    "    }\n" +
    "  }\n" +
    "  draw(false);\n" +
    "  __runtime.wait(0.25);\n" +
    "}\n" +
    "draw(found);\n" +
    "__runtime.drawText(-100, 130, found ? \"找到出路！\" : \"无路可走\", \"#22C55E\", 18);\n",
};
