const axios = require('axios');

const fetchProblemMetadata = async (link) => {
  try {
    console.log(`Fetching metadata for: ${link}`);

    // Extract problem identifier from the link
    const match = link.match(/problemset\/problem\/(\d+)\/(\w+)/);
    if (!match) {
      console.warn("Invalid problem link format.");
      return null;
    }

    const contestId = match[1];
    const index = match[2];

    // Codeforces API to fetch problem metadata
    const response = await axios.get(`https://codeforces.com/api/problemset.problems`);
    const problems = response.data.result.problems;

    // Find the matching problem
    const problem = problems.find(p => p.contestId == contestId && p.index == index);
    if (!problem) {
      console.warn("Problem not found in API response.");
      return null;
    }
    console.log("Problem" , problem);
    return {
      title: problem.name,
      tags: problem.tags,
      rating: problem.rating || "Unrated"
    };

  } catch (err) {
    console.error("❌ Metadata API Error:", err.message);
    return null;
  }
};

module.exports = { fetchProblemMetadata };
