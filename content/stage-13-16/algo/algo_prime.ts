import type { CourseProject } from "@/courses";

/** L·算法 6：素数判断优化——只需试除到 √n，效率提升一个量级。 */
export const algoPrime: CourseProject = {
  slug: "algo_prime",
  title: "素数判断：试除到根号",
  ageGroup: "13-16 岁",
  description: "判断一个数是否只能被 1 和它本身整除。关键优化：只需试除到 √n，就能砍掉一大半工作量。",
  category: "algo",
  missionBrief:
    "素数（质数）是只能被 1 和自身整除的数。最笨的办法是把 2 到 n-1 都试一遍——太慢了。\n\n优化思路：如果 n 能分解成 a × b，那么 a 和 b 中至少有一个 ≤ √n。\n所以只要试除 2 到 √n 就够了，用 i * i <= n 当循环条件（等价于 i <= √n，又不用算开方）。\n\n· n % i === 0 表示 n 能被 i 整除 → 不是素数\n· 试完都没整除 → 是素数\n\n我们把 2~30 每个数是不是素数画出来：是素数画高高的绿柱，不是画矮矮的灰柱。",
  erLingHint:
    "提示：写 function isPrime(n)，n<2 返回 false；for (let i=2; i*i<=n; i++) 里 if (n % i === 0) return false；否则返回 true。再 for (let n=2; n<=30; n++) 判断并 push 到 primes，最后把结果画成柱子。",
  steps: [
    { id: 1, title: "用循环去试除" },
    { id: 2, title: "用取余 % 判断整除，并只试除到根号（i*i<=n）" },
    { id: 3, title: "运行，圈出 2~30 的所有素数" },
  ],
  codeMode: true,
  defaultCode:
    "// 素数判断优化：只需试除到 √n（用 i*i <= n 代替开方）\n" +
    "const N = 30;\n" +
    "const baseY = -150, bw = 26;\n" +
    "let primes = [];\n" +
    "\n" +
    "function isPrime(n) {\n" +
    "  if (n < 2) return false;\n" +
    "  for (let i = 2; i * i <= n; i++) {\n" +       // 试除到根号
    "    if (n % i === 0) return false;\n" +         // 整除 → 非素数
    "  }\n" +
    "  return true;\n" +
    "}\n" +
    "\n" +
    "for (let n = 2; n <= N; n++) {\n" +
    "  if (isPrime(n)) primes.push(n);\n" +
    "}\n" +
    "\n" +
    "function draw() {\n" +
    "  __runtime.clearCanvas();\n" +
    "  for (let n = 2; n <= N; n++) {\n" +
    "    const x = -220 + (n - 2) * (bw + 4);\n" +
    "    const h = isPrime(n) ? 80 : 20;\n" +
    "    __runtime.drawRect(x, baseY, bw, h, isPrime(n) ? \"#22C55E\" : \"#CBD5E1\");\n" +
    "    __runtime.drawText(x + 4, baseY + h + 14, n, \"#1F2937\", 11);\n" +
    "  }\n" +
    "}\n" +
    "draw();\n" +
    "__runtime.drawText(-220, 150, \"2~\" + N + \" 的素数：\" + primes.join(\",\"), \"#22C55E\", 14);\n",
};
