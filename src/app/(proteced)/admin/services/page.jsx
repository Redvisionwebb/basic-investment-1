
import DefaultLayout from "@/components/admin/Layouts/DefaultLaout";
import ServicesTabel from "@/components/tables/servicesTabel";
import { getServiceData } from "@/lib/functions";

const AdminServices = async () => {
    const services = await getServiceData();
    console.log(services)
    return (
        <DefaultLayout>
            <h1 className="font-bold text-2xl">Our Services </h1>
            <ServicesTabel services={services} />
        </DefaultLayout>
    );
};

export default AdminServices;
