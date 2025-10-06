import { getServiceData } from "@/lib/functions";
import ServicesLanding from "../ServicesLanding";

// Converts a string to a slug
function toSlug(text = "") {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/[^\w-]+/g, '')   // Remove all non-word chars
    .replace(/--+/g, '-');     // Replace multiple - with single -
}

// Optional: for static generation of all service pages
export async function generateStaticParams() {
  const allServices = await getServiceData();
  return allServices.map((item) => ({
    slug: toSlug(item.name),
  }));
}

const page = async ({ params }) => {
  const { slug } = params;

  const allServices = await getServiceData();

  // Find the service that matches the URL slug
  const backendData = allServices.find((item) => toSlug(item.name) === slug);

  if (!backendData) {
    return (
      <div className="p-10 text-center text-red-500">
        Service not found
      </div>
    );
  }

  return <ServicesLanding data={backendData} />;
};

export default page;
