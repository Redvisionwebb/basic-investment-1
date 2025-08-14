// app/renewal/page.js
export default function RenewalPage() {
    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Your Plan Has Expired</h1>
                <p className="mt-4 text-lg">Please renew your subscription to continue using our services.</p>
                <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded">
                    Renew Now
                </button>
            </div>
        </div>
    );
}
