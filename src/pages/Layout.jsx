import React, { useEffect, useState } from "react";
import {
  AppShell,
  Burger,
  Group,
  UnstyledButton,
  Text,
  Avatar,
  Menu,
  Stack,
  rem,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link as LinkIcon, LogOut, Plus, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <UnstyledButton
    onClick={onClick}
    style={(theme) => ({
      display: "flex",
      alignItems: "center",
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.radius.md,
      backgroundColor: active ? theme.colors.blue[0] : "transparent",
      color: active ? theme.colors.blue[7] : theme.black,
      fontWeight: active ? 600 : 400,
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.colors.gray[0],
      },
    })}
  >
    <Icon size={20} style={{ marginRight: rem(10) }} />
    <Text size="sm">{label}</Text>
  </UnstyledButton>
);

const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (err) {
        console.error("Invalid user object in localStorage");
      }
    }
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Group
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            >
              <LinkIcon size={24} color="#228be6" />
              <Text fw={700} size="lg" c="blue.7">
                ShortLink
              </Text>
            </Group>
          </Group>

          <Menu
            width={200}
            position="bottom-end"
            withArrow
            arrowPosition="center"
          >
            <Menu.Target>
              <UnstyledButton>
                <Group>
                  <Avatar color="blue" radius="xl">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  {!isSmallScreen && (
                    <div>
                      <Text size="sm" fw={500}>
                        {user?.username}
                      </Text>
                      <Text c="dimmed" size="xs">
                        {user?.email}
                      </Text>
                    </div>
                  )}
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <LogOut style={{ width: rem(14), height: rem(14) }} />
                }
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack>
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={location.pathname === "/"}
            onClick={() => {
              navigate("/");
              toggle(); // close navbar on mobile
            }}
          />
          <NavItem
            icon={Plus}
            label="Create New Link"
            active={location.pathname === "/new"}
            onClick={() => {
              navigate("/new");
              toggle(); // close navbar on mobile
            }}
          />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
