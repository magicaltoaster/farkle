import './App.css'
import { Flex, Box, Text } from "@radix-ui/themes";

function App() {
  return (
    <Flex direction="row" width="100vw" height="100vh">
      {/* Left Column - Game State (with two rows inside) */}
      <Box width="80%" p="4" style={{ border: "1px solid black" }}>
        <Flex direction="column" gap="4">
          {/* Top row */}
          <Box p="4" style={{ border: "1px solid red" }}>
            <Text size="4" weight="bold">Dice Selection</Text>
            <Text>First row content goes here.</Text>
          </Box>

          {/* Bottom row */}
          <Box p="4" style={{ border: "1px solid blue" }}>
            <Text size="4" weight="bold">Probability Display</Text>
            <Text>Second row content goes here.</Text>
          </Box>
        </Flex>
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

