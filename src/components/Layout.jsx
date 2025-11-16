import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <div>Header</div>
      <Outlet />
      <div>Footer</div>
    </>
  );
}

export default Layout;
