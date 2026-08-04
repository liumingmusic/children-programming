import type { CourseProject } from "@/courses";
import { helloProject } from "./seq/hello";
import { flagProject } from "./seq/flag";
import { stoneProject } from "./seq/stone";
import { shapeLProject } from "./seq/shapeL";
import { homeProject } from "./seq/home";
import { mazeProject } from "./seq/maze";
import { arrowProject } from "./seq/arrow";
import { zigzagProject } from "./seq/zigzag";
import { treasureProject } from "./seq/treasure";
import { danceProject } from "./seq/dance";
import { frameProject } from "./seq/frame";
import { squareProject } from "./loop/square";
import { triangleProject } from "./loop/triangle";
import { pentagonProject } from "./loop/pentagon";
import { spinProject } from "./loop/spin";
import { stairsProject } from "./loop/stairs";
import { waveProject } from "./loop/wave";
import { spiralProject } from "./loop/spiral";
import { fenceProject } from "./loop/fence";
import { windmillProject } from "./loop/windmill";
import { pickfruitProject } from "./loop/pickfruit";
import { rainbowProject } from "./draw/rainbow";
import { star5Project } from "./draw/star5";
import { flowerProject } from "./draw/flower";
import { snowflakeProject } from "./draw/snowflake";
import { mandalaProject } from "./draw/mandala";
import { concentricProject } from "./draw/concentric";
import { connectdotProject } from "./draw/connectdot";
import { houseProject } from "./draw/house";
import { letterProject } from "./draw/letter";
import { checkerboardProject } from "./draw/checkerboard";
import { clickJumpProject } from "./event/click_jump";
import { clickColorProject } from "./event/click_color";
import { clickDialogProject } from "./event/click_dialog";
import { twoEventsProject } from "./event/two_events";
import { clickPlayDialogProject } from "./event/click_play_dialog";
import { autoPatrolProject } from "./event/auto_patrol";
import { keyForwardProject } from "./event/key_forward";
import { edgeBounceProject } from "./event/edge_bounce";
import { sizeToggleProject } from "./event/size_toggle";
import { expressionShakeProject } from "./event/expression_shake";
import { ifTouchStarProject } from "./cond/if_touch_star";
import { ifEdgeTurnProject } from "./cond/if_edge_turn";
import { ifRedStopProject } from "./cond/if_red_stop";
import { clickLeftRightProject } from "./cond/click_left_right";
import { collect3Project } from "./cond/collect3";
import { randomBranchProject } from "./cond/random_branch";
import { oddEvenProject } from "./cond/odd_even";
import { sizeThresholdProject } from "./cond/size_threshold";
import { avoidObstacleProject } from "./cond/avoid_obstacle";
import { escapeBadguyProject } from "./cond/escape_badguy";
import { starsProject } from "./game/stars";
import { mazeExitProject } from "./game/maze_exit";
import { collectApplesProject } from "./game/collect_apples";
import { lightLanternsProject } from "./game/light_lanterns";
import { collectRainbowProject } from "./game/collect_rainbow";
import { treasureMapProject } from "./game/treasure_map";
import { escortProject } from "./game/escort";
import { trafficPoliceProject } from "./game/traffic_police";
import { dodgeCloudsProject } from "./game/dodge_clouds";
import { memoryMatchProject } from "./game/memory_match";
import { playDoremiProject } from "./music/play_doremi";
import { twinkleProject } from "./music/twinkle";
import { drumBeatProject } from "./music/drum_beat";
import { randomNoteProject } from "./music/random_note";
import { loopMelodyProject } from "./music/loop_melody";
import { pitchByClickProject } from "./music/pitch_by_click";
import { pitchByMoveProject } from "./music/pitch_by_move";
import { chordProject } from "./music/chord";
import { birthdayProject } from "./music/birthday";
import { composeProject } from "./music/compose";
import { count10Project } from "./math/count10";
import { countApplesProject } from "./math/count_apples";
import { compareSizeProject } from "./math/compare_size";
import { addSubProject } from "./math/add_sub";
import { shapeNamesProject } from "./math/shape_names";
import { symmetryProject } from "./math/symmetry";
import { multiplicationProject } from "./math/multiplication";
import { clockProject } from "./math/clock";
import { geometryPuzzleProject } from "./math/geometry_puzzle";
import { calculatorProject } from "./math/calculator";

export const seqProjects: CourseProject[] = [helloProject, flagProject, stoneProject, shapeLProject, homeProject, mazeProject, arrowProject, zigzagProject, treasureProject, danceProject, frameProject];
export const loopProjects: CourseProject[] = [squareProject, triangleProject, pentagonProject, spinProject, stairsProject, waveProject, spiralProject, fenceProject, windmillProject, pickfruitProject];
export const drawProjects: CourseProject[] = [rainbowProject, star5Project, flowerProject, snowflakeProject, mandalaProject, concentricProject, connectdotProject, houseProject, letterProject, checkerboardProject];
export const eventProjects: CourseProject[] = [clickJumpProject, clickColorProject, clickDialogProject, twoEventsProject, clickPlayDialogProject, autoPatrolProject, keyForwardProject, edgeBounceProject, sizeToggleProject, expressionShakeProject];
export const condProjects: CourseProject[] = [ifTouchStarProject, ifEdgeTurnProject, ifRedStopProject, clickLeftRightProject, collect3Project, randomBranchProject, oddEvenProject, sizeThresholdProject, avoidObstacleProject, escapeBadguyProject];
export const gameProjects: CourseProject[] = [starsProject, mazeExitProject, collectApplesProject, lightLanternsProject, collectRainbowProject, treasureMapProject, escortProject, trafficPoliceProject, dodgeCloudsProject, memoryMatchProject];
export const musicProjects: CourseProject[] = [playDoremiProject, twinkleProject, drumBeatProject, randomNoteProject, loopMelodyProject, pitchByClickProject, pitchByMoveProject, chordProject, birthdayProject, composeProject];
export const mathProjects: CourseProject[] = [count10Project, countApplesProject, compareSizeProject, addSubProject, shapeNamesProject, symmetryProject, multiplicationProject, clockProject, geometryPuzzleProject, calculatorProject];

/** 全 81 项目，按 projectSlugs 规范顺序：seq→loop→draw→event→cond→game→music→math。
 * 运行时的 MIRROR 坐标镜像、getProject、闯关路径等逻辑对本文件导出的对象照常生效。 */
export const stage6Projects: CourseProject[] = [
  ...seqProjects,
  ...loopProjects,
  ...drawProjects,
  ...eventProjects,
  ...condProjects,
  ...gameProjects,
  ...musicProjects,
  ...mathProjects,
];
