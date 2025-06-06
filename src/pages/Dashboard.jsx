import React, { useEffect, useState } from "react";
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
  Stack,
  Pagination,
  Tabs,
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
import { notifications } from "@mantine/notifications";
import { deleteLink, getLinks } from "../services/LinkService.js";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [links, setLinks] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [screenSize, setScreenSize] = useState("large");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setScreenSize("small");
      else if (width < 1024) setScreenSize("medium");
      else setScreenSize("large");
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      getLinks(user.id)
        .then((res) => {
          const sortedLinks = res.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLinks(res);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleDeleteLink = async (id) => {
    try {
      await deleteLink(id);
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
      notifications.show({
        title: "Link Deleted",
        message: "Your link has been successfully deleted",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Delete failed",
        message: error.message || "Could not delete the link",
        color: "red",
      });
    }
  };

  const openQrModal = (link) => {
    setSelectedLink(link);
    setQrModalOpen(true);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (let [unit, secondsPerUnit] of Object.entries(intervals)) {
      const count = Math.floor(seconds / secondsPerUnit);
      if (count > 0) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const getFullShortUrl = (code) => `${window.location.origin}/${code}`;

  const itemsPerPage =
    screenSize === "small" ? 3 : screenSize === "medium" ? 4 : 6;

  const activeLinks = links.filter((link) => link.active);
  const inactiveLinks = links.filter((link) => !link.active);

  const paginatedActiveLinks = activeLinks.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );
  const paginatedInactiveLinks = inactiveLinks.slice(
    (inactivePage - 1) * itemsPerPage,
    inactivePage * itemsPerPage
  );

  const renderLinkCard = (link) => (
    <Card key={link.id} withBorder shadow="sm" radius="md" p="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <div>
            <Text fw={500} size="lg" lineClamp={1}>
              {link.customCode}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {getFullShortUrl(link.customCode)}
            </Text>
          </div>
          <Group>
            <CopyButton value={getFullShortUrl(link.customCode)}>
              {({ copied, copy }) => (
                <Tooltip
                  label={copied ? "Copied" : "Copy"}
                  withArrow
                  position="top"
                >
                  <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
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
              <ActionIcon color="red" onClick={() => handleDeleteLink(link.id)}>
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>

      <Group mt="md" mb="xs" direction="column" spacing={4}>
        <Text
          size="sm"
          lineClamp={2}
          component="a"
          href={link.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "underline" }}
        >
          {link.originalUrl}
        </Text>
        <Text size="xs" color="dimmed" italic="true">
          Created: {getTimeAgo(link.createdAt)}
        </Text>
      </Group>

      <Group justify="space-between" mt="md">
        <Badge color={link.active ? "green" : "gray"}>
          {link.active ? "Active" : "In-active"}
        </Badge>
        <Badge color="blue">{link.clicks} clicks</Badge>
      </Group>

      <Group mt="md" spacing="xs">
        <Calendar size={14} />
        <Text size="xs">
          Activate:{" "}
          {link.activateAt
            ? formatDate(link.activateAt)
            : formatDate(link.createdAt)}
        </Text>
      </Group>

      <Group mt="xs" spacing="xs">
        <Clock size={14} />
        <Text size="xs">
          Expires: {link.expiresAt ? formatDate(link.expiresAt) : "NA"}
        </Text>
      </Group>

      <Button
        fullWidth
        variant="light"
        mt="md"
        leftSection={<ExternalLink size={14} />}
        component="a"
        href={getFullShortUrl(link.customCode)}
        target="_blank"
      >
        Open Link
      </Button>
    </Card>
  );

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
        <Tabs defaultValue="active">
          <Tabs.List>
            <Tabs.Tab value="active">Active Links</Tabs.Tab>
            <Tabs.Tab value="inactive">Inactive Links</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt="md">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {paginatedActiveLinks.map(renderLinkCard)}
            </SimpleGrid>
            <Group justify="flex-end" mt="md">
              <Pagination
                total={Math.ceil(activeLinks.length / itemsPerPage)}
                value={activePage}
                onChange={setActivePage}
              />
            </Group>
          </Tabs.Panel>

          <Tabs.Panel value="inactive" pt="md">
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {paginatedInactiveLinks.map(renderLinkCard)}
            </SimpleGrid>
            <Group justify="flex-end" mt="md">
              <Pagination
                total={Math.ceil(inactiveLinks.length / itemsPerPage)}
                value={inactivePage}
                onChange={setInactivePage}
              />
            </Group>
          </Tabs.Panel>
        </Tabs>
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
              value={getFullShortUrl(selectedLink.customCode)}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
            />
            <Text fw={500}>{selectedLink.customCode}</Text>
            <Text size="sm" c="dimmed">
              {getFullShortUrl(selectedLink.customCode)}
            </Text>
            <CopyButton value={getFullShortUrl(selectedLink.customCode)}>
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
