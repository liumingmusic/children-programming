import type { CourseProject } from "@/courses";
import { listShoppingProject } from "./list_shopping";
import { listRollcallProject } from "./list_rollcall";
import { listRankingProject } from "./list_ranking";
import { listLotteryProject } from "./list_lottery";
import { listTodoProject } from "./list_todo";
import { listWordsProject } from "./list_words";
import { listScoresProject } from "./list_scores";
import { listQueueProject } from "./list_queue";

export const stage9ListProjects: CourseProject[] = [
  listShoppingProject,
  listRollcallProject,
  listRankingProject,
  listLotteryProject,
  listTodoProject,
  listWordsProject,
  listScoresProject,
  listQueueProject,
];
