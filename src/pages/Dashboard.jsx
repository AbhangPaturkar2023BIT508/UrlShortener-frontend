import React, { useState } from "react";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  Badge,
  ActionIcon,
  CopyButton,
  Tooltip,
  Modal,
  SimpleGrid,
  Center,
  Stack,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  Trash,
  Copy,
  Calendar,
  Clock,
  QrCode,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { linkService } from "../services/linkService";
import { notifications } from "@mantine/notifications";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Fix the state setup and fallback to empty array
  const [links, setLinks] = useState(() =>
    user ? linkService.getUserLinks(user.id) : []
  );
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);

  const handleDeleteLink = (id) => {
    const success = linkService.deleteLink(id);
    if (success) {
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      notifications.show({
        title: "Link deleted",
        message: "Your link has been successfully deleted",
        color: "green",
      });
    }
  };

  const openQrModal = (link) => {
    setSelectedLink(link);
    setQrModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString();
  };

  const getFullShortUrl = (code) => `${window.location.origin}/r/${code}`;

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Your Shortened Links</Title>
        <Button onClick={() => navigate("/new")}>Create New Link</Button>
      </Group>

      {links.length === 0 ? (
        <Card withBorder p="xl" radius="md">
          <Stack align="center">
            <Text size="lg">You don't have any shortened links yet.</Text>
            <Button onClick={() => navigate("/new")}>
              Create your first link
            </Button>
          </Stack>
        </Card>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {links.map((link) => (
            <Card key={link.id} withBorder shadow="sm" radius="md" p="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <div>
                    <Text fw={500} size="lg" lineClamp={1}>
                      {link.shortCode}
                    </Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {getFullShortUrl(link.shortCode)}
                    </Text>
                  </div>
                  <Group>
                    <CopyButton value={getFullShortUrl(link.shortCode)}>
                      {({ copied, copy }) => (
                        <Tooltip
                          label={copied ? "Copied" : "Copy"}
                          withArrow
                          position="top"
                        >
                          <ActionIcon
                            color={copied ? "teal" : "gray"}
                            onClick={copy}
                          >
                            <Copy size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                    <Tooltip label="Generate QR Code" withArrow position="top">
                      <ActionIcon onClick={() => openQrModal(link)}>
                        <QrCode size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete" withArrow position="top">
                      <ActionIcon
                        color="red"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Card.Section>

              <Group mt="md" mb="xs">
                <Text size="sm" lineClamp={2}>
                  {link.originalUrl}
                </Text>
              </Group>

              <Group justify="space-between" mt="md">
                <Badge color={link.isEncrypted ? "green" : "gray"}>
                  {link.isEncrypted ? "Encrypted" : "Not Encrypted"}
                </Badge>
                <Badge color="blue">{link.clicks} clicks</Badge>
              </Group>

              <Group mt="md" spacing="xs">
                <Calendar size={14} />
                <Text size="xs">Created: {formatDate(link.createdAt)}</Text>
              </Group>

              {link.expiresAt && (
                <Group mt="xs" spacing="xs">
                  <Clock size={14} />
                  <Text size="xs">Expires: {formatDate(link.expiresAt)}</Text>
                </Group>
              )}

              <Button
                fullWidth
                variant="light"
                mt="md"
                leftSection={<ExternalLink size={14} />}
                component="a"
                href={getFullShortUrl(link.shortCode)}
                target="_blank"
              >
                Open Link
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <Modal
        opened={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title="QR Code"
        centered
      >
        {selectedLink && (
          <Stack align="center" spacing="md">
            <QRCodeSVG
              value={getFullShortUrl(selectedLink.shortCode)}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
            />
            <Text fw={500}>{selectedLink.shortCode}</Text>
            <Text size="sm" c="dimmed">
              {getFullShortUrl(selectedLink.shortCode)}
            </Text>
            <CopyButton value={getFullShortUrl(selectedLink.shortCode)}>
              {({ copied, copy }) => (
                <Button
                  onClick={copy}
                  variant="light"
                  leftSection={<Copy size={16} />}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              )}
            </CopyButton>
          </Stack>
        )}
      </Modal>
    </Container>
  );
};

export default Dashboard;
