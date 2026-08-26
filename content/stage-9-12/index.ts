import type { CourseProject } from "@/courses";
import { fn_squareProject } from "./a/fn_square";
import { fn_polygonProject } from "./a/fn_polygon";
import { fn_houseProject } from "./a/fn_house";
import { fn_snowflakeProject } from "./a/fn_snowflake";
import { fn_treeProject } from "./a/fn_tree";
import { fn_toolboxProject } from "./a/fn_toolbox";
import { fn_spiralProject } from "./a/fn_spiral";
import { fn_castleProject } from "./a/fn_castle";
import { var_counterProject } from "./b/var_counter";
import { var_scoreProject } from "./b/var_score";
import { var_livesProject } from "./b/var_lives";
import { var_speedProject } from "./b/var_speed";
import { var_parityProject } from "./b/var_parity";
import { var_gradientProject } from "./b/var_gradient";
import { var_timerProject } from "./b/var_timer";
import { var_bestProject } from "./b/var_best";
import { stage9MultiProjects } from "./c";
import { stage9KeyProjects } from "./d";
import { stage9StoryProjects } from "./i";
import { stage9MusicProjects } from "./e";
import { stage9MathProjects } from "./f";

export const stage9Projects: CourseProject[] = [
  fn_squareProject,
  fn_polygonProject,
  fn_houseProject,
  fn_snowflakeProject,
  fn_treeProject,
  fn_toolboxProject,
  fn_spiralProject,
  fn_castleProject,
  var_counterProject,
  var_scoreProject,
  var_livesProject,
  var_speedProject,
  var_parityProject,
  var_gradientProject,
  var_timerProject,
  var_bestProject,
  ...stage9MultiProjects,
  ...stage9KeyProjects,
  ...stage9StoryProjects,
  ...stage9MusicProjects,
  ...stage9MathProjects,
];
