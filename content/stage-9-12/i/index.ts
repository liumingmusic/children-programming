import type { CourseProject } from "@/courses";
import { storyBranchProject } from "./story_branch";
import { storyClickableProject } from "./story_clickable";
import { storyAdventureProject } from "./story_adventure";
import { storyGrowthProject } from "./story_growth";
import { storyScienceProject } from "./story_science";
import { storyCardProject } from "./story_card";

export const stage9StoryProjects: CourseProject[] = [
  storyBranchProject,
  storyClickableProject,
  storyAdventureProject,
  storyGrowthProject,
  storyScienceProject,
  storyCardProject,
];
