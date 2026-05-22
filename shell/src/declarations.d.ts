declare module "*.css";

declare module "appDashboard/Dashboard" {
  import { ComponentType } from "react";
  const Dashboard: ComponentType;
  export default Dashboard;
}

declare module "appSettings/Settings" {
  import { ComponentType } from "react";
  const Settings: ComponentType;
  export default Settings;
}