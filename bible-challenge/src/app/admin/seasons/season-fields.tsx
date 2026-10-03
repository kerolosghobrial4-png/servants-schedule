import { Checkbox, Field, Input, Textarea } from "@/components/ui";

export function SeasonFields({
  defaults,
}: {
  defaults?: { name: string; description: string; startsOn: string; endsOn: string; isActive: boolean };
}) {
  return (
    <>
      <Field label="Name" htmlFor="name">
        <Input id="name" name="name" required maxLength={80} defaultValue={defaults?.name} placeholder="Fall 2026 Bible Challenge" />
      </Field>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" name="description" maxLength={500} rows={2} defaultValue={defaults?.description} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Starts" htmlFor="startsOn">
          <Input id="startsOn" name="startsOn" type="date" required defaultValue={defaults?.startsOn} />
        </Field>
        <Field label="Ends" htmlFor="endsOn">
          <Input id="endsOn" name="endsOn" type="date" required defaultValue={defaults?.endsOn} />
        </Field>
      </div>
      <Checkbox name="isActive" defaultChecked={defaults?.isActive ?? true} label="Active" hint="Active seasons appear on students' dashboards and leaderboards." />
    </>
  );
}
