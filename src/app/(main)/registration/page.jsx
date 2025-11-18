import InnerBanner from "@/components/innerBanner/InnerBanner";
import RegistrationComponent from "@/components/robo/registration/registrationcomponent";
import { getActiveLogindesk, getRoboUser, getSiteData } from "@/lib/functions";
import { redirect } from "next/navigation";


export default async function Registration() {
  const roboUser = await getRoboUser();
  const sitedata=await getSiteData();
  const login=await getActiveLogindesk();
  if (!roboUser) redirect("/");

  return (
    <>
      <InnerBanner title={"Software Registration"} />
      <RegistrationComponent roboUser={roboUser} sitedata={sitedata} login={login[0]} />
    </>
  );
}
