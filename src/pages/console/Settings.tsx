import { useState } from "react";
import type { ReactNode } from "react";
import { Cpu, Bell, ShieldCheck, Sliders } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-white/[0.12]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [autoApprove, setAutoApprove] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [requireSecondApproval, setRequireSecondApproval] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How Clarus runs the Invoice-to-Pay process. Policy changes apply to new
          invoices entering the Maestro flow.
        </p>
      </div>

      {/* Automation policy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" /> Automation policy
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow
            title="Auto-approve clean invoices"
            desc="Straight-through process invoices with a clean 3-way match under the approval threshold."
          >
            <Toggle checked={autoApprove} onChange={setAutoApprove} />
          </SettingRow>
          <SettingRow
            title="Auto-approval threshold"
            desc="Invoices above this amount always require a human approval."
          >
            <span className="font-display text-lg font-semibold tabular-nums">
              $10,000
            </span>
          </SettingRow>
          <SettingRow
            title="Require second approval over $50k"
            desc="High-value invoices route to Finance for a second sign-off after AP review."
          >
            <Toggle
              checked={requireSecondApproval}
              onChange={setRequireSecondApproval}
            />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <SettingRow
            title="Email me when an invoice needs review"
            desc="Get notified the moment Maestro pauses a case at a human task."
          >
            <Toggle checked={emailNotify} onChange={setEmailNotify} />
          </SettingRow>
        </CardContent>
      </Card>

      {/* Environment (read-only) */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" /> Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          <InfoRow label="Orchestration" value="UiPath Maestro · DefaultTenant" />
          <InfoRow label="Agent model" value="google/gemma-4-26b-a4b-it (OpenRouter)" />
          <InfoRow label="Agent service" value="FastAPI · /extract /match /triage" />
          <InfoRow label="Process status" value="Live" valueTone="text-success" />
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
              DC
            </span>
            <div className="leading-tight">
              <p className="text-sm font-medium">Dharan K</p>
              <p className="text-xs text-muted-foreground">
                AP Reviewer · dharankandasamy2007@gmail.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SettingRow({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  valueTone = "text-foreground",
}: {
  label: string;
  value: string;
  valueTone?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${valueTone}`}>{value}</span>
    </div>
  );
}
