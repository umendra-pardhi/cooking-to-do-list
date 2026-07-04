import { GoogleGenerativeAI } from '@google/generative-ai';

export const getApiKey = () => {
  return import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
};

export const generateCookingPlan = async (params) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined. Please add "GEMINI_API_KEY=your_api_key_here" to your .env file in the project root and restart the development server if needed.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // We use gemini-2.5-flash as the default fast model
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    }
  });

  const prompt = `
You are an expert personal chef and meal planner AI.
Generate a structured personal cooking to-do list and meal plan for a single day based on these user inputs:
- Daily Schedule / Vibe: "${params.schedule}"
- Dietary Preferences / Restrictions: "${params.dietary || 'None'}"
- Available Kitchen Equipment: ${params.equipment && params.equipment.length > 0 ? params.equipment.join(', ') : 'All standard kitchen equipment'}
- Target Daily Budget: ${params.budget ? `$${params.budget}` : 'Reasonable/Moderate'}
- Number of Servings: ${params.servings || 1}

Your output must be a single, valid JSON object containing breakfast, lunch, dinner, a grocery list with price estimates, a list of substitutions, and budget feasibility breakdown.

Structure your response EXACTLY as the following JSON format:
{
  "meals": {
    "breakfast": {
      "name": "Name of breakfast meal",
      "prepTime": "Prep time (e.g. 5 mins)",
      "cookTime": "Cook time (e.g. 10 mins)",
      "description": "Short explanation of the meal",
      "equipment": ["Equipment 1", "Equipment 2"],
      "ingredients": [
        { "name": "Ingredient name", "amount": "Amount with unit" }
      ],
      "instructions": [
        "First step description",
        "Second step description"
      ]
    },
    "lunch": {
      "name": "Name of lunch meal",
      "prepTime": "Prep time (e.g. 10 mins)",
      "cookTime": "Cook time (e.g. 15 mins)",
      "description": "Short explanation of the meal",
      "equipment": ["Equipment 1", "Equipment 2"],
      "ingredients": [
        { "name": "Ingredient name", "amount": "Amount with unit" }
      ],
      "instructions": [
        "First step description",
        "Second step description"
      ]
    },
    "dinner": {
      "name": "Name of dinner meal",
      "prepTime": "Prep time (e.g. 15 mins)",
      "cookTime": "Cook time (e.g. 20 mins)",
      "description": "Short explanation of the meal",
      "equipment": ["Equipment 1", "Equipment 2"],
      "ingredients": [
        { "name": "Ingredient name", "amount": "Amount with unit" }
      ],
      "instructions": [
        "First step description",
        "Second step description"
      ]
    }
  },
  "groceryList": [
    {
      "name": "Ingredient name",
      "amount": "Total quantity needed for all meals",
      "estimatedCost": 2.50,
      "category": "Produce / Pantry / Dairy / Meat / Bakery / Other"
    }
  ],
  "substitutions": [
    {
      "original": "Ingredient name to replace",
      "substitute": "Suggested substitute ingredient",
      "reason": "Why suggest this (e.g., lower budget alternative, common allergen alternative, vegan option)",
      "notes": "Adjustment instructions (e.g. use same quantity)",
      "impact": "Impact statement (e.g. 'Saves $1.20', 'Makes the recipe gluten-free')"
    }
  ],
  "budgetFeasibility": {
    "totalEstimatedCost": 18.50,
    "feasibilityStatus": "feasible", 
    "breakdown": "A brief explanation of where the budget goes and why it is feasible, tight, or over the limit.",
    "savingTips": [
      "Tip 1 to save money on this plan",
      "Tip 2 to save money on this plan"
    ]
  }
}

Rules for generation:
1. Ensure the recipes are realistic and use ingredients that can be combined efficiently.
2. The total estimated cost must be a sum of the estimated costs of all grocery items. The grocery items must have reasonable, realistic prices (e.g., a lemon is $0.50, 500g chicken is $5.00, etc.).
3. The feasibilityStatus should be "feasible" if totalEstimatedCost <= target budget, "tight" if it is slightly over or very close, and "over-budget" if it exceeds the target budget significantly. If target budget is not specified, status should be "feasible".
4. The instructions must be clear, simple, and action-oriented.
5. Pay strict attention to the available kitchen equipment. Do not propose baking if they don't have an oven.
6. Pay strict attention to dietary preferences (e.g. no meat for Vegetarian, no wheat/gluten for Gluten-Free, no animal products for Vegan).
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON output
    // Clean up markdown block quotes if present
    const cleanText = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error generating cooking plan:', error);
    throw error;
  }
};
