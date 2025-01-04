import React, { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthContext } from "../../contexts/authContext";

// 利用 MUI 提供的 mixins 创建一个用于占位的组件，避免被 AppBar 覆盖
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const SiteHeader = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 从 AuthContext 获取登录状态和操作方法
  const context = useContext(AuthContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // 导航菜单选项：可随需要增删
  const menuOptions = [
    { label: "Home", path: "/" },
    { label: "Favorites", path: "/movies/favorites" },
    { label: "Upcoming", path: "/movies/upcoming" },
    { label: "Nowplaying", path: "/movies/nowplaying" },
    { label: "Popularity", path: "/movies/popularity" },
  ];

  const handleMenuSelect = (pageURL) => {
    navigate(pageURL, { replace: true });
    setAnchorEl(null); // 点击后关闭菜单
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 登录 / 登出 相关按钮
  const AuthButtons = () => {
    if (context.isAuthenticated) {
      return (
        <>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Welcome, {context.userName}!
          </Typography>
          <Button color="inherit" onClick={() => context.signout()}>
            Sign out
          </Button>
        </>
      );
    } else {
      return (
        <Button color="inherit" onClick={() => navigate("/login")}>
          Login
        </Button>
      );
    }
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          {/* 左侧标题 */}
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            TMDB Client
          </Typography>

          {/* 另一段说明文字 */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            All you ever wanted to know about Movies!
          </Typography>

          {/* 导航菜单 + 登录状态 */}
          {isMobile ? (
            // 如果是移动端，使用汉堡菜单
            <>
              <IconButton
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={() => setAnchorEl(null)}
              >
                {/* 移动端菜单项 */}
                {menuOptions.map((opt) => (
                  <MenuItem
                    key={opt.label}
                    onClick={() => handleMenuSelect(opt.path)}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
                {/* 分隔符后放登录/登出功能 */}
                <MenuItem disabled divider />
                <MenuItem
                  onClick={() => {
                    context.isAuthenticated
                      ? context.signout()
                      : navigate("/login");
                    setAnchorEl(null);
                  }}
                >
                  {context.isAuthenticated ? "Sign out" : "Login"}
                </MenuItem>
              </Menu>
            </>
          ) : (
            // 如果是桌面端，则显示为 Button
            <>
              {menuOptions.map((opt) => (
                <Button
                  key={opt.label}
                  color="inherit"
                  onClick={() => handleMenuSelect(opt.path)}
                >
                  {opt.label}
                </Button>
              ))}
              {/* 右侧的登录/登出按钮 */}
              <AuthButtons />
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* 占位以避免内容被固定定位的 AppBar 遮挡 */}
      <Offset />
    </>
  );
};

export default SiteHeader;
