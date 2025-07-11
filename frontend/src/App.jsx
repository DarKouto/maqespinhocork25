import { Button, Center, Box } from '@chakra-ui/react'; // Importa os componentes do Chakra UI

function App() {
  return (
    // O componente Center é do Chakra UI e centraliza o seu conteúdo
    <Center h="100vh" bg="gray.50"> {/* h="100vh" é 100% da altura da viewport, bg="gray.50" é um cinzento claro */}
      <Box p="6" boxShadow="lg" bg="white" borderRadius="md"> {/* p é padding, boxShadow é uma sombra, borderRadius é o arredondar dos cantos */}
        <Button colorScheme="teal" size="lg" onClick={() => alert('Olá do Chakra UI!')}>
          Clica-me!
        </Button>
      </Box>
    </Center>
  );
}

export default App;
