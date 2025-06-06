// import React from "react";
// import { useSearchParams, Link as RouterLink } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Title,
//   Text,
//   Button,
//   Group,
//   Alert,
// } from "@mantine/core";
// import { LinkIcon, AlertTriangle } from "lucide-react";

// const InvalidPage = () => {
//   const [searchParams] = useSearchParams();
//   const reason = searchParams.get("reason");

//   const getErrorMessage = (reason) => {
//     switch (reason) {
//       case "not_found":
//         return "This link does not exist.";
//       case "expired":
//         return "This link has expired.";
//       case "inactive":
//         return "This link is currently inactive.";
//       case "invalid_code":
//         return "The provided code is invalid.";
//       case "server_error":
//         return "A server error occurred. Please try again.";
//       default:
//         return "An unknown error occurred.";
//     }
//   };

//   return (
//     <Container size={420} my={60}>
//       <Group justify="center" mb="lg">
//         <LinkIcon size={32} color="#1890FF" />
//         <Title order={1} ta="center" c="brand.6">
//           ShortLink
//         </Title>
//       </Group>

//       <Paper withBorder radius="md" p={30} mt={30} shadow="md">
//         <Alert
//           color="red"
//           title="Link Error"
//           icon={<AlertTriangle size={18} />}
//           mb="md"
//         >
//           {getErrorMessage(reason)}
//         </Alert>

//         <Text size="sm" mb="xl" ta="center">
//           You can go back to the homepage and try again.
//         </Text>

//         <Button component={RouterLink} to="/" fullWidth>
//           Go to Homepage
//         </Button>
//       </Paper>
//     </Container>
//   );
// };

// export default InvalidPage;

import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Container, Alert, Button, Text, Title } from "@mantine/core";
import { AlertTriangle } from "lucide-react";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const InvalidPage = () => {
  const query = useQuery();
  const reason = query.get("reason");

  const getMessage = () => {
    switch (reason) {
      case "not_found":
        return "This link does not exist.";
      case "inactive":
        return "This link is currently inactive.";
      case "expired":
        return "This link has expired.";
      case "invalid_code":
        return "The provided code is invalid.";
      case "server_error":
        return "A server error occurred. Please try again later.";
      default:
        return "An unknown error occurred.";
    }
  };

  return (
    <Container size={420} my={60}>
      <Title order={2} align="center" mb="md">
        Link Error
      </Title>
      <Alert
        icon={<AlertTriangle size={18} />}
        color="red"
        title="Error"
        mb="xl"
      >
        {getMessage()}
      </Alert>
      <Text align="center" mb="md">
        Please go back to the homepage and try again.
      </Text>
      <Button component={Link} to="/" fullWidth>
        Go to Homepage
      </Button>
    </Container>
  );
};

export default InvalidPage;
