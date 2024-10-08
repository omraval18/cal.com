import { _generateMetadata } from "app/_utils";
import { getFixedT } from "app/_utils";
import { getServerSession } from "next-auth";

import { AUTH_OPTIONS } from "@calcom/feature-auth/lib/next-auth-options";
import SettingsHeader from "@calcom/features/settings/appDir/SettingsHeader";

import ImpersonationView from "~/settings/admin/impersonation-view";

export const generateMetadata = async () =>
  await _generateMetadata(
    (t) => t("admin"),
    (t) => t("impersonation")
  );

const Page = async () => {
  const session = await getServerSession(AUTH_OPTIONS);

  const t = await getFixedT(session?.user.locale || "en");
  return (
    <SettingsHeader title={t("admin")} description={t("impersonation")}>
      <ImpersonationView />
    </SettingsHeader>
  );
};

export default Page;
