# 🧩 Add Apps to Channel

A Slack Function that automatically adds one or more agents or apps (bot users) to a specified channel when used as part of a Slack Workflow.

Built with the [Deno Slack SDK](https://api.slack.com/automation/deno) and designed for the Slack ROSI (Run On Slack Infrastructure) runtime.

---

## 🚀 Overview

This function can be added as a step in any Workflow Builder flow.  
It supports chaining with other steps — for example:

1. **Create a Channel**  
2. **Add Apps to Channel** ← (this function)  
3. **Post Welcome Message**

When triggered, it ensures the app has access to the target channel, then invites the specified app IDs.

---

## ⚙️ Features

- Works in **public channels** ONLY for now
- Handles **duplicate invites** gracefully (`already_in_channel`)  
- Provides clear error guidance if the app isn’t a member yet  
- Built to support multi-step **Slack Workflows**

---

## 🧠 Inputs

| Parameter | Type | Required | Description |
|------------|------|-----------|--------------|
| `target_channel` | `slack#/types/channel_id` | ✅ | Channel to invite apps to |
| `app_ids` | `string` | ❌ | Comma-separated list of Slack app user IDs (`U123,U456`). If empty, defaults to `DEFAULT_APP_IDS` environment variable |

---

## 📤 Outputs

| Name | Type | Description |
|------|------|-------------|
| `channel` | `slack#/types/channel_id` | Channel where the apps were added |
| `added` | `string` | Comma-separated list of added app user IDs |

---

## 🔐 Scopes Required

```json
"oauth_config": {
  "scopes": {
    "bot": [
      "workflow.steps:execute",
      "chat:write",
      "channels:read",
      "channels:join",
      "channels:write.invites",
      "channels:manage",
      "groups:read",
      "groups:write.invites",
    ]
  }
}