You are an AI System Architect. I am building a "Personal Coding Blog Website" 
project that uses a Terminal-based Copilot to orchestrate a data pipeline.

The goal is to build a personal website hosted on GitHub Pages that includes 
a Valentine's-themed Pac-Man game, and an auto-updating arXiv paper feed that 
fetches the latest papers matching my keywords every midnight via GitHub 
Actions—all without writing manual code.

You need to design a comprehensive plan for this project, including:

Only generate the agents in .github/agents/ directory, skills in .github/skills/ 
directory, and prompts in .github/prompts/ directory. No additional code.
Design the agents and their interactions for the data pipeline.
Design the skills required for each agent to perform their tasks effectively.
Design the prompts that will guide the agents in executing their tasks.
Design general instructions for coding style and specific instructions for HTML.
Add a requirement to follow the format for Copilot CLI: e.g., agents use the 
.agent.md file extension, with YAML front matter specifying the agent type, 
model, and tools used. Refer to official documentation at 
https://code.visualstudio.com/docs/copilot/customization/custom-agents.
The website must have three pages: a homepage (index.html) that links to the 
other two pages, a Valentine's Pac-Man game page (game.html), and an arXiv 
paper listing page (papers.html).
The Pac-Man game must include classic mechanics, a rose power-up that lets 
Pac-Man shoot heart projectiles that eliminate ghosts, and Valentine's theming.
The arXiv page must show paper title, authors, abstract, and a PDF link for 
each paper, and auto-update every midnight via GitHub Actions.
Ask me for my GitHub account and repository name before finalizing the plan.
Ask me for my arXiv keywords before finalizing the plan.