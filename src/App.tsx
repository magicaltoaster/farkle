import './App.css'
import { useState } from "react";
import { Flex, Box, Button, Text } from "@radix-ui/themes";

function App() {
  // State to track dice counts (1-6, all starting at 0)
  const [diceCounts, setDiceCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
  const [result, setResult] = useState("");

  // Function to update dice count
  const updateCount = (die: number, change: number) => {
    setDiceCounts((prev) => ({
      ...prev,
      [die]: Math.max(0, Math.min(6, prev[die] + change)), // Ensure 0 ≤ count ≤ 6
    }));
  };

  function calculateBestMove(diceRoll: number[]) {
    const counts: Record<number, number> = {}; // Stores how many of each dice were rolled
    diceRoll.forEach(die => counts[die] = (counts[die] || 0) + 1);

    let score = 0;
    let keepers: number[] = [];

    // Check for scoring combinations
    const has1to5Straight = [1, 2, 3, 4, 5].every(n => counts[n] > 0);
    const has2to6Straight = [2, 3, 4, 5, 6].every(n => counts[n] > 0);
    const hasFullStraight = has1to5Straight && counts[6] > 0;

    if (hasFullStraight) {
      score += 1500;
      keepers = [1, 2, 3, 4, 5, 6]; // Keep all dice
    } else if (has2to6Straight) {
      score += 750;
      keepers = [2, 3, 4, 5, 6];
    } else if (has1to5Straight) {
      score += 500;
      keepers = [1, 2, 3, 4, 5];
    }

    // Check for three-of-a-kind and higher
    for (let num = 1; num <= 6; num++) {
      if (counts[num] >= 3) {
        let baseScore = num === 1 ? 1000 : num * 100;
        let multiplier = 1;

        // Check for four, five, or six of a kind (double each time)
        if (counts[num] >= 4) multiplier *= 2;
        if (counts[num] >= 5) multiplier *= 2;
        if (counts[num] >= 6) multiplier *= 2;

        score += baseScore * multiplier;
        keepers.push(...Array(counts[num]).fill(num));
      }
    }

    // Count single 1s and 5s if they aren't already part of another combination
    if (!keepers.includes(1) && counts[1]) {
      score += counts[1] * 100;
      keepers.push(...Array(counts[1]).fill(1));
    }
    if (!keepers.includes(5) && counts[5]) {
      score += counts[5] * 50;
      keepers.push(...Array(counts[5]).fill(5));
    }

    // Determine remaining dice for reroll
    const remainingDice = diceRoll.filter(die => !keepers.includes(die));

    return {
      keepers,
      score,
      remainingDice,
    };
  }

  // Convert state object to array and calculate best move
  const handleCalculate = () => {
    const diceRoll = Object.entries(diceCounts)
      .flatMap(([die, count]) => Array(count).fill(Number(die))); // Convert dice counts to array
    const result = calculateBestMove(diceRoll);
    setResult(`Keep: ${result.keepers.join(", ")} | Score: ${result.score} | Re-roll: ${result.remainingDice.join(", ") || "None"}`);
  };

  return (
    <Flex direction="row" width="100vw" height="100vh">
      {/* Left Column - Game State */}
      <Box width="80%" p="4" style={{ border: "1px solid black" }}>
        <Text size="4" weight="bold">Game State</Text>

        {/* Dice Selection Section */}
        <Flex direction="row" gap="4" align="center" mt="4">
          {Object.keys(diceCounts).map((die) => (
            <Flex key={die} direction="column" align="center" gap="2">
              <Text size="6" weight="bold">{die}</Text>
              <Button onClick={() => updateCount(Number(die), 1)}>+</Button>
              <Text size="5">{diceCounts[Number(die)]}</Text>
              <Button onClick={() => updateCount(Number(die), -1)}>-</Button>
            </Flex>
          ))}
          {/* Calculate Button */}
          <Button onClick={handleCalculate} color="crimson" size="4">Calculate</Button>
        </Flex>

        {/* Result Display */}
        {result && (
          <Box p="4" mt="4" style={{ border: "1px solid black" }}>
            <Text size="4" weight="bold">Calculation Result</Text>
            <Text>{result}</Text>
          </Box>
        )}
      </Box>

      {/* Right Column - Cheat Dice */}
      <Box width="20%" p="4" style={{ border: "1px solid black" }}>
        <Text size="4" weight="bold">Cheat Dice</Text>
        <Text>List of cheat dice goes here.</Text>
      </Box>
    </Flex>
  );
}

export default App;

