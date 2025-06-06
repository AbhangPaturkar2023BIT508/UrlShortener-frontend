// import React, { useEffect, useState } from "react";
// import { useParams, Link as RouterLink } from "react-router-dom";
// import {
//   Container,
//   Paper,
//   Title,
//   Text,
//   Button,
//   Group,
//   Alert,
//   Loader,
// } from "@mantine/core";
// import { LinkIcon, AlertTriangle } from "lucide-react";
// import { fetchRedirectInfo } from "../services/LinkService";

// const Redirect = () => {
//   const { shortCode } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [errorReason, setErrorReason] = useState(null);

//   useEffect(() => {
//     console.log(shortCode);
//     const handleRedirect = async () => {
//       if (!shortCode) {
//         setErrorReason("invalid_code");
//         setLoading(false);
//         return;
//       }

//       try {
//         const result = await fetchRedirectInfo(shortCode);

//         if (result.status === 302 && result.location) {
//           // Successful redirect — send user to original URL
//           window.location.href = result.location;
//         } else {
//           // Link not found, expired, or inactive (reason embedded in URL)
//           const reasonMatch = result.location?.match(/reason=([^&]+)/);
//           setErrorReason(reasonMatch ? reasonMatch[1] : "unknown");
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Redirect error:", err);
//         setErrorReason("server_error");
//         setLoading(false);
//       }
//     };

//     handleRedirect();
//   }, [shortCode]);

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

//   if (loading) {
//     return (
//       <Container
//         size={420}
//         my={80}
//         className="flex flex-col items-center justify-center"
//       >
//         <Loader size="xl" color="blue" />
//         <Text mt="md" c="dimmed">
//           Redirecting to your link...
//         </Text>
//       </Container>
//     );
//   }

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
//           {getErrorMessage(errorReason)}
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

// export default Redirect;

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const Redirect = () => {
  const { shortCode } = useParams();

  useEffect(() => {
    if (shortCode) {
      window.location.href = `http://localhost:8080/${shortCode}`;
    }
  }, [shortCode]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Redirecting...</h2>
      <p>
        If you are not redirected automatically,{" "}
        <a href={`http://localhost:8080/${shortCode}`}>click here</a>.
      </p>
    </div>
  );
};

export default Redirect;
