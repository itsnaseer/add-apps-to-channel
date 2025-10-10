import { Manifest } from "deno-slack-sdk/mod.ts";
import { AddAppsToChannelsDef } from "./functions/add_apps_to_channels.ts";

export default Manifest({
  name: "Add App to Channel",
  description:
    "Add one or more Slack apps (bots) to a channel via Workflow Builder",
  icon: "assets/app_icon.png",
  functions: [AddAppsToChannelsDef],
  // runOnSlack is implicit in current SDK; no settings block needed.
  botScopes: [
    "workflow.steps:execute",
    "chat:write",
    "channels:read",
    "channels:join",
    "channels:write.invites",
    "channels:manage",
    "groups:read",
    "groups:write.invites",
  ],
});
