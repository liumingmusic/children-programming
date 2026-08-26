import type { CourseProject } from "@/courses";
import { gameSnakeProject } from "./game_snake";
import { gameShooterProject } from "./game_shooter";
import { gameDodgeProject } from "./game_dodge";
import { gameRaceProject } from "./game_race";
import { gameGuessProject } from "./game_guess";
import { gameMemoryProject } from "./game_memory";
import { game2048LiteProject } from "./game_2048lite";
import { gamePuzzleProject } from "./game_puzzle";

export const stage9GameProjects: CourseProject[] = [
  gameSnakeProject,
  gameShooterProject,
  gameDodgeProject,
  gameRaceProject,
  gameGuessProject,
  gameMemoryProject,
  game2048LiteProject,
  gamePuzzleProject,
];
