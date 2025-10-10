import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const AddAppsToChannelsDef = DefineFunction({
  callback_id: "add_apps_to_channels",
  title: "Add Apps to Channel",
  description: "Invite one or more Slack apps (bot users) to a channel",
  source_file: "functions/add_apps_to_channels.ts",
  input_parameters: {
    properties: {
      target_channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to invite apps to",
      },
      app_ids: {
        type: Schema.types.string,
        description:
          "Comma-separated Slack app user IDs (U123,U456). Optional.",
      },
    },
    required: ["target_channel"],
  },
  output_parameters: {
    properties: {
      channel: { type: Schema.slack.types.channel_id },
      added: { type: Schema.types.string },
    },
    required: ["channel"],
  },
});

export default SlackFunction(
  AddAppsToChannelsDef,
  async ({ inputs, client, env }) => {
    console.log("⚙️ add_apps_to_channels triggered");

    // Allow either a pure ID (Cxxxx) or a pasted URL containing it
    let channel = inputs.target_channel as string;
    const m = channel.match(/(C[A-Z0-9]+)/);
    if (m) channel = m[1];

    // Parse app IDs from input or env
    const csv = (inputs.app_ids || env.DEFAULT_APP_IDS || "").trim();
    if (!csv) {
      return { error: "No app IDs provided (and DEFAULT_APP_IDS not set)." };
    }

    const appIds = csv
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (appIds.length === 0) return { error: "Parsed app_ids is empty." };

    // 1) Ensure THIS app is already in the channel (ROSI can't self-join)
    const info = await client.conversations.info({ channel });
    const isMember =
      info.ok && typeof info.channel === "object" && "is_member" in info.channel
        ? (info.channel as { is_member?: boolean }).is_member === true
        : false;
    console.log(isMember);
    if (!isMember) {
      console.log("not a member");
      await client.conversations.join({
        channel: channel,
      });
      console.log("workflow joined the channel");
    }

    // 2) Invite the provided app/bot user IDs
    const invite = await client.conversations.invite({
      channel,
      users: appIds.join(","),
    });

    if (!invite.ok) {
      // Map common error to clearer guidance
      if (invite.error === "not_in_channel") {
        return {
          error:
            "Invite failed: not_in_channel. Make sure this app is already a member of the target channel, then try again.",
        };
      }
      return { error: `Invite failed: ${invite.error}` };
    }

    // 3) Optional: post a confirmation
    // await client.chat.postMessage({
    //   channel,
    //   text: `✅ Added apps to <#${channel}>: ${appIds.join(", ")}`,
    // }).catch(() => {});

    console.log(`✅ Invited apps: ${appIds.join(", ")} to ${channel}`);
    return { outputs: { channel, added: appIds.join(",") } };
  },
);
