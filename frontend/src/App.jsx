import { Button, Center, Box, Heading, Text, VStack } from '@chakra-ui/react';
function App() {
  return (

    <VStack spacing={4} p={8}>

      <Heading as="h1" size="2xl" color="teal.500">
        MaqEspinhoCork 2025
      </Heading>

      <Text fontSize="xl" color="gray.700">
        Site em construção
      </Text>

      <Center h="100vh" bg="" w="100vw">
        <Box p="6" boxShadow="lg" bg="white" borderRadius="md">
          <Button colorScheme="teal" size="lg" onClick={() => alert('Olá do Chakra UI!')}>
            Clica-me!
          </Button>
        </Box>
      </Center>
      
    </VStack>
  );
}

export default App;
