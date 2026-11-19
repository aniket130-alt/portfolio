"use client";

import { ABOUT_FIELDS, TABLES } from "../config/fields";
import { Subsection } from "../ui/Subsection";
import { ProfileEditor } from "./ProfileEditor";
import { TableEditor } from "./TableEditor";

/** About tab: bio/image/location + stats + the degree line. */
export function AboutEditor() {
  return (
    <div className="space-y-10">
      <Subsection title="Bio & image" sub="The text and image in the About card.">
        <ProfileEditor fields={ABOUT_FIELDS} />
      </Subsection>
      <Subsection title="Stats" sub="The numbers shown under your bio.">
        <TableEditor config={TABLES.stats} />
      </Subsection>
      <Subsection title="Education" sub="The entry marked “Main degree” is shown under the About image.">
        <TableEditor config={TABLES.education} />
      </Subsection>
      <p className="text-sm text-subtle">The section heading is under Site text → About.</p>
    </div>
  );
}
