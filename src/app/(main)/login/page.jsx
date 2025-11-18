import { getActiveLogindesk, getRoboUser, getSiteData } from "@/lib/functions";
import LoginPageModule from "./login";
import InnerBanner from "@/components/innerBanner/InnerBanner";


const LoginPage = async () => {
  const roboUser = await getRoboUser();
  const sitedata = await getSiteData();
  const login = await getActiveLogindesk();

  return (
    <>
    <InnerBanner title={"Login"} />
      <LoginPageModule roboUser={roboUser} sitedata={sitedata} login={login && login[0]} />
    </>
  );
};

export default LoginPage;