import type { PageProps } from "app/_types";
import { _generateMetadata } from "app/_utils";
import { WithLayout } from "app/layoutHOC";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { z } from "zod";

import { AUTH_OPTIONS } from "@calcom/features/auth/lib/next-auth-options";
import LegacyPage from "@calcom/features/ee/workflows/pages/workflow";
import { WorkflowRepository } from "@calcom/lib/server/repository/workflow";

const querySchema = z.object({
  workflow: z.string(),
});

export const generateMetadata = async ({ params, searchParams }: PageProps) => {
  const parsed = querySchema.safeParse({ ...params, ...searchParams });
  if (!parsed.success) {
    notFound();
  }

  const workflow = await WorkflowRepository.getById({ id: +parsed.data.workflow });

  return await _generateMetadata(
    () => (workflow && workflow.name ? workflow.name : "Untitled"),
    () => ""
  );
};

export const generateStaticParams = () => [];

const Page = async ({ params, searchParams }: PageProps) => {
  const session = await getServerSession(AUTH_OPTIONS);
  const user = session?.user;
  const parsed = querySchema.safeParse({ ...params, ...searchParams });
  if (!parsed.success) {
    notFound();
  }

  const workflow = await WorkflowRepository.getById({ id: +parsed.data.workflow });
  let verifiedEmails, verifiedNumbers;
  try {
    verifiedEmails = await WorkflowRepository.getVerifiedEmails({
      userEmail: user?.email ?? null,
      userId: user?.id ?? null,
      teamId: workflow?.team?.id,
    });
  } catch (err) {}
  try {
    verifiedNumbers = await WorkflowRepository.getVerifiedNumbers({
      userId: user?.id ?? null,
      teamId: workflow?.team?.id,
    });
  } catch (err) {}

  return (
    <LegacyPage workflowData={workflow} verifiedEmails={verifiedEmails} verifiedNumbers={verifiedNumbers} />
  );
};

export default WithLayout({ getLayout: null, ServerPage: Page });
export const dynamic = "force-static";
// generate segments on demand
export const dynamicParams = true;
export const revalidate = 10;
