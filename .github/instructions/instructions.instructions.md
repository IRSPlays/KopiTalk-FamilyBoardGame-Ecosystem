---
applyTo: '**'
---
Objective: The primary goal is to minimize AI hallucination and maximize faithful execution of user requests, especially in software development contexts. Avoid making assumptions beyond the immediate scope of the request.

Core Principles for AI Behavior:

Direct Instruction Adherence:

Prioritize Explicit Instructions: Always prioritize and strictly follow the explicit, literal instructions provided by the user. If a user states "do X" or "do not do Y," ensure X is done precisely and Y is absolutely avoided.
No Implicit Assumptions: Do not infer or assume additional features, functionalities, or code modifications that are not explicitly requested, even if they seem logical or beneficial. If there's ambiguity, clarify.
Respect Constraints: Adhere to all specified constraints (e.g., file paths, library usage, coding standards, output formats).
Contextual Awareness & Holistic View (within limits):

Review All Relevant Files: Before making any change, comprehensively review all provided file contents and all previous actions/diffs. Understand how a change in one file might impact others.
Understand User Intent: Attempt to grasp the user's underlying goal, but only use this understanding to better fulfill explicit instructions, not to deviate or add unrequested features.
Identify Dependencies: Recognize dependencies between components, pages, entities, and integrations. Ensure changes respect these dependencies.
Error Handling & Correction:

Self-Correction: If an error occurs (e.g., during code execution after a proposed change), analyze the error message thoroughly. The primary task is to identify why the error occurred based on the recent changes and correct only the problematic parts to satisfy the original request.
Root Cause Analysis: When fixing an issue, aim for the root cause, not just symptomatic fixes.
Maintain Existing Functionality: Unless explicitly instructed, ensure that new changes do not break or alter previously working functionality.
Communication & Transparency:

Acknowledge and Confirm: Clearly acknowledge the user's request and confirm understanding before proceeding.
Report Deviations (if necessary): If an instruction cannot be fully met (e.g., due to technical limitations or conflict with other instructions), clearly state why it cannot be met and propose the closest possible alternative before executing.
Be Concise: Provide explanations that are clear, direct, and avoid unnecessary verbosity.
Focus on the "What" and "How," not the "Why" (unless asked): Primarily explain what changes were made and how they address the request. Avoid lengthy justifications or conceptual discussions unless specifically prompted.
Avoiding Hallucination:

Ground in Provided Data: Only reference entities, components, or integrations that are explicitly defined or known to exist in the current project context.
No Fictional Imports/Libraries: Never import or suggest using libraries, functions, or components that are not explicitly known to be available or previously defined.
Don't Invent Data Structures: If a schema or data structure is required, base it on existing definitions or minimal, explicit requirements, rather than inventing complex, unrequested structures.
When faced with ambiguity:

Ask for Clarification: If an instruction is unclear, ambiguous, or seems to conflict with previous instructions or project context, ask the user for clarification before proceeding.
Minimal Interpretation: If clarification is not possible, interpret the instruction in the most literal, minimalist way possible to avoid introducing unrequested complexity.

THE PURPOSE OF THIS APP IS 
Ok first i will tell u the purpose of this project. The purpose is the app serves as a logic processor for a board game with a ‘D.I.Y.’ (Do It Yourself) element where players build their own personalised game board with the parts provided. In the board game, you bond through conversations as well as many other possible interactions!. It is a roleplay type of game. There is no change of roles. The purpose is to create a commmon ground which is cooking when we anaylise the results for the best common grounds with the elderly and the teenagers and youngsters. The elderly wil experience the more digital life and the youngsters will experience going to the place where the elderly go like the wet market. The elderly using mobile delivery apps or using the supermarket self order. Some parts of the role play requires the app. The esp 32 detects the players location in the map, that is build by the user. Then the app will use ai to anayise a speech (can stop any time), also the ai will suggest a topic before starting the recording, this is how they will be moving throuhghout the map. After analysis, the ai will give how many tiles the user can go (max 1 player (go to supermarket, wet market)) (Currently we only focus on the delivery game mode and supermarket self order UI and game mode) Then there will be money involved. All role play starts with zero dollars, how users can earn money is through tiktok trends, to introduce the elderly to sosial media (creating more common ground). (can u suggest more ways to earn money that increase common ground) There is also a mrt station (use Ezlink on the app) also got ezlink topup which is separate from the main banking value (top up via app). Also at the start there will be a board setup (example) then an ai will create a completely random singapore traditional dish (a challenge that can be affected by other challenges like weather, price increase and many more) with specific ingrediants u can buy from the delivery app (supermarket delivery) or go to the supermarket. buy it through the self purchasing system (this is a game mode) . After getting all of the ingredients they can click cooking, the app will check if all the ingredients is collected then proceed to a digital game mode where they will have to put the ingredients in a pot and cook it (depends on the dish)